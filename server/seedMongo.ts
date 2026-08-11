import { UserModel } from './models/User';
import { EquipmentModel } from './models/Equipment';
import { BookingModel } from './models/Booking';
import { AvailabilityBlockModel } from './models/AvailabilityBlock';
import { ReviewModel } from './models/Review';
import { DisputeModel } from './models/Dispute';
import { NotificationModel } from './models/Notification';
import { AuditLogModel } from './models/AuditLog';
import { CategoryModel } from './models/Category';
import {
  INITIAL_USERS,
  INITIAL_EQUIPMENT,
  INITIAL_AVAILABILITY,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_DISPUTES,
  INITIAL_NOTIFICATIONS,
} from './seedData';

export async function seedMongoDatabase() {
  try {
    const isExplicitRun = process.argv[1]?.endsWith('seedMongo.ts');
    const userCount = await UserModel.countDocuments();
    if (userCount > 0 && !isExplicitRun) {
      console.log(`MongoDB Atlas contains ${userCount} users. Skipping auto-seeding.`);
      return;
    }

    console.log('Clearing and seeding updated Indian dataset into MongoDB Atlas...');
    await UserModel.deleteMany({});
    await EquipmentModel.deleteMany({});
    await AvailabilityBlockModel.deleteMany({});
    await BookingModel.deleteMany({});
    await ReviewModel.deleteMany({});
    await DisputeModel.deleteMany({});
    await NotificationModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await AuditLogModel.deleteMany({});

    // 1. Users
    await UserModel.insertMany(INITIAL_USERS);

    // 2. Equipment (mapping location coordinates to GeoJSON Point format)
    const formattedEquipment = INITIAL_EQUIPMENT.map((eq) => ({
      ...eq,
      locationCoordinates: {
        type: 'Point' as const,
        coordinates: [eq.lng, eq.lat] as [number, number],
      },
    }));
    await EquipmentModel.insertMany(formattedEquipment);

    // 3. Availability
    await AvailabilityBlockModel.insertMany(INITIAL_AVAILABILITY);

    // 4. Bookings
    await BookingModel.insertMany(INITIAL_BOOKINGS);

    // 5. Reviews
    await ReviewModel.insertMany(INITIAL_REVIEWS);

    // 6. Disputes
    await DisputeModel.insertMany(INITIAL_DISPUTES);

    // 7. Notifications
    await NotificationModel.insertMany(INITIAL_NOTIFICATIONS);

    // 8. Categories & Taxonomy
    const initialCategories = [
      {
        id: 'cat_heavy',
        name: 'Heavy Machinery',
        icon: 'Truck',
        description: 'Construction and earthmoving heavy machinery',
        itemCount: 4,
        industry: 'Construction',
      },
      {
        id: 'cat_photo',
        name: 'Photography & Drones',
        icon: 'Camera',
        description: 'Professional cinema camera gear and drones',
        itemCount: 2,
        industry: 'Photography & Media',
      },
      {
        id: 'cat_event',
        name: 'Event & Audio',
        icon: 'Volume2',
        description: 'Concert grade sound reinforcement and audio systems',
        itemCount: 1,
        industry: 'Events',
      },
    ];
    await CategoryModel.insertMany(initialCategories);

    // 9. Initial Security Audit Log
    const initialAudit = [
      {
        id: `aud_${Date.now()}_1`,
        timestamp: new Date().toISOString(),
        actorRole: 'system' as const,
        actorName: 'MongoDB Atlas Engine',
        action: 'Initial Collection Seed Completed',
        targetId: 'RENTALHUB_DB',
        metadata: 'Populated 6 collections with 2dsphere indexes',
      },
    ];
    await AuditLogModel.insertMany(initialAudit);

    console.log('MongoDB Atlas seeding completed successfully!');
  } catch (err: any) {
    console.error('Error seeding MongoDB Atlas:', err?.message || err);
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seedMongo.ts')) {
  import('./mongo').then(async ({ connectMongo }) => {
    await connectMongo();
    process.exit(0);
  });
}
