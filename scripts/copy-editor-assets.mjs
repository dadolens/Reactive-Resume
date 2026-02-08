import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("public/templates");
const destination = resolve("dist/editor/templates");

if (existsSync(source)) {
	await mkdir(destination, { recursive: true });
	await cp(source, destination, { recursive: true });
}
