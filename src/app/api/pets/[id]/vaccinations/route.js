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
    const { name, date, nextDue } = body;
    
    if (!name || !date) {
      return Response.json(
        {
          success: false,
          message: 'Vaccination name and date are required'
        },
        { status: 400 }
      );
    }
    
    await pet.addVaccination(name, new Date(date), nextDue ? new Date(nextDue) : null);
    
    return Response.json({
      success: true,
      message: 'Vaccination record added successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Add vaccination error:', error);
    
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
        message: 'Failed to add vaccination record',
        error: error.message
      },
      { status: 500 }
    );
  }
}
