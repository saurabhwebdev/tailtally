import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';
import { seedPets } from '@/lib/seed-pets';

export async function POST(request) {
  try {
    // Only admins can seed data
    const authResult = await requirePermission(request, [PERMISSIONS.MANAGE_SYSTEM]);
    
    if (authResult instanceof Response) {
      return authResult;
    }

    const pets = await seedPets();

    return Response.json({
      success: true,
      message: `Successfully seeded ${pets?.length || 0} pets`,
      data: { count: pets?.length || 0 }
    });
  } catch (error) {
    console.error('Seed pets error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to seed pets',
        error: error.message
      },
      { status: 500 }
    );
  }
}
