import * as esbuild from "esbuild";

import { buildOptions, resetOutdir } from "./esbuild.config.js";

await resetOutdir();
await esbuild.build(buildOptions({ production: true }));
