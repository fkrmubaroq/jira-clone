import authRoutes from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api")

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/auth", authRoutes)
.route("/workspaces", workspaces)

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
