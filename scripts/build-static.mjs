import { build } from "esbuild";
import { cp, mkdir, realpath, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "node:process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
try {
  loadEnvFile(resolve(root, ".env.local"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const output = resolve(root, "dist");
const realRoot = await realpath(root);
if (output === root || !output.startsWith(`${root}${sep}`)) {
  throw new Error("The static build output must stay inside the project.");
}

const apiUrl = (process.env.PICHUPAPER_API_URL || "").trim().replace(/\/+$/, "");
const authUrl = (process.env.NEON_AUTH_BASE_URL || "").trim().replace(/\/+$/, "");
if (apiUrl) {
  let parsedApiUrl;
  try {
    parsedApiUrl = new URL(apiUrl);
  } catch {
    throw new Error("PICHUPAPER_API_URL must be an absolute URL.");
  }
  const isLocalHttp = parsedApiUrl.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(parsedApiUrl.hostname);
  if ((!isLocalHttp && parsedApiUrl.protocol !== "https:") ||
      parsedApiUrl.origin !== apiUrl ||
      parsedApiUrl.pathname !== "/" ||
      parsedApiUrl.search ||
      parsedApiUrl.hash) {
    throw new Error("PICHUPAPER_API_URL must be an HTTPS origin (or local HTTP origin) without a path.");
  }
}
if (authUrl) {
  let parsedAuthUrl;
  try {
    parsedAuthUrl = new URL(authUrl);
  } catch {
    throw new Error("NEON_AUTH_BASE_URL must be an absolute URL.");
  }
  const isLocalHttp = parsedAuthUrl.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(parsedAuthUrl.hostname);
  if ((!isLocalHttp && parsedAuthUrl.protocol !== "https:") ||
      parsedAuthUrl.search || parsedAuthUrl.hash) {
    throw new Error("NEON_AUTH_BASE_URL must use HTTPS (or local HTTP) without query or fragment.");
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const publicEntries = [
  "index.html",
  "style.css",
  "favicon.svg",
  "robots.txt",
  "assets"
];

for (const entry of publicEntries) {
  await cp(join(realRoot, entry), join(output, entry), { recursive: true });
}

await writeFile(
  join(output, "api-config.js"),
  `// These public URLs are configuration, not secrets.\nwindow.PICHUPAPER_API_URL = ${JSON.stringify(apiUrl)};\nwindow.PICHUPAPER_AUTH_URL = ${JSON.stringify(authUrl)};\n`,
  "utf8"
);
await build({
  entryPoints: [join(realRoot, "script.js")],
  bundle: true,
  format: "esm",
  target: "es2022",
  outfile: join(output, "app.js")
});

console.log(`Static site built in ${output}.`);
