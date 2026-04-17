import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing seed data
  await prisma.notesOnTags.deleteMany();
  await prisma.note.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create example users
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
    },
  });

  // Create tags
  const tagTypeScript = await prisma.tag.create({ data: { name: "TypeScript" } });
  const tagNextJs = await prisma.tag.create({ data: { name: "Next.js" } });
  const tagDatabase = await prisma.tag.create({ data: { name: "Database" } });

  // Create notes with tags
  await prisma.note.create({
    data: {
      title: "Getting started with TypeScript",
      content:
        "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
      authorId: alice.id,
      tags: {
        create: [
          { tag: { connect: { id: tagTypeScript.id } } },
        ],
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "Next.js pages and routing",
      content:
        "Next.js uses a file-system based router where folders define routes. Each folder represents a route segment that maps to a URL segment.",
      authorId: alice.id,
      tags: {
        create: [
          { tag: { connect: { id: tagNextJs.id } } },
          { tag: { connect: { id: tagTypeScript.id } } },
        ],
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "Prisma ORM basics",
      content:
        "Prisma is a next-generation ORM that provides a type-safe database client auto-generated from your schema. Use `prisma migrate dev` for schema changes.",
      authorId: bob.id,
      tags: {
        create: [
          { tag: { connect: { id: tagDatabase.id } } },
        ],
      },
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
