import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const notes = await prisma.note.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          tags: { include: { tag: true } },
          author: { select: { id: true, name: true, email: true } },
        },
      });
      return res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }
  }

  if (req.method === "POST") {
    const { title, content, tags, authorId } = req.body as {
      title?: string;
      content?: string;
      tags?: string[];
      authorId?: string;
    };

    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    try {
      const tagRecords = await Promise.all(
        (tags ?? []).map((name) =>
          prisma.tag.upsert({
            where: { name },
            create: { name },
            update: {},
          })
        )
      );

      const note = await prisma.note.create({
        data: {
          title,
          content,
          ...(authorId && { authorId }),
          tags: {
            create: tagRecords.map((tag) => ({
              tag: { connect: { id: tag.id } },
            })),
          },
        },
        include: {
          tags: { include: { tag: true } },
          author: { select: { id: true, name: true, email: true } },
        },
      });

      return res.status(201).json(note);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create note" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
