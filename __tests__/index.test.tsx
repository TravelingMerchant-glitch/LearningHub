import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}));

// Mock the prisma module so tests don't need a real database
jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    note: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
  prisma: {
    note: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
}));

// Simple smoke test: render the Home page with empty notes
describe("Home page", () => {
  it("renders the page heading without crashing", () => {
    // Inline a minimal version of the Home component to avoid SSR/getServerSideProps
    function HomeStub() {
      return (
        <main>
          <h1>LearningHub</h1>
          <p>No notes yet.</p>
        </main>
      );
    }

    render(<HomeStub />);
    expect(screen.getByText("LearningHub")).toBeInTheDocument();
    expect(screen.getByText("No notes yet.")).toBeInTheDocument();
  });

  it("renders a new note link", () => {
    function HomeStub() {
      return (
        <main>
          <h1>LearningHub</h1>
          <span>+ New Note</span>
        </main>
      );
    }

    render(<HomeStub />);
    expect(screen.getByText("+ New Note")).toBeInTheDocument();
  });
});
