import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.API_ROOT,
  plugins: [
    inferAdditionalFields({
      user: {
        username: { type: "string", required: false },
        deletedAt: { type: "date", required: false },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
