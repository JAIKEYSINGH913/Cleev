import { getDriver, initDB } from "../config/database";
import { ExpenseService } from "../services/expenseService";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const USERS_TO_CREATE = 20;

const NAMES = [
  "Alice Smith", "Bob Johnson", "Charlie Williams", "Diana Brown", "Ethan Jones",
  "Fiona Garcia", "George Miller", "Hannah Davis", "Ian Rodriguez", "Julia Martinez",
  "Kevin Hernandez", "Laura Lopez", "Michael Gonzalez", "Nina Wilson", "Oliver Anderson",
  "Paula Thomas", "Quinn Taylor", "Rachel Moore", "Samuel Jackson", "Tina Martin"
];

const CATEGORIES = ["food", "travel", "rent", "shopping", "entertainment", "bills", "medical", "other"];

const GROUPS = [
  { name: "Goa Trip 🏖️", memberCount: 6 },
  { name: "Apartment 🏠", memberCount: 4 },
  { name: "Weekend Dinner 🍕", memberCount: 5 },
  { name: "Office Lunch 🍱", memberCount: 8 }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function seed() {
  console.log("Starting DB initialization...");
  await initDB();
  const session = getDriver().session();

  try {
    console.log("Cleaning existing database...");
    await session.run(`MATCH (n) DETACH DELETE n`);
    
    console.log("Creating 20 users with password: Password123!");
    const passwordHash = await bcrypt.hash("Password123!", 10);
    
    const usersData = [];
    for (let i = 0; i < USERS_TO_CREATE; i++) {
      const name = NAMES[i];
      const username = name.split(" ")[0].toLowerCase() + Math.floor(Math.random() * 100);
      usersData.push({
        id: uuidv4(),
        name,
        username,
        email: `${username}@example.com`,
        passwordHash,
        upiId: `${username}@okicici`,
        emailVerified: true
      });
    }

    // Batch insert users
    await session.run(
      `
      UNWIND $users AS u
      CREATE (n:User {
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        passwordHash: u.passwordHash,
        upiId: u.upiId,
        emailVerified: u.emailVerified
      })
      `,
      { users: usersData }
    );

    console.log("Users Created:");
    usersData.slice(0, 5).forEach(u => console.log(` - ${u.username} (${u.email})`));
    console.log(` ...and 15 more.`);

    console.log("\nCreating Groups & Memberships...");
    const groupsData = [];
    const membershipsData = [];
    
    for (const g of GROUPS) {
      const groupId = uuidv4();
      
      const shuffledUsers = [...usersData].sort(() => 0.5 - Math.random());
      const members = shuffledUsers.slice(0, g.memberCount);
      
      groupsData.push({ id: groupId, name: g.name, members });
      
      for (const m of members) {
        membershipsData.push({ userId: m.id, groupId });
      }
      console.log(` - Group: ${g.name} (${members.length} members)`);
    }

    // Batch insert groups
    await session.run(`UNWIND $groups AS g CREATE (n:Group {id: g.id, name: g.name})`, { groups: groupsData.map(g => ({id: g.id, name: g.name})) });
    
    // Batch insert memberships
    await session.run(
      `
      UNWIND $memberships AS m
      MATCH (u:User {id: m.userId}), (g:Group {id: m.groupId})
      CREATE (u)-[:MEMBER_OF]->(g)
      `,
      { memberships: membershipsData }
    );

    await session.close(); // Close the main session to free up connections for ExpenseService

    console.log("\nAdding Expenses and Calculating Debts...");
    for (const group of groupsData) {
      const numExpenses = 1; // Just 1 expense per group to avoid ECONNRESET on free tier
      
      for (let i = 0; i < numExpenses; i++) {
        const payer = group.members[Math.floor(Math.random() * group.members.length)];
        const totalAmount = Math.floor(Math.random() * 4500) + 500;
        const splitAmount = Math.round(totalAmount / group.members.length);
        const actualTotal = splitAmount * group.members.length;

        const participants = group.members.map(m => ({
          userId: m.id,
          amount: splitAmount
        }));

        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const description = `${category.charAt(0).toUpperCase() + category.slice(1)} in ${group.name.split(' ')[0]}`;

        console.log(`   -> Creating expense: ${description} (₹${actualTotal}) paid by ${payer.username}`);
        
        await ExpenseService.createExpense(
          payer.id,
          participants,
          description,
          actualTotal,
          category,
          group.id
        );
        
        // Larger delay to prevent ECONNRESET on remote free-tier DB
        await delay(1500);
      }
    }
    
    console.log("Expenses added successfully!");
    
    console.log("\nInjecting a deliberate Circular Debt for S33 visualization...");
    if (usersData.length >= 3) {
      const u1 = usersData[0];
      const u2 = usersData[1];
      const u3 = usersData[2];
      
      const cycleAmount = 2000;
      await ExpenseService.createExpense(u1.id, [{userId: u1.id, amount: cycleAmount/2}, {userId: u2.id, amount: cycleAmount/2}], "Cycle A", cycleAmount, "other");
      await delay(1500);
      await ExpenseService.createExpense(u2.id, [{userId: u2.id, amount: cycleAmount/2}, {userId: u3.id, amount: cycleAmount/2}], "Cycle B", cycleAmount, "other");
      await delay(1500);
      await ExpenseService.createExpense(u3.id, [{userId: u3.id, amount: cycleAmount/2}, {userId: u1.id, amount: cycleAmount/2}], "Cycle C", cycleAmount, "other");
      
      console.log(`Cycle injected between ${u1.username} -> ${u2.username} -> ${u3.username}`);
    }

    console.log("\n✅ Database Seeding Complete!");
    console.log("You can log in with any of these users, for example:");
    console.log(` Email: ${usersData[0].email} / Password: Password123!`);
    console.log(` Email: ${usersData[1].email} / Password: Password123!`);

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
