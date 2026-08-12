import { UserModel } from "./models/User.js";
import { EquipmentModel } from "./models/Equipment.js";
import { BookingModel } from "./models/Booking.js";
import { AvailabilityBlockModel } from "./models/AvailabilityBlock.js";
import { ReviewModel } from "./models/Review.js";
import { DisputeModel } from "./models/Dispute.js";
import { NotificationModel } from "./models/Notification.js";
import { AuditLogModel } from "./models/AuditLog.js";
import { CategoryModel } from "./models/Category.js";
import {
  INITIAL_USERS,
  INITIAL_EQUIPMENT,
  INITIAL_AVAILABILITY,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_DISPUTES,
  INITIAL_NOTIFICATIONS
} from "./seedData.js";
export async function seedMongoDatabase() {
  try {
    const isExplicitRun = process.argv[1]?.endsWith("seedMongo.ts");
    const userCount = await UserModel.countDocuments();
    if (userCount > 0 && !isExplicitRun) {
      console.log(`MongoDB Atlas contains ${userCount} users. Skipping auto-seeding.`);
      return;
    }
    console.log("Clearing and seeding updated Indian dataset into MongoDB Atlas...");
    await UserModel.deleteMany({});
    await EquipmentModel.deleteMany({});
    await AvailabilityBlockModel.deleteMany({});
    await BookingModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await DisputeModel.deleteMany({});
    await NotificationModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    await UserModel.insertMany(INITIAL_USERS);
    const formattedEquipment = INITIAL_EQUIPMENT.map((eq) => ({
      ...eq,
      locationCoordinates: {
        type: "Point",
        coordinates: [eq.lng, eq.lat]
      }
    }));
    await EquipmentModel.insertMany(formattedEquipment);
    await AvailabilityBlockModel.insertMany(INITIAL_AVAILABILITY);
    await BookingModel.insertMany(INITIAL_BOOKINGS);
    await ReviewModel.insertMany(INITIAL_REVIEWS);
    await DisputeModel.insertMany(INITIAL_DISPUTES);
    await NotificationModel.insertMany(INITIAL_NOTIFICATIONS);
    const initialCategories = [
      {
        id: "cat_heavy",
        name: "Heavy Machinery",
        icon: "Truck",
        description: "Construction and earthmoving heavy machinery",
        itemCount: 4,
        industry: "Construction"
      },
      {
        id: "cat_photo",
        name: "Photography & Drones",
        icon: "Camera",
        description: "Professional cinema camera gear and drones",
        itemCount: 2,
        industry: "Photography & Media"
      },
      {
        id: "cat_event",
        name: "Event & Audio",
        icon: "Volume2",
        description: "Concert grade sound reinforcement and audio systems",
        itemCount: 1,
        industry: "Events"
      }
    ];
    await CategoryModel.insertMany(initialCategories);
    const initialAudit = [
      {
        id: `aud_${Date.now()}_1`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        actorRole: "system",
        actorName: "MongoDB Atlas Engine",
        action: "Initial Collection Seed Completed",
        targetId: "RENTALHUB_DB",
        metadata: "Populated 6 collections with 2dsphere indexes"
      }
    ];
    await AuditLogModel.insertMany(initialAudit);
    console.log("MongoDB Atlas seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding MongoDB Atlas:", err?.message || err);
  }
}
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("seedMongo.ts")) {
  import("./mongo.js").then(async ({ connectMongo }) => {
    await connectMongo();
    process.exit(0);
  });
}
