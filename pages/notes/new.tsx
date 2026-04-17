"use client";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NewNotePage() {
  const router = useRouter();
  const { edit: editId } = router.query;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing note when in edit mode
  useEffect(() => {
    if (!editId || typeof editId !== "string") return;

    fetch(`/api/notes/${editId}`)
      .then((res) => res.json())
      .then((note) => {
        setTitle(note.title ?? "");
        setContent(note.content ?? "");
        setTagsInput(
          (note.tags as Array<{ tag: { name: string } }>)
            .map((t) => t.tag.name)
            .join(", ")
        );
      })
      .catch(() => setError("Failed to load note for editing."));
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const url = editId ? `/api/notes/${editId}` : "/api/notes";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Request failed");
      }

      const note = (await res.json()) as { id: string };
      router.push(`/notes/${note.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = Boolean(editId);

  return (
    <>
      <Head>
        <title>{isEditing ? "Edit Note" : "New Note"} — LearningHub</title>
      </Head>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          ← Back to notes
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Note" : "New Note"}
        </h1>

        {/* TODO: Auth placeholder — only authenticated users should create/edit notes */}
        <p className="mt-1 text-xs text-gray-400 italic">
          Auth placeholder: configure NextAuth or Clerk in lib/auth.ts to restrict access.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Note title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              placeholder="Write your note here…"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Comma-separated: TypeScript, Next.js, Database"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving…" : isEditing ? "Update Note" : "Create Note"}
          </button>
        </form>
      </main>
    </>
  );
}
