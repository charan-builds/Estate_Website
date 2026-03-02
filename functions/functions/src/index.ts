import * as functions from "firebase-functions";
import next from "next";

const dev = false;

const app = next({
  dev,
  conf: { distDir: ".next" },
});

const handle = app.getRequestHandler();

export const nextApp = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});