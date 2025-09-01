import connectDB from '@/lib/mongodb';
import Owner from '@/models/Owner';
import { requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

export async function POST(request) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.WRITE_USERS]);
    
    // If auth failed, return the error response
    if (authResult instanceof Response) {
      return authResult;
    }
    
    const { user } = authResult;
    
    await connectDB();
    
    // Sample owner data
    const sampleOwners = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        alternatePhone: '(555) 123-4568',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Spouse',
          phone: '(555) 123-4569',
          email: 'jane.smith@example.com'
        },
        preferences: {
          communicationMethod: 'email',
          appointmentReminders: true,
          vaccinationReminders: true,
          marketingCommunications: false,
          preferredContactTime: 'afternoon',
          notes: 'Prefers afternoon appointments'
        },
        billing: {
          preferredPaymentMethod: 'credit_card',
          insuranceProvider: 'PetCare Insurance',
          insurancePolicyNumber: 'PCI123456',
          discountEligible: false
        },
        source: 'walk_in',
        referredBy: 'Friend',
        tags: ['premium', 'regular'],
        totalVisits: 5,
        totalSpent: 1250.00,
        lastVisit: new Date('2024-01-15')
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '(555) 234-5678',
        address: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Mike Johnson',
          relationship: 'Husband',
          phone: '(555) 234-5679',
          email: 'mike.johnson@example.com'
        },
        preferences: {
          communicationMethod: 'sms',
          appointmentReminders: true,
          vaccinationReminders: true,
          marketingCommunications: true,
          preferredContactTime: 'morning',
          notes: 'Early morning appointments preferred'
        },
        billing: {
          preferredPaymentMethod: 'debit_card',
          discountEligible: true,
          discountReason: 'Senior citizen discount'
        },
        source: 'online',
        tags: ['senior', 'new'],
        totalVisits: 2,
        totalSpent: 450.00,
        lastVisit: new Date('2024-01-20')
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@example.com',
        phone: '(555) 345-6789',
        address: {
          street: '789 Pine Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Lisa Brown',
          relationship: 'Wife',
          phone: '(555) 345-6790',
          email: 'lisa.brown@example.com'
        },
        preferences: {
          communicationMethod: 'phone',
          appointmentReminders: true,
          vaccinationReminders: false,
          marketingCommunications: false,
          preferredContactTime: 'evening',
          notes: 'Evening appointments only'
        },
        billing: {
          preferredPaymentMethod: 'cash',
          discountEligible: false
        },
        source: 'referral',
        referredBy: 'Dr. Wilson',
        tags: ['referral', 'evening'],
        totalVisits: 8,
        totalSpent: 2100.00,
        lastVisit: new Date('2024-01-10')
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@example.com',
        phone: '(555) 456-7890',
        address: {
          street: '321 Elm Street',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Robert Davis',
          relationship: 'Father',
          phone: '(555) 456-7891',
          email: 'robert.davis@example.com'
        },
        preferences: {
          communicationMethod: 'email',
          appointmentReminders: true,
          vaccinationReminders: true,
          marketingCommunications: true,
          preferredContactTime: 'anytime',
          notes: 'Flexible with appointment times'
        },
        billing: {
          preferredPaymentMethod: 'insurance',
          insuranceProvider: 'VetCare Plus',
          insurancePolicyNumber: 'VCP789012',
          discountEligible: false
        },
        source: 'social_media',
        referredBy: 'Instagram Ad',
        tags: ['social', 'young'],
        totalVisits: 3,
        totalSpent: 750.00,
        lastVisit: new Date('2024-01-25')
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@example.com',
        phone: '(555) 567-8901',
        address: {
          street: '654 Maple Drive',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Patricia Wilson',
          relationship: 'Sister',
          phone: '(555) 567-8902',
          email: 'patricia.wilson@example.com'
        },
        preferences: {
          communicationMethod: 'mail',
          appointmentReminders: false,
          vaccinationReminders: true,
          marketingCommunications: false,
          preferredContactTime: 'afternoon',
          notes: 'Prefers mail communication'
        },
        billing: {
          preferredPaymentMethod: 'check',
          discountEligible: true,
          discountReason: 'Military discount'
        },
        source: 'advertisement',
        referredBy: 'Local Newspaper',
        tags: ['military', 'mail'],
        totalVisits: 12,
        totalSpent: 3200.00,
        lastVisit: new Date('2024-01-05')
      }
    ];
    
    // Check if owners already exist
    const existingOwners = await Owner.countDocuments();
    if (existingOwners > 0) {
      return Response.json(
        {
          success: false,
          message: 'Owners already exist in the database. Clear the database first if you want to reseed.'
        },
        { status: 400 }
      );
    }
    
    // Create owners
    const createdOwners = await Owner.insertMany(sampleOwners);
    
    return Response.json({
      success: true,
      message: `Successfully created ${createdOwners.length} sample owners`,
      data: {
        count: createdOwners.length,
        owners: createdOwners.map(owner => ({
          id: owner._id,
          name: owner.fullName,
          email: owner.email
        }))
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding owners:', error);
    
    if (error.code === 11000) {
      return Response.json(
        {
          success: false,
          message: 'Duplicate email found. Some owners may already exist.'
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      {
        success: false,
        message: 'Failed to seed owners',
        error: error.message
      },
      { status: 500 }
    );
  }
}
