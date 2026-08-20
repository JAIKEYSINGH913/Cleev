import neo4j, { Driver } from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DATABASE_URL || "bolt+s://localhost:7687";
const user = process.env.DATABASE_USER || "neo4j";
const password = process.env.DATABASE_PASSWORD || "password";

let driver: Driver;

export const initDB = async () => {
  try {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    await driver.verifyConnectivity();
    console.log("✅ Neo4j/CognoDB Driver initialized & connected!");
  } catch (error) {
    console.error("❌ Failed to connect to CognoDB:", error);
    process.exit(1);
  }
};

export const getDriver = () => {
  if (!driver) {
    throw new Error("Driver not initialized. Call initDB first.");
  }
  return driver;
};

export const closeDB = async () => {
  if (driver) {
    await driver.close();
    console.log("Neo4j Driver closed");
  }
};
