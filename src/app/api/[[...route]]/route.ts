import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
    return c.json({
        message: "Hello World"
    })
})

app.get("/project/:projectId", (c) => {
    const { projectId } = c.req.param();
    return c.json({
        projectId,
        "xxs": "xxx"
    })
})
export const GET = handle(app);
