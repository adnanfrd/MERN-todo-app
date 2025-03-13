import prisma from "@/../../prisma";
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
  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, completed } = req.body;

    try {
      const task = await prisma.task.update({
        where: { id },
        data: { title, completed },
      });

      return res.json(task);
    } catch (error) {
      return res.status(400).json({ error: "Task not found" });
    }
  }
  if (req.method === "DELETE") {
    try {
      await prisma.task.delete({
        where: { id },
      });

      return res.json({ message: "Task deleted successfully" });
    } catch (error) {
      return res.status(400).json({ error: "Task not found" });
    }
  }
}