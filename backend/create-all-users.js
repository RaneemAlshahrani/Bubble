// backend/create-all-users.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // 1. Create Admin User
    const adminExists = await User.findOne({ email: "admin@bubble.com" });
    if (!adminExists) {
      const admin = new User({
        fullName: "Admin User",
        email: "admin@bubble.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        phone: "1234567890",
        address: "Admin Office"
      });
      await admin.save();
      console.log("✅ Admin created: admin@bubble.com / admin123");
    } else {
      console.log("⏭️ Admin already exists");
    }

    // 2. Create Customer Service User
    const csExists = await User.findOne({ email: "support@bubble.com" });
    if (!csExists) {
      const cs = new User({
        fullName: "Customer Service",
        email: "support@bubble.com",
        password: await bcrypt.hash("support123", 10),
        role: "customer-service",
        phone: "0987654321",
        address: "Support Center"
      });
      await cs.save();
      console.log("✅ Customer Service created: support@bubble.com / support123");
    } else {
      console.log("⏭️ Customer Service already exists");
    }

    // 3. Create Regular User
    const userExists = await User.findOne({ email: "user@bubble.com" });
    if (!userExists) {
      const user = new User({
        fullName: "Regular User",
        email: "user@bubble.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        phone: "5555555555",
        address: "User Home"
      });
      await user.save();
      console.log("✅ Regular User created: user@bubble.com / user123");
    } else {
      console.log("⏭️ Regular User already exists");
    }

    console.log("\n🎉 All users created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👑 ADMIN:");
    console.log("   Email: admin@bubble.com");
    console.log("   Password: admin123");
    console.log("   Access: Admin Dashboard");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🛎️ CUSTOMER SERVICE:");
    console.log("   Email: support@bubble.com");
    console.log("   Password: support123");
    console.log("   Access: Ticket Management & FAQ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 REGULAR USER:");
    console.log("   Email: user@bubble.com");
    console.log("   Password: user123");
    console.log("   Access: Shop, Cart, Orders");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAllUsers();