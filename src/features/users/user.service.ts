import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

interface CreateUserInput {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export async function createUser(input: CreateUserInput) {
  const [user] = await db.insert(users).values(input).returning();
  return user;
}

export async function findUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
}

export async function findUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user;
}

export async function findAllUsers() {
  const usersList = await db.query.users.findMany();
  return usersList;
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
}

export async function deleteUserById(id: string) {
  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
  return deletedUser;
}
