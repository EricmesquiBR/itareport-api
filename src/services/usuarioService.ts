import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function createUser(name: any, cpf: any, email: any, password: any) {
  const [usuario] = await db.insert(users).values({ name, cpf, email, password }).returning();

  return usuario;
}

export async function findUserByEmail(email: any) {
  const usuario = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return usuario;
}

export async function findUserById(id: any) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return user;
}

export async function findAllUsers() {
  const usersList = await db.query.users.findMany();
  return usersList;
}

export async function updateUser(id: any, name: any, email: any, password?: any) {
  const [user] = await db
    .update(users)
    .set({ name, email, ...(password ? { password } : {}) })
    .where(eq(users.id, id))
    .returning();

  return user;
}

export async function deleteUserById(id: any) {
  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
  return deletedUser;
}
