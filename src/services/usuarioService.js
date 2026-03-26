import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export async function createUser(name, cpf, email, password) {
  const [usuario] = await db.insert(users).values({ name, cpf, email, password }).returning();

  return usuario;
}

export async function findUserByEmail(email) {
  const usuario = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return usuario;
}

export async function findUserById(id) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return user;
}

export async function findAllUsers() {
  const usersList = await db.query.users.findMany();
  return usersList;
}

export async function updateUser(id, name, email, password) {
  const data = { name, email };
  if (password) {
    data.password = password;
  }
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();

  return user;
}

export async function deleteUserById(id) {
  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
  return deletedUser;
}
