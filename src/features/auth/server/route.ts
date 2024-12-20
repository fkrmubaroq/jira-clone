import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { loginSchema, registerSchema } from "../schema";

const authRoutes = new Hono()

  .post("/login",  zValidator("json", loginSchema), async (c) => {
    const data = c.req.valid("json");
    return c.json(data);
  })

  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    return c.json({
      name,
      email,
      password,
    });
  });

export default authRoutes;
