# MongoDB Setup Guide

This application uses MongoDB as its database with support for both local MongoDB and MongoDB Atlas configurations.

## Database Configuration

The database name is set to `petdb` and can be easily switched between local MongoDB and MongoDB Atlas using environment variables.

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your configuration:

#### For Local MongoDB (Default)
```env
MONGODB_ENV=local
MONGODB_LOCAL_URI=mongodb://localhost:27017/petdb
MONGODB_DB_NAME=petdb
```

#### For MongoDB Atlas
```env
MONGODB_ENV=atlas
MONGODB_ATLAS_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/petdb?retryWrites=true&w=majority
MONGODB_DB_NAME=petdb
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_ENV` | Environment type: 'local' or 'atlas' | 'local' |
| `MONGODB_LOCAL_URI` | Local MongoDB connection string | 'mongodb://localhost:27017/petdb' |
| `MONGODB_ATLAS_URI` | MongoDB Atlas connection string | undefined |
| `MONGODB_DB_NAME` | Database name | 'petdb' |

## Getting Started

### Option 1: Local MongoDB

1. Install MongoDB locally or use Docker:
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB Community Server from https://www.mongodb.com/try/download/community
   ```

2. Set environment to local:
   ```env
   MONGODB_ENV=local
   ```

3. Start your Next.js application:
   ```bash
   npm run dev
   ```

### Option 2: MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string from Atlas
4. Update your `.env.local`:
   ```env
   MONGODB_ENV=atlas
   MONGODB_ATLAS_URI=your_atlas_connection_string_here
   ```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check database connection and stats

### Pets API
- **GET** `/api/pets` - Get database connection info and pet count
- **POST** `/api/pets` - Create a new pet record

## Database Schema

### Pet Model
The application includes a comprehensive Pet model with the following features:

- **Basic Info**: name, species, breed, age, color, weight
- **Owner Info**: name, email, phone
- **Medical History**: track veterinary visits and treatments
- **Vaccinations**: track vaccination records and due dates
- **Timestamps**: automatic creation and update timestamps

### Example Pet Document
```javascript
{
  name: "Buddy",
  species: "dog",
  breed: "Golden Retriever",
  age: 3,
  color: "Golden",
  weight: 30,
  owner: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890"
  },
  medicalHistory: [
    {
      date: "2024-01-15",
      description: "Annual checkup",
      veterinarian: "Dr. Smith"
    }
  ],
  vaccinations: [
    {
      name: "Rabies",
      date: "2024-01-15",
      nextDue: "2025-01-15"
    }
  ],
  isActive: true
}
```

## Connection Management

The application uses connection pooling and caching to optimize database performance:

- **Connection Caching**: Reuses connections across requests in development
- **Connection Pooling**: Configurable pool size (default: 10)
- **Error Handling**: Comprehensive error handling with logging
- **Graceful Shutdown**: Properly closes connections on app termination

## Switching Between Environments

To switch between local and Atlas:

1. **To Local**: Set `MONGODB_ENV=local` in `.env.local`
2. **To Atlas**: Set `MONGODB_ENV=atlas` in `.env.local`

The application will automatically use the appropriate connection string based on the `MONGODB_ENV` setting.

## Troubleshooting

### Common Issues

1. **Connection Refused (Local)**
   - Ensure MongoDB is running locally
   - Check if port 27017 is available
   - Verify MongoDB service is started

2. **Authentication Failed (Atlas)**
   - Check username and password in connection string
   - Verify IP whitelist includes your current IP
   - Ensure database user has proper permissions

3. **Network Timeout (Atlas)**
   - Check internet connection
   - Verify Atlas cluster is running
   - Check firewall settings

### Debug Mode

The application includes comprehensive logging. Check your console for connection status and error messages.

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for Atlas connections
- Enable IP whitelisting in Atlas for production
- Consider using MongoDB connection string format for enhanced security