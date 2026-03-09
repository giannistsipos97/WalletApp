import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "SUPER_SECRET_KEY_CHANGEME",
    );
    req.user = decoded.userId; // We attach the user ID to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
