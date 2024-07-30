import { User } from "../src/models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

// declare namespace NodeJS {
//   interface ProcessEnv {
//       REFRESH_TOKEN_SECRET: string;
//       REFRESH_TOKEN_EXPIRY: string;
//       ACCESS_TOKEN_SECRET: string;
//       ACCESS_TOKEN_EXPIRY: string;
//       CLOUDINARY_CLOUD_NAME: string;
//       CLOUDINARY_API_KEY: string;
//       CLOUDINARY_API_SECRET: string;
//       CORS_ORIGIN: string;
//       MONGODB_URL: string;
//       PORT: string;
//   }
// }