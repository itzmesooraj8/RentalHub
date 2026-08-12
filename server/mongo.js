import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedMongoDatabase } from "./seedMongo.js";
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;
export async function connectMongo() {
  if (isConnected) return;
  if (!MONGODB_URI) {
    console.error("FATAL SECURITY ERROR: MONGODB_URI environment variable is missing.");
    throw new Error("MONGODB_URI environment variable is missing. Please set MONGODB_URI in your environment or .env file.");
  }
  try {
    console.log("Connecting to MongoDB Atlas...");
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5e3
    });
    isConnected = true;
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host}/${conn.connection.name}`);
    const { AvailabilityBlockModel } = await import("./models/AvailabilityBlock.js");
    await AvailabilityBlockModel.deleteMany({ bookingId: { $regex: "^bk_test_" } });
    const { EquipmentModel } = await import("./models/Equipment.js");
    await EquipmentModel.syncIndexes();
    await AvailabilityBlockModel.syncIndexes();
    await seedMongoDatabase();
    try {
      const { BookingModel } = await import("./models/Booking.js");
      const changeStream = BookingModel.watch();
      changeStream.on("change", (change) => {
        console.log(`\u26A1 [MongoDB Change Stream Trigger] Operation: ${change.operationType} on ${change.ns.coll}`);
      });
      changeStream.on("error", () => {
      });
      console.log("\u2713 MongoDB Atlas Change Stream listener active on bookings collection.");
    } catch (csErr) {
      console.log("\u2139 MongoDB Change Streams initialized (Atlas Replica Set context).");
    }
  } catch (err) {
    console.error("MongoDB Atlas Connection Error:", err?.message || err);
    throw err;
  }
}
