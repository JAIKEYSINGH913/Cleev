import { getDriver, initDB, closeDB } from "../config/database";

const users = [
  { id: "u1", username: "jaikey", name: "Jaikey Singh" },
  { id: "u2", username: "aryan", name: "Aryan Sharma" },
  { id: "u3", username: "rohan", name: "Rohan Gupta" },
  { id: "u4", username: "kavya", name: "Kavya Patel" },
];

// Circular debt: u1 -> u2 -> u3 -> u1 (500 each)
// Multi-hop: u4 -> u1 -> u3
const debts = [
  { sourceId: "u1", targetId: "u2", amount: 500, status: "PENDING" },
  { sourceId: "u2", targetId: "u3", amount: 500, status: "PENDING" },
  { sourceId: "u3", targetId: "u1", amount: 500, status: "PENDING" },
  { sourceId: "u4", targetId: "u1", amount: 1200, status: "PENDING" },
];

async function seedDatabase() {
  initDB();
  const driver = getDriver();
  const session = driver.session();

  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await session.run(`MATCH (n) DETACH DELETE n`);

    // Create users
    console.log("👥 Creating users...");
    for (const user of users) {
      await session.run(
        `
        CREATE (u:User {
          id: $id,
          username: $username,
          name: $name,
          isActive: true
        })
        `,
        user
      );
    }

    // Create debts (OWES relationships)
    console.log("💸 Creating debt relationships...");
    for (const debt of debts) {
      await session.run(
        `
        MATCH (from:User {id: $sourceId})
        MATCH (to:User {id: $targetId})
        CREATE (from)-[:OWES {
          amount: $amount,
          status: $status,
          createdAt: datetime()
        }]->(to)
        `,
        debt
      );
    }

    console.log("✅ Database seeded successfully!");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await session.close();
    await closeDB();
  }
}

seedDatabase();
