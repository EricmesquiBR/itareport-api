import { fileURLToPath } from "node:url";
import { db } from "./index.js";
import { categories } from "./schema.js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "./schema.js";

export const CATEGORIES = [
  { name: "Buracos e Pavimentação", slug: "buracos-e-pavimentacao" },
  { name: "Iluminação Pública", slug: "iluminacao-publica" },
  { name: "Lixo e Limpeza Urbana", slug: "lixo-e-limpeza" },
  { name: "Abastecimento de Água", slug: "abastecimento-de-agua" },
  { name: "Esgoto", slug: "esgoto" },
  { name: "Sinalização de Trânsito", slug: "sinalizacao-de-transito" },
  { name: "Áreas Verdes e Praças", slug: "areas-verdes-e-pracas" },
  { name: "Calçadas e Acessibilidade", slug: "calcadas-e-acessibilidade" },
  { name: "Outros", slug: "outros" },
] as const;

export async function seedCategories(
  database: PostgresJsDatabase<typeof schema>,
) {
  await database
    .insert(categories)
    .values([...CATEGORIES])
    .onConflictDoNothing({ target: categories.slug });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedCategories(db)
    .then(() => {
      console.log(`Seeded ${CATEGORIES.length} categories.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
