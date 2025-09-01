import connectDB, { MONGODB_ENV, MONGODB_DB_NAME } from '@/lib/mongodb';
import Owner from '@/models/Owner';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

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
    
    // Add filters from query parameters
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const tags = searchParams.get('tags');
    const source = searchParams.get('source');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex }
      ];
    }
    
    // Add city filter
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    
    // Add tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Add source filter
    if (source) {
      query.source = source;
    }
    
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const owners = await Owner.find(query)
      .populate('userAccount', 'firstName lastName email role')
      .populate('petsCount')
      .populate('activePetsCount')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await Owner.countDocuments(query);
    
    return Response.json({
      success: true,
      message: 'Owners retrieved successfully',
      data: {
        owners,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: owners.length,
          totalCount: total
        }
      },
      environment: MONGODB_ENV,
      database: MONGODB_DB_NAME
    });
  } catch (error) {
    console.error('Get owners error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to retrieve owners',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.WRITE_USERS]);
    
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
    
    // Log the received body to debug gender field
    console.log('Received POST body:', body);
    console.log('Gender field in POST body:', body.gender);
    
    // Check if owner with this email already exists
    const existingOwner = await Owner.findByEmail(body.email);
    if (existingOwner) {
      return Response.json(
        {
          success: false,
          message: 'An owner with this email already exists'
        },
        { status: 400 }
      );
    }
    
    // Check if owner with this phone already exists (if phone provided)
    if (body.phone) {
      const existingOwnerByPhone = await Owner.findByPhone(body.phone);
      if (existingOwnerByPhone) {
        return Response.json(
          {
            success: false,
            message: 'An owner with this phone number already exists'
          },
          { status: 400 }
        );
      }
    }
    
    // Create new owner
    const owner = new Owner(body);
    await owner.save();
    
    // Populate user account info for response
    await owner.populate('userAccount', 'firstName lastName email role');
    
    return Response.json({
      success: true,
      message: 'Owner created successfully',
      data: { owner }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating owner:', error);
    
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
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return Response.json(
        {
          success: false,
          message: `An owner with this ${field} already exists`
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      {
        success: false,
        message: 'Failed to create owner',
        error: error.message
      },
      { status: 500 }
    );
  }
}
