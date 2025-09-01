import connectDB, { MONGODB_ENV, MONGODB_DB_NAME } from '@/lib/mongodb';
import Pet from '@/models/Pet';
import Owner from '@/models/Owner';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';
import petNotificationService from '@/lib/pet-notification-service';

export async function GET(request) {
  try {
    const authResult = await requireAuth(request);
    
    // If auth failed, return the error response
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    
    await connectDB();
    
    // Build query based on user role
    let query = { isActive: true };
    
    // Customers can only see their own pets
    if (user.role === 'customer') {
      // Try to find owner by user ID first, then fallback to userOwner
      const owner = await Owner.findOne({ userAccount: user._id });
      if (owner) {
        query.owner = owner._id;
      } else {
        query.userOwner = user._id;
      }
    }
    
    // Add filters from query parameters
    const species = searchParams.get('species');
    const ownerId = searchParams.get('owner');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    if (species) {
      query.species = species.toLowerCase();
    }
    
    if (ownerId && user.role !== 'customer') {
      query.owner = ownerId;
    }

    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { breed: searchRegex },
        { color: searchRegex },
        { 'ownerInfo.name': searchRegex },
        { 'ownerInfo.email': searchRegex }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const pets = await Pet.find(query)
      .populate('owner', 'firstName lastName email phone')
      .populate('userOwner', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Pet.countDocuments(query);
    
    return Response.json({
      success: true,
      message: 'Pets retrieved successfully',
      data: {
        pets,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: pets.length,
          totalCount: total
        }
      },
      environment: MONGODB_ENV,
      database: MONGODB_DB_NAME
    });
  } catch (error) {
    console.error('Get pets error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to retrieve pets',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.WRITE_PETS]);
    
    // If auth failed, return the error response
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: authResult.message.includes('permissions') ? 403 : 401 }
      );
    }
    
    const { user } = authResult;
    
    await connectDB();
    
    const body = await request.json();
    
    // Debug: Log the request data
    console.log('Pet creation request:', {
      userRole: user.role,
      userId: user._id,
      userFullName: user.fullName,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.email,
      userObject: JSON.stringify(user, null, 2),
      body: body
    });
    
    // Set owner based on user role
    let petData = { ...body };
    
    if (user.role === 'customer') {
      // Customers can only create pets for themselves
      // Try to find or create owner record
      let owner = await Owner.findOne({ userAccount: user._id });
      if (!owner) {
        // Create owner record for the user
        owner = new Owner({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          userAccount: user._id,
          isActive: true
        });
        await owner.save();
      }
      petData.owner = owner._id;
      petData.userOwner = user._id;
    } else {
      // Staff and above can create pets for any owner
      if (!petData.owner) {
        // Check if this is a new owner (no owner ID but has ownerInfo)
        if (petData.ownerInfo && petData.ownerInfo.name && petData.ownerInfo.email) {
          // Check if owner with this email already exists
          const existingOwner = await Owner.findOne({ email: petData.ownerInfo.email.toLowerCase() });
          if (existingOwner) {
            petData.owner = existingOwner._id;
          } else {
            // Create new owner record
            const [firstName, ...lastNameParts] = petData.ownerInfo.name.split(' ');
            const lastName = lastNameParts.join(' ') || '';
            
            const newOwner = new Owner({
              firstName: firstName || 'Unknown',
              lastName: lastName,
              email: petData.ownerInfo.email.toLowerCase(),
              phone: petData.ownerInfo.phone || '',
              isActive: true
            });
            
            await newOwner.save();
            petData.owner = newOwner._id;
            
            console.log('Created new owner record for pet:', {
              ownerId: newOwner._id,
              email: newOwner.email,
              name: newOwner.firstName + ' ' + newOwner.lastName
            });
          }
        } else {
          return Response.json(
            {
              success: false,
              message: 'Owner ID is required or owner information must be provided'
            },
            { status: 400 }
          );
        }
      } else {
        // Ensure owner is a valid ObjectId
        try {
          const mongoose = await import('mongoose');
          if (!mongoose.Types.ObjectId.isValid(petData.owner)) {
            return Response.json(
              {
                success: false,
                message: 'Invalid owner ID format'
              },
              { status: 400 }
            );
          }
        } catch (error) {
          console.error('Error validating ObjectId:', error);
          return Response.json(
            {
              success: false,
              message: 'Error validating owner ID'
            },
            { status: 400 }
          );
        }
      }
    }
    
    const pet = new Pet(petData);
    await pet.save();
    
    // Populate owner info for response
    await pet.populate('owner', 'firstName lastName email phone');
    await pet.populate('userOwner', 'firstName lastName email phone');
    
    // Send welcome email notification (async, don't wait for completion)
    try {
      const ownerData = pet.owner || pet.userOwner;
      if (ownerData && ownerData.email) {
        // Send email notification in background
        petNotificationService.sendPetRegistrationWelcome(
          pet.toObject(),
          ownerData.toObject(),
          user._id.toString()
        ).catch(emailError => {
          console.error('Failed to send pet registration welcome email:', emailError);
          // Don't fail the pet creation if email fails
        });
      }
    } catch (emailError) {
      console.error('Error setting up pet registration email:', emailError);
      // Don't fail the pet creation if email setup fails
    }
    
    return Response.json({
      success: true,
      message: 'Pet created successfully',
      data: { pet }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating pet:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      {
        success: false,
        message: 'Failed to create pet',
        error: error.message
      },
      { status: 500 }
    );
  }
}