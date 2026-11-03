import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(apiDirectory, "../..");

dotenv.config({ path: path.join(projectDirectory, ".env.local") });
dotenv.config({ path: path.join(projectDirectory, ".env") });
dotenv.config({ path: path.join(projectDirectory, "api", ".env") });

const [{ app }, { pool }] = await Promise.all([
  import("./app.js"),
  import("./database.js")
]);

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`PichuPaper API listening on port ${port}.`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down API.`);
  server.close(async (error) => {
    if (error) {
      console.error("HTTP server shutdown failed.", error.message);
      process.exitCode = 1;
    }
    if (pool) await pool.end();
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
