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
    
    // Customers can only add photos to their own pets
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
    const { url, description = '' } = body;
    
    if (!url) {
      return Response.json(
        {
          success: false,
          message: 'Photo URL is required'
        },
        { status: 400 }
      );
    }
    
    await pet.addPhoto(url, description);
    
    return Response.json({
      success: true,
      message: 'Photo added successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Add photo error:', error);
    
    return Response.json(
      {
        success: false,
        message: 'Failed to add photo',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.WRITE_PETS]);
    
    if (authResult instanceof Response) {
      return authResult;
    }
    
    const { user } = authResult;
    await connectDB();
    
    let query = { _id: params.id, isActive: true };
    
    // Customers can only delete photos from their own pets
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
    
    const { searchParams } = new URL(request.url);
    const photoIndex = parseInt(searchParams.get('index'));
    
    if (isNaN(photoIndex) || photoIndex < 0 || photoIndex >= pet.photos.length) {
      return Response.json(
        {
          success: false,
          message: 'Invalid photo index'
        },
        { status: 400 }
      );
    }
    
    // Remove the photo at the specified index
    pet.photos.splice(photoIndex, 1);
    await pet.save();
    
    return Response.json({
      success: true,
      message: 'Photo removed successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    
    return Response.json(
      {
        success: false,
        message: 'Failed to delete photo',
        error: error.message
      },
      { status: 500 }
    );
  }
}
