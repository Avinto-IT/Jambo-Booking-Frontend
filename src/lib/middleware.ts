import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
export const verifyToken = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "You are not authorized to perform the action" });
  }

  const token = authHeader.split(" ")[1];
  if (!SECRET_KEY) {
    return res
      .status(500)
      .json({ error: "Internal server error: SECRET_KEY is not set" });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "You are not authorized to perform the action" });
  }
};
