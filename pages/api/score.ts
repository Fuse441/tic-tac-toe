import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);

  if (req.method == "GET") {
    const output = await User.find({});
    const users = output
      .map((item) => ({
        name: item.name,
        score: item.score,
      }))
      .sort((a, b) => b.score - a.score) // เรียงมาก → น้อย
      .slice(0, 5);
    return res.status(200).json(users);
  }

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { email } = req.body; //email

  let user = await User.findOne({ email: session.user.email });

  return res.status(200).json({ score: user.score, winStreak: user.winStreak });
}
