import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  if (req.method === "POST") {
    const { title } = req.body;
    const task = await prisma.task.create({ data: { title, userId: session.user.id } });
    return res.json(task);
  }

  if (req.method === "GET") {
    const tasks = await prisma.task.findMany({ where: { userId: session.user.id } });
    return res.json(tasks);
  }
}