import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { formatRelative } from "./relative-time";

describe("formatRelative", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-28T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats a past date as days ago in pt-BR", () => {
    expect(formatRelative("2026-04-25T12:00:00Z")).toBe("há 3 dias");
  });

  it("formats a future date as days ahead in pt-BR", () => {
    expect(formatRelative("2026-05-05T12:00:00Z")).toBe("em 7 dias");
  });
});
