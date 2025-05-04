import mongoose from "mongoose";

// Define the MongoDB connection URI. Use environment variables for security.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Define an interface for the cache structure
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the NodeJS global type to include the mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

// Initialize the cache using the global variable or create a new one
let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Explicit return type
  if (cached.conn) {
    console.log("🚀 Using cached MongoDB connection");
    return cached.conn;
  }

  // If a promise doesn't exist, create one
  if (!cached.promise) {
    const opts = {
      dbName: process.env.DB_NAME as string,
    };

    console.log("🔌 Creating new MongoDB connection");
    // Assign the connection promise to cached.promise
    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts) // Removed 'as string' - MONGODB_URI is checked above
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected");
        return mongooseInstance; // The promise resolves with the mongoose instance
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        cached.promise = null; // Reset promise on error
        throw error; // Re-throw error to be handled by caller
      });
  }

  // Await the promise to get the connection instance
  try {
    // The result of awaiting the promise is the mongoose instance, assign it to conn
    cached.conn = await cached.promise;
  } catch (e) {
    // If awaiting the promise fails, reset the promise cache and re-throw
    cached.promise = null;
    throw e;
  }

  // Ensure the connection is established before returning
  if (!cached.conn) {
    throw new Error("MongoDB connection failed and connection object is null.");
  }

  // Return the established connection
  return cached.conn;
}

