import authRoutes from "@/features/auth/server/route";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api")


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/auth", authRoutes)

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
