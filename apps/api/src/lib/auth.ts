import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { namedId } from "../utils/named-id.js";
import { env } from "../env.js";

export const auth = betterAuth({
  secret: env.JWT_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: ({ model }) => {
        const prefixes: Record<string, string> = {
          user: "usr",
          session: "ses",
          account: "acc",
          verification: "vrf",
        };
        return namedId(prefixes[model] ?? model.slice(0, 3));
      },
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
});
