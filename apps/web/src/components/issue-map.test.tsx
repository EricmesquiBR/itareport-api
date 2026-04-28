import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Report } from "@/api/reports";
import { getCategories } from "@/api/categories";
import { getReports } from "@/api/reports";
import { renderWithQuery } from "@/test/test-utils";
import IssueMap from "./issue-map";

vi.mock("@/api/reports", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/reports")>();
  return { ...actual, getReports: vi.fn(), voteOnReport: vi.fn() };
});

vi.mock("@/api/categories", () => ({
  getCategories: vi.fn(),
  getReportsByCategory: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  useSession: () => ({ data: { user: { id: "usr_1" } }, isPending: false }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, params }: { children: React.ReactNode; to: string; params?: Record<string, string> }) => {
    const href = params ? Object.entries(params).reduce((acc, [k, v]) => acc.replace(`$${k}`, v), to) : to;
    return <a href={href}>{children}</a>;
  },
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

const mockedGetReports = vi.mocked(getReports);
const mockedGetCategories = vi.mocked(getCategories);

function makeReport(overrides: Partial<Report> = {}): Report {
  return {
    id: "rep_42",
    title: "Buraco grande",
    lat: -3.92,
    lng: -39.55,
    status: "active",
    credibility: 50,
    upvotes: 8,
    categoryId: "cat_1",
    expiresAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("IssueMap popup", () => {
  it("renders a link to the report detail page", async () => {
    mockedGetCategories.mockResolvedValue([]);
    mockedGetReports.mockResolvedValue({
      data: [makeReport({ id: "rep_42" })],
      pagination: { total: 1, page: 1, limit: 100, offset: 0 },
    });

    renderWithQuery(<IssueMap />);

    const link = await screen.findByRole("link", { name: /ver detalhes/i });
    expect(link).toHaveAttribute("href", "/reports/rep_42");
  });

  it("renders an upvote button inside the popup", async () => {
    mockedGetCategories.mockResolvedValue([]);
    mockedGetReports.mockResolvedValue({
      data: [makeReport({ upvotes: 8 })],
      pagination: { total: 1, page: 1, limit: 100, offset: 0 },
    });

    renderWithQuery(<IssueMap />);

    expect(await screen.findByRole("button", { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });
});
