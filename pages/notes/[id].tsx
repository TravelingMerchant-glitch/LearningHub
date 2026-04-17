import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import prisma from "../../lib/prisma";

type Tag = { tag: { id: string; name: string } };

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  author: { name: string | null; email: string } | null;
};

type Props = {
  note: Note | null;
};

export default function NotePage({ note }: Props) {
  const router = useRouter();

  if (!note) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-gray-500">Note not found.</p>
        <Link href="/" className="text-indigo-600 hover:underline text-sm mt-4 block">
          ← Back to notes
        </Link>
      </main>
    );
  }

  const handleDelete = async () => {
    if (!confirm("Delete this note?")) return;
    try {
      const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        alert(data.error ?? "Failed to delete note. Please try again.");
        return;
      }
      router.push("/");
    } catch {
      alert("An unexpected error occurred while deleting the note.");
    }
  };

  return (
    <>
      <Head>
        <title>{note.title} — LearningHub</title>
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          ← Back to notes
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>

          <div className="mt-2 flex flex-wrap gap-2">
            {note.tags.map(({ tag }) => (
              <span
                key={tag.id}
                className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Updated {new Date(note.updatedAt).toLocaleDateString()}
            {note.author ? ` · ${note.author.name ?? note.author.email}` : ""}
          </p>

          <div className="mt-6 prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">{note.content}</p>
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href={`/notes/new?edit=${note.id}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>

          {/* TODO: Add auth protection — only the note's author should see Edit/Delete */}
          <p className="mt-4 text-xs text-gray-400 italic">
            Auth placeholder: configure NextAuth or Clerk in lib/auth.ts to protect edit/delete
            actions.
          </p>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      author: { select: { name: true, email: true } },
    },
  });

  return {
    props: {
      note: note ? (JSON.parse(JSON.stringify(note)) as Note) : null,
    },
  };
};
