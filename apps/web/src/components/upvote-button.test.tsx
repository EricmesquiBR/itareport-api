import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { voteOnReport } from "@/api/reports";
import { renderWithQuery } from "@/test/test-utils";
import { UpvoteButton } from "./upvote-button";

vi.mock("@/api/reports", () => ({
  voteOnReport: vi.fn(),
}));

type SessionState = { data: { user: { id: string } } | null; isPending: boolean };
const sessionState: { current: SessionState } = {
  current: { data: { user: { id: "usr_1" } }, isPending: false },
};

vi.mock("@/lib/auth-client", () => ({
  useSession: () => sessionState.current,
}));

function setSession(state: SessionState) {
  sessionState.current = state;
}

const mockedVote = vi.mocked(voteOnReport);

describe("UpvoteButton", () => {
  beforeEach(() => {
    mockedVote.mockReset();
    mockedVote.mockResolvedValue(undefined);
    setSession({ data: { user: { id: "usr_1" } }, isPending: false });
  });

  it("renders with the upvote count", () => {
    renderWithQuery(<UpvoteButton report={{ id: "rep_1", upvotes: 7 }} />);

    expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("calls voteOnReport with the report id when clicked", async () => {
    const user = userEvent.setup();
    renderWithQuery(<UpvoteButton report={{ id: "rep_42", upvotes: 0 }} />);

    await user.click(screen.getByRole("button", { name: /confirmar/i }));

    await waitFor(() => {
      expect(mockedVote).toHaveBeenCalledWith("rep_42");
    });
  });

  it("optimistically increments the count on click", async () => {
    const user = userEvent.setup();
    let resolveVote: (() => void) | undefined;
    mockedVote.mockImplementationOnce(
      () => new Promise<void>((resolve) => { resolveVote = resolve; }),
    );

    renderWithQuery(<UpvoteButton report={{ id: "rep_1", upvotes: 4 }} />);

    await user.click(screen.getByRole("button", { name: /confirmar/i }));

    expect(await screen.findByText("5")).toBeInTheDocument();

    resolveVote?.();
  });

  it("is disabled with a login tooltip when session is missing", () => {
    setSession({ data: null, isPending: false });

    renderWithQuery(<UpvoteButton report={{ id: "rep_1", upvotes: 0 }} />);

    const button = screen.getByRole("button", { name: /confirmar/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "Faça login para confirmar");
  });

  it("treats 409 as success (already voted, no error shown)", async () => {
    const user = userEvent.setup();
    const conflict = Object.assign(new Error("conflict"), {
      isAxiosError: true,
      response: { status: 409 },
    });
    mockedVote.mockRejectedValueOnce(conflict);

    renderWithQuery(<UpvoteButton report={{ id: "rep_1", upvotes: 2 }} />);

    await user.click(screen.getByRole("button", { name: /confirmar/i }));

    expect(await screen.findByRole("button", { name: /confirmado/i })).toBeDisabled();
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });

  it("rolls back the optimistic count and surfaces an error on failure", async () => {
    const user = userEvent.setup();
    mockedVote.mockRejectedValueOnce(
      Object.assign(new Error("boom"), { response: { status: 500 } }),
    );

    renderWithQuery(<UpvoteButton report={{ id: "rep_1", upvotes: 9 }} />);

    await user.click(screen.getByRole("button", { name: /confirmar/i }));

    expect(await screen.findByText(/erro/i)).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("disables the button while the vote is in flight", async () => {
    const user = userEvent.setup();
    mockedVote.mockImplementationOnce(() => new Promise<void>(() => {}));

    renderWithQuery(<UpvoteButton report={{ id: "rep_1", upvotes: 0 }} />);

    const button = screen.getByRole("button", { name: /confirmar/i });
    await user.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
    expect(mockedVote).toHaveBeenCalledTimes(1);
  });
});
