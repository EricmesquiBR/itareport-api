import { createAuthClient } from "better-auth/react";

import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.API_ROOT,
});

export const { signIn, signUp, signOut, useSession } = authClient;
