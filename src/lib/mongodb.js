import mongoose from 'mongoose';

const MONGODB_ENV = process.env.MONGODB_ENV || 'local';
const MONGODB_LOCAL_URI = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/petdb';
const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'petdb';

// Choose the URI based on environment setting
const getMongoURI = () => {
  if (MONGODB_ENV === 'atlas') {
    if (!MONGODB_ATLAS_URI) {
      throw new Error('MongoDB Atlas URI is not defined in environment variables');
    }
    return MONGODB_ATLAS_URI;
  }
  return MONGODB_LOCAL_URI;
};

const MONGODB_URI = getMongoURI();

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    console.log(`Connecting to MongoDB (${MONGODB_ENV}): ${MONGODB_DB_NAME}`);
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log(`🔗 Mongoose connected to ${MONGODB_ENV} database: ${MONGODB_DB_NAME}`);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed through app termination');
  process.exit(0);
});

export default connectDB;
export { MONGODB_ENV, MONGODB_DB_NAME };