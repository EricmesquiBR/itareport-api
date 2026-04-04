import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import * as userService from "./user.service.js";
import { createUserSchema, loginSchema, updateUserSchema } from "./user.schema.js";

const SALT_ROUNDS = 10;

function omitPassword<T extends { password: string }>(user: T) {
  const { password: _, ...rest } = user;
  return rest;
}

export const userRoutes = new Hono()
  .post("/", zValidator("json", createUserSchema), async (c) => {
    const body = c.req.valid("json");
    const existingUser = await userService.findUserByEmail(body.email);

    if (existingUser) {
      return c.json(
        {
          success: false,
          data: { email: body.email },
          message: "User with this email already exist",
        },
        409,
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);
    const user = await userService.createUser({ ...body, password: hashedPassword });

    return c.json(
      { success: true, data: omitPassword(user!), message: "User created successfully" },
      201,
    );
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return c.json({ success: false, data: { email }, message: "Could not find this user" }, 404);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return c.json({ success: false, data: { email }, message: "Incorrect password" }, 401);
    }

    return c.json({
      success: true,
      data: omitPassword(user),
      message: "User logged in successfully",
    });
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const user = await userService.findUserById(id);

    if (!user) {
      return c.json({ success: false, message: "Could not find this user" }, 404);
    }

    return c.json({
      success: true,
      data: omitPassword(user),
      message: "User found successfully",
    });
  })
  .put("/:id", zValidator("json", updateUserSchema), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");

    const existing = await userService.findUserById(id);
    if (!existing) {
      return c.json({ success: false, data: { id }, message: "Could not find this user" }, 404);
    }

    const data = { ...body };
    if (body.password) {
      data.password = await bcrypt.hash(body.password, SALT_ROUNDS);
    }

    const updatedUser = await userService.updateUser(id, data);

    return c.json({
      success: true,
      data: omitPassword(updatedUser!),
      message: "User updated successfully",
    });
  })
  .delete("/:id", async (c) => {
    const { id } = c.req.param();

    const existing = await userService.findUserById(id);
    if (!existing) {
      return c.json({ success: false, data: { id }, message: "Could not find this user" }, 404);
    }

    await userService.deleteUserById(id);

    return c.json({
      success: true,
      data: { id },
      message: "User deleted successfully",
    });
  });
