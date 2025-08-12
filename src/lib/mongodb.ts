import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "";
const dbName = process.env.DB_NAME || "job_tracker";

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI (or MONGO_URI) environment variable in .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Allow global `mongoose` cache across hot reloads in dev
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName }).then((m) => m);
  }
  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
