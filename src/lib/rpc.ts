import type { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

export const rpc = hc<AppType>("/api");

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
