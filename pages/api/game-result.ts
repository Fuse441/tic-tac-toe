import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await connectDB();

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { result } = req.body; // "win" | "lose"

  let user = await User.findOne({ email: session.user.email });

  if (!user) {
    user = await User.create({
      name: session.user.name,
      email: session.user.email,
    });
  }

  if (result === "win") {
    user.winStreak += 1;
    user.score += 1;

    if (user.winStreak === 3) {
      user.score += 1; // bonus
      user.winStreak = 0; // reset streak
    }
  }

  if (result === "lose") {
    user.score -= 1;
    user.winStreak = 0;
  }

  await user.save();

  return res.status(200).json({
    score: user.score,
    winStreak: user.winStreak,
  });
}
