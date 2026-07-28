import { cp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const outdir = resolve(root, "dist");
export const publicDir = resolve(root, "public");

/**
 * Rewrites index.html to reference whatever filenames esbuild actually emitted.
 * Runs on every build so the dev server picks up renames automatically.
 */
function htmlPlugin() {
  return {
    name: "html",
    setup(build) {
      build.onEnd(async (result) => {
        if (result.errors.length > 0 || !result.metafile) return;

        const outputs = Object.keys(result.metafile.outputs).map((path) =>
          path.replace(/^dist/, ""),
        );
        const js = outputs.find((path) => path.endsWith(".js"));
        const css = outputs.find((path) => path.endsWith(".css"));
        if (!js) throw new Error("esbuild emitted no JS entry point");

        const tags = [
          css && `<link rel="stylesheet" href="${css}" />`,
          `<script type="module" src="${js}"></script>`,
        ]
          .filter(Boolean)
          .join("\n    ");

        const template = await readFile(resolve(root, "index.html"), "utf8");
        await writeFile(resolve(outdir, "index.html"), template.replace("<!--BUNDLE-->", tags));
      });
    },
  };
}

/**
 * Production builds get content-hashed filenames so the static file server can
 * cache them indefinitely. Dev keeps stable names and inline sourcemaps.
 */
export function buildOptions({ production }) {
  return {
    entryPoints: [resolve(root, "src/main.tsx")],
    outdir,
    bundle: true,
    format: "esm",
    platform: "browser",
    target: ["es2022", "chrome111", "edge111", "firefox111", "safari16.4"],
    jsx: "automatic",
    entryNames: production ? "[name]-[hash]" : "[name]",
    assetNames: "assets/[name]-[hash]",
    loader: { ".png": "file", ".jpg": "file", ".svg": "file" },
    define: {
      "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
    },
    minify: production,
    sourcemap: production ? false : "inline",
    metafile: true,
    logLevel: "info",
    plugins: [htmlPlugin()],
  };
}

export async function resetOutdir() {
  await rm(outdir, { recursive: true, force: true });
  await cp(publicDir, outdir, { recursive: true });
}
