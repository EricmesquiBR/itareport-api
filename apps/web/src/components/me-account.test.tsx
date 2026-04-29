import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { deleteMe, getMe } from "@/api/users";
import { signOut } from "@/lib/auth-client";
import { renderWithQuery } from "@/test/test-utils";
import { MeAccount } from "./me-account";

vi.mock("@/api/users", () => ({
  getMe: vi.fn(),
  deleteMe: vi.fn(),
}));

type SessionState = { data: { user: { id: string } } | null; isPending: boolean };
const sessionState: { current: SessionState } = {
  current: { data: { user: { id: "usr_1" } }, isPending: false },
};

vi.mock("@/lib/auth-client", () => ({
  useSession: () => sessionState.current,
  signOut: vi.fn(),
}));

const navigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

const mockedGetMe = vi.mocked(getMe);
const mockedDeleteMe = vi.mocked(deleteMe);
const mockedSignOut = vi.mocked(signOut);

function setSession(state: SessionState) {
  sessionState.current = state;
}

async function renderLoaded(user = {
  id: "usr_1",
  username: "ana",
  createdAt: "2026-04-25T12:00:00Z",
}) {
  mockedGetMe.mockResolvedValueOnce(user);
  renderWithQuery(<MeAccount />);
  await screen.findByText(user.username);
}

describe("MeAccount", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-04-28T12:00:00Z"));
    mockedGetMe.mockReset();
    mockedDeleteMe.mockReset();
    mockedSignOut.mockReset();
    navigate.mockReset();
    setSession({ data: { user: { id: "usr_1" } }, isPending: false });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the username once loaded", async () => {
    mockedGetMe.mockResolvedValueOnce({
      id: "usr_1",
      username: "ana",
      createdAt: "2026-04-25T12:00:00Z",
    });

    renderWithQuery(<MeAccount />);

    expect(await screen.findByText("ana")).toBeInTheDocument();
  });

  it("shows when the account was created as relative pt-BR", async () => {
    mockedGetMe.mockResolvedValueOnce({
      id: "usr_1",
      username: "ana",
      createdAt: "2026-04-25T12:00:00Z",
    });

    renderWithQuery(<MeAccount />);

    expect(await screen.findByText(/Conta criada há 3 dias/i)).toBeInTheDocument();
  });

  it("renders a delete-account button once loaded", async () => {
    mockedGetMe.mockResolvedValueOnce({
      id: "usr_1",
      username: "ana",
      createdAt: "2026-04-25T12:00:00Z",
    });

    renderWithQuery(<MeAccount />);

    expect(
      await screen.findByRole("button", { name: /apagar minha conta/i }),
    ).toBeInTheDocument();
  });

  it("opens a confirmation dialog when the delete button is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderLoaded();

    await user.click(screen.getByRole("button", { name: /apagar minha conta/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar exclusão/i })).toBeInTheDocument();
    expect(mockedDeleteMe).not.toHaveBeenCalled();
  });

  it("closes the dialog when cancel is clicked, with no API call", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await renderLoaded();

    await user.click(screen.getByRole("button", { name: /apagar minha conta/i }));
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockedDeleteMe).not.toHaveBeenCalled();
  });

  it("deletes the account, signs out, and redirects to / on confirm", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mockedDeleteMe.mockResolvedValueOnce(undefined);
    mockedSignOut.mockResolvedValueOnce(undefined as never);
    await renderLoaded();

    await user.click(screen.getByRole("button", { name: /apagar minha conta/i }));
    await user.click(screen.getByRole("button", { name: /confirmar exclusão/i }));

    await vi.waitFor(() => {
      expect(mockedDeleteMe).toHaveBeenCalledTimes(1);
    });
    await vi.waitFor(() => {
      expect(mockedSignOut).toHaveBeenCalledTimes(1);
    });
    await vi.waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ to: "/" });
    });
  });

  it("shows an error and keeps dialog open if delete fails", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mockedDeleteMe.mockRejectedValueOnce(new Error("boom"));
    await renderLoaded();

    await user.click(screen.getByRole("button", { name: /apagar minha conta/i }));
    await user.click(screen.getByRole("button", { name: /confirmar exclusão/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/erro ao apagar/i);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(mockedSignOut).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("redirects to /login when there is no session", async () => {
    setSession({ data: null, isPending: false });

    renderWithQuery(<MeAccount />);

    await vi.waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ to: "/login" });
    });
    expect(mockedGetMe).not.toHaveBeenCalled();
  });
});
