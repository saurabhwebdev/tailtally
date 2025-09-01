import connectDB, { MONGODB_ENV, MONGODB_DB_NAME } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Check connection state
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Get database information
    const dbStats = await mongoose.connection.db.stats();
    
    return Response.json({
      success: true,
      status: 'healthy',
      connection: {
        state: stateMap[connectionState],
        environment: MONGODB_ENV,
        database: MONGODB_DB_NAME,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      },
      stats: {
        collections: dbStats.collections,
        documents: dbStats.objects,
        dataSize: `${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        storageSize: `${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json(
      {
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}