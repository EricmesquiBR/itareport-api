import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Header from "./header";

type SessionState = {
  data: { user: { id: string; name?: string; username?: string } } | null;
  isPending: boolean;
};
const sessionState: { current: SessionState } = {
  current: { data: null, isPending: false },
};

vi.mock("@/lib/auth-client", () => ({
  useSession: () => sessionState.current,
  signOut: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
}));

function setSession(state: SessionState) {
  sessionState.current = state;
}

describe("Header", () => {
  beforeEach(() => {
    setSession({ data: null, isPending: false });
  });

  it("links the logged-in username to /me", () => {
    setSession({
      data: { user: { id: "usr_1", username: "ana" } },
      isPending: false,
    });

    render(<Header />);

    const link = screen.getByRole("link", { name: "ana" });
    expect(link).toHaveAttribute("href", "/me");
  });

  it("does not show a /me link when anonymous", () => {
    render(<Header />);

    expect(screen.queryByRole("link", { name: /\/me/i })).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("link").find((el) => el.getAttribute("href") === "/me"),
    ).toBeUndefined();
  });

  it("hides the /me link while session is still loading", () => {
    setSession({ data: null, isPending: true });

    render(<Header />);

    expect(
      screen.queryAllByRole("link").find((el) => el.getAttribute("href") === "/me"),
    ).toBeUndefined();
  });
});
