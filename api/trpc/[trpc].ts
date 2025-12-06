import type { VercelRequest, VercelResponse } from "@vercel/node";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: req as any,
    router: appRouter,
    createContext: () => createContext({ req: req as any, res: res as any }),
    onError({ error }) {
      console.error("tRPC Error:", error);
    },
  }).then((response) => {
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    return response.text().then((body) => res.send(body));
  });
}
