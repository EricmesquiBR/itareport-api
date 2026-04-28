import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ReportWithImages } from "@/api/reports";
import { getReportById } from "@/api/reports";
import { renderWithQuery } from "@/test/test-utils";
import { ReportDetail } from "./report-detail";

vi.mock("@/api/reports", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/reports")>();
  return { ...actual, getReportById: vi.fn() };
});

vi.mock("@/lib/auth-client", () => ({
  useSession: () => ({ data: { user: { id: "usr_1" } }, isPending: false }),
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  TileLayer: () => null,
  Marker: () => <div data-testid="marker" />,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

const mockedGet = vi.mocked(getReportById);

function makeReport(overrides: Partial<ReportWithImages> = {}): ReportWithImages {
  return {
    id: "rep_1",
    title: "Buraco na Av. Brasil",
    lat: -3.92,
    lng: -39.55,
    status: "active",
    credibility: 42,
    upvotes: 5,
    categoryId: "cat_1",
    expiresAt: "2026-05-05T12:00:00Z",
    createdAt: "2026-04-25T12:00:00Z",
    updatedAt: "2026-04-28T12:00:00Z",
    images: [],
    ...overrides,
  };
}

describe("ReportDetail", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-04-28T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the report title once loaded", async () => {
    mockedGet.mockResolvedValueOnce(makeReport({ title: "Buraco na Av. Brasil" }));

    renderWithQuery(<ReportDetail id="rep_1" />);

    expect(await screen.findByRole("heading", { name: "Buraco na Av. Brasil" })).toBeInTheDocument();
  });

  it("shows a not-found message when the API returns 404", async () => {
    mockedGet.mockRejectedValueOnce(
      Object.assign(new Error("not found"), { response: { status: 404 } }),
    );

    renderWithQuery(<ReportDetail id="rep_missing" />);

    expect(
      await screen.findByText(/reporte não encontrado ou expirado/i),
    ).toBeInTheDocument();
  });

  it("shows a loading state while the request is in flight", () => {
    mockedGet.mockImplementationOnce(() => new Promise(() => {}));

    renderWithQuery(<ReportDetail id="rep_1" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders an active status badge with the active label", async () => {
    mockedGet.mockResolvedValueOnce(makeReport({ status: "active" }));

    renderWithQuery(<ReportDetail id="rep_1" />);

    expect(await screen.findByText("Confirmado")).toBeInTheDocument();
  });

  it("renders a pending status badge with the pending label", async () => {
    mockedGet.mockResolvedValueOnce(makeReport({ status: "pending" }));

    renderWithQuery(<ReportDetail id="rep_1" />);

    expect(await screen.findByText("Em validação")).toBeInTheDocument();
  });

  it("shows credibility and the upvote button with the current count", async () => {
    mockedGet.mockResolvedValueOnce(makeReport({ upvotes: 12, credibility: 73 }));

    renderWithQuery(<ReportDetail id="rep_1" />);

    expect(await screen.findByText(/credibilidade.*73/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows created and expires dates as relative pt-BR", async () => {
    mockedGet.mockResolvedValueOnce(makeReport());

    renderWithQuery(<ReportDetail id="rep_1" />);

    expect(await screen.findByText(/Criado há 3 dias/i)).toBeInTheDocument();
    expect(screen.getByText(/Expira em 7 dias/i)).toBeInTheDocument();
  });

  it("renders the primary image when available", async () => {
    mockedGet.mockResolvedValueOnce(
      makeReport({
        images: [
          { id: "img_1", storageKey: "reports/2026-04-25/photo.webp", isPrimary: true },
        ],
      }),
    );

    renderWithQuery(<ReportDetail id="rep_1" />);

    const img = await screen.findByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("reports/2026-04-25/photo.webp"));
  });

  it("renders a mini-map with a marker and a back link", async () => {
    mockedGet.mockResolvedValueOnce(makeReport());

    renderWithQuery(<ReportDetail id="rep_1" />);

    expect(await screen.findByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("marker")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar ao mapa/i })).toHaveAttribute("href", "/map");
  });
});
