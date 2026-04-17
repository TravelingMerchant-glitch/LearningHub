import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import prisma from "../lib/prisma";

type Tag = { tag: { id: string; name: string } };

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tags: Tag[];
  author: { name: string | null; email: string } | null;
};

type Props = {
  notes: Note[];
};

export default function Home({ notes }: Props) {
  return (
    <>
      <Head>
        <title>LearningHub</title>
        <meta name="description" content="Organize your study notes" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LearningHub</h1>
          <Link
            href="/notes/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + New Note
          </Link>
        </div>

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-16">
            No notes yet.{" "}
            <Link href="/notes/new" className="text-indigo-600 hover:underline">
              Create your first note.
            </Link>
          </p>
        ) : (
          <ul className="space-y-4">
            {notes.map((note) => (
              <li key={note.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/notes/${note.id}`}>
                  <h2 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                    {note.title}
                  </h2>
                </Link>
                <p className="mt-1 text-gray-500 text-sm line-clamp-2">{note.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.tags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Updated {new Date(note.updatedAt).toLocaleDateString()}
                  {note.author ? ` · ${note.author.name ?? note.author.email}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      tags: { include: { tag: true } },
      author: { select: { name: true, email: true } },
    },
  });

  return {
    props: {
      notes: JSON.parse(JSON.stringify(notes)) as Note[],
    },
  };
};
