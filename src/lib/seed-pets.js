import connectDB from './mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';

const samplePets = [
  {
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    weight: 25.5,
    color: 'Golden',
    gender: 'male',
    neutered: true,
    microchipId: 'MC001234567',
    medicalHistory: [
      {
        date: new Date('2024-01-15'),
        type: 'checkup',
        description: 'Annual health checkup - all normal',
        veterinarian: 'Dr. Smith',
        notes: 'Healthy dog, good weight, all vaccinations up to date',
        cost: 150
      },
      {
        date: new Date('2023-06-10'),
        type: 'vaccination',
        description: 'Rabies vaccination',
        veterinarian: 'Dr. Johnson',
        cost: 75
      }
    ],
    vaccinations: [
      {
        name: 'Rabies',
        date: new Date('2023-06-10'),
        nextDue: new Date('2024-06-10')
      },
      {
        name: 'DHPP',
        date: new Date('2024-01-15'),
        nextDue: new Date('2025-01-15')
      }
    ]
  },
  {
    name: 'Whiskers',
    species: 'cat',
    breed: 'Persian',
    age: 2,
    weight: 4.2,
    color: 'White',
    gender: 'female',
    neutered: true,
    microchipId: 'MC001234568',
    medicalHistory: [
      {
        date: new Date('2024-02-01'),
        type: 'treatment',
        description: 'Treatment for respiratory infection',
        veterinarian: 'Dr. Brown',
        notes: 'Prescribed antibiotics, full recovery expected',
        cost: 200
      }
    ],
    vaccinations: [
      {
        name: 'FVRCP',
        date: new Date('2024-01-01'),
        nextDue: new Date('2025-01-01')
      }
    ]
  },
  {
    name: 'Charlie',
    species: 'dog',
    breed: 'Beagle',
    age: 5,
    weight: 18.0,
    color: 'Brown and White',
    gender: 'male',
    neutered: false,
    microchipId: 'MC001234569',
    medicalHistory: [
      {
        date: new Date('2024-01-20'),
        type: 'surgery',
        description: 'ACL repair surgery',
        veterinarian: 'Dr. Wilson',
        notes: 'Surgery successful, 6-week recovery period',
        cost: 2500
      }
    ],
    vaccinations: [
      {
        name: 'Rabies',
        date: new Date('2023-08-15'),
        nextDue: new Date('2024-08-15')
      }
    ]
  },
  {
    name: 'Luna',
    species: 'cat',
    breed: 'Siamese',
    age: 1,
    weight: 3.8,
    color: 'Seal Point',
    gender: 'female',
    neutered: false,
    medicalHistory: [],
    vaccinations: [
      {
        name: 'FVRCP',
        date: new Date('2024-02-15'),
        nextDue: new Date('2025-02-15')
      }
    ]
  },
  {
    name: 'Rocky',
    species: 'dog',
    breed: 'German Shepherd',
    age: 7,
    weight: 35.0,
    color: 'Black and Tan',
    gender: 'male',
    neutered: true,
    microchipId: 'MC001234570',
    medicalHistory: [
      {
        date: new Date('2024-01-05'),
        type: 'checkup',
        description: 'Senior wellness exam',
        veterinarian: 'Dr. Martinez',
        notes: 'Slight arthritis in hips, recommended joint supplements',
        cost: 180
      }
    ],
    vaccinations: [
      {
        name: 'Rabies',
        date: new Date('2023-12-01'),
        nextDue: new Date('2024-12-01')
      },
      {
        name: 'DHPP',
        date: new Date('2023-12-01'),
        nextDue: new Date('2024-12-01')
      }
    ]
  }
];

export async function seedPets() {
  try {
    await connectDB();
    
    // Check if pets already exist
    const existingPets = await Pet.countDocuments();
    if (existingPets > 0) {
      console.log('Pets already exist in database. Skipping seeding.');
      return;
    }

    // Find a customer user to assign as owner
    const customerUser = await User.findOne({ role: 'customer' });
    if (!customerUser) {
      console.log('No customer user found. Please create a customer user first.');
      return;
    }

    // Prepare pets with owner information
    const petsToSeed = samplePets.map(pet => ({
      ...pet,
      owner: customerUser._id,
      ownerInfo: {
        name: customerUser.fullName || `${customerUser.firstName} ${customerUser.lastName}`,
        email: customerUser.email,
        phone: customerUser.phone || '+1-555-0123'
      }
    }));

    // Insert pets
    const createdPets = await Pet.insertMany(petsToSeed);
    console.log(`Successfully seeded ${createdPets.length} pets`);
    
    return createdPets;
  } catch (error) {
    console.error('Error seeding pets:', error);
    throw error;
  }
}

export default seedPets;
