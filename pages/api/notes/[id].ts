import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  if (req.method === "GET") {
    try {
      const note = await prisma.note.findUnique({
        where: { id },
        include: {
          tags: { include: { tag: true } },
          author: { select: { id: true, name: true, email: true } },
        },
      });

      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      return res.status(200).json(note);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch note" });
    }
  }

  if (req.method === "PUT") {
    const { title, content, tags } = req.body as {
      title?: string;
      content?: string;
      tags?: string[];
    };

    if (!title && !content && !tags) {
      return res.status(400).json({ error: "No fields to update" });
    }

    try {
      // If tags are provided, replace existing tag associations
      const updatedNote = await prisma.$transaction(async (tx) => {
        if (tags !== undefined) {
          await tx.notesOnTags.deleteMany({ where: { noteId: id } });

          const tagRecords = await Promise.all(
            tags.map((name) =>
              tx.tag.upsert({
                where: { name },
                create: { name },
                update: {},
              })
            )
          );

          await tx.notesOnTags.createMany({
            data: tagRecords.map((tag) => ({ noteId: id, tagId: tag.id })),
          });
        }

        return tx.note.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(content && { content }),
          },
          include: {
            tags: { include: { tag: true } },
          },
        });
      });

      return res.status(200).json(updatedNote);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update note" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.note.delete({ where: { id } });
      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete note" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
