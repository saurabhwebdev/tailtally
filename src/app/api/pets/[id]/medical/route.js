import connectDB from '@/lib/mongodb';
import Pet from '@/models/Pet';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

export async function POST(request, { params }) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.WRITE_PETS]);
    
    if (authResult instanceof Response) {
      return authResult;
    }
    
    const { user } = authResult;
    await connectDB();
    
    let query = { _id: params.id, isActive: true };
    
    // Customers can only add to their own pets
    if (user.role === 'customer') {
      query.owner = user._id;
    }
    
    const pet = await Pet.findOne(query);
    
    if (!pet) {
      return Response.json(
        {
          success: false,
          message: 'Pet not found'
        },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Add veterinarian name if user is vet/staff
    if (user.role === 'veterinarian' && !body.veterinarian) {
      body.veterinarian = user.fullName;
    }
    
    await pet.addMedicalRecord(body);
    
    return Response.json({
      success: true,
      message: 'Medical record added successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Add medical record error:', error);
    
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
        message: 'Failed to add medical record',
        error: error.message
      },
      { status: 500 }
    );
  }
}
