import { JwtPayload } from "jsonwebtoken"
declare global {
  namespace Express {
    interface Request {
      session?: {
        user: JwtPayload | null | string;
      };
    }
  }
}
