/**
 * MongoDB connection (Atlas-compatible). Configure via MONGODB_URI and optional MONGODB_DB_NAME.
 * Never commit real credentials — use .env only.
 */
import { MongoClient } from "mongodb";

let client;

const DEFAULT_DB = "component_compass";

export function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !String(uri).trim()) {
    throw new Error("MONGODB_URI is not set in environment (.env)");
  }
  return uri.trim();
}

export function getDbName() {
  return (process.env.MONGODB_DB_NAME || DEFAULT_DB).trim();
}

/**
 * @returns {Promise<import('mongodb').Db>}
 */
export async function getDb() {
  if (!client) {
    client = new MongoClient(getMongoUri(), {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15_000,
    });
    await client.connect();
  }
  return client.db(getDbName());
}

export async function closeMongo() {
  if (client) {
    await client.close();
    client = undefined;
  }
}

/**
 * @param {import('mongodb').Db} db
 */
export async function ensureIndexes(db) {
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("community_posts").createIndex({ createdAt: -1 });
  await db.collection("community_comments").createIndex({ postId: 1, createdAt: 1 });
}
