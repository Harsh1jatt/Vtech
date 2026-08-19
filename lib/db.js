let connectionPromise;

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  // Add the Mongoose connection implementation when database features are introduced.
  connectionPromise ||= Promise.resolve();
  return connectionPromise;
}
