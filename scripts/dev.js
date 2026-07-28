import * as esbuild from "esbuild";

import { buildOptions, outdir, resetOutdir } from "./esbuild.config.js";

const port = Number(process.env.PORT) || 3002;

await resetOutdir();

const ctx = await esbuild.context(buildOptions({ production: false }));
await ctx.watch();

const { hosts } = await ctx.serve({ servedir: outdir, port });
console.log(`Server is now running at http://${hosts[0]}:${port}`);
