// backend/src/types/express.d.ts
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      // Allows req.user to exist, but makes it optional (?)
      user?: Omit<User, 'password'>; 
    }
  }
}