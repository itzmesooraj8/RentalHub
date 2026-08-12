import { z } from "zod";
export const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issue = result.error.issues[0];
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid request payload format."
        }
      });
    }
    req.body = result.data;
    next();
  };
};
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["customer", "owner", "admin"]).optional().default("customer"),
  phone: z.string().optional(),
  location: z.string().optional()
});
export const loginSchema = z.object({
  email: z.string().email("Invalid email address format."),
  password: z.string().min(1, "Password is required.")
});
export const equipmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  category: z.string().min(1, "Category is required."),
  industry: z.string().min(1, "Industry is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  location: z.string().min(2, "Location is required."),
  lat: z.number(),
  lng: z.number(),
  dailyRate: z.number().positive("Daily rate must be positive."),
  weeklyRate: z.number().positive("Weekly rate must be positive."),
  securityDeposit: z.number().nonnegative("Security deposit cannot be negative."),
  images: z.array(z.string()).min(1, "At least one image URL or data-URI is required."),
  specs: z.record(z.string(), z.string()).optional(),
  co2SavedPerDayKg: z.number().optional()
});
export const bookingSchema = z.object({
  equipmentId: z.string().min(1, "equipmentId is required."),
  startDate: z.string().min(10, "startDate format YYYY-MM-DD required."),
  endDate: z.string().min(10, "endDate format YYYY-MM-DD required."),
  deliveryMethod: z.enum(["pickup", "delivery"]).optional().default("delivery"),
  deliveryAddress: z.string().optional()
});
