import { fileURLToPath } from "node:url";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: [
			{ find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
			{
				find: "@/components/resume/store/resume",
				replacement: fileURLToPath(new URL("./src/editor/store/resume.ts", import.meta.url)),
			},
			{
				find: "@/components/theme/provider",
				replacement: fileURLToPath(new URL("./src/editor/theme/provider.tsx", import.meta.url)),
			},
			{ find: "@/utils/locale", replacement: fileURLToPath(new URL("./src/editor/locale.ts", import.meta.url)) },
			{ find: "@/utils/theme", replacement: fileURLToPath(new URL("./src/editor/theme.ts", import.meta.url)) },
			{
				find: /^@tanstack\/react-start$/,
				replacement: fileURLToPath(new URL("./src/editor/shims/tanstack-react-start.ts", import.meta.url)),
			},
			{
				find: /^@tanstack\/react-start\/server$/,
				replacement: fileURLToPath(new URL("./src/editor/shims/tanstack-react-start-server.ts", import.meta.url)),
			},
			{
				find: /^@tanstack\/start-server-core$/,
				replacement: fileURLToPath(new URL("./src/editor/shims/tanstack-start-server-core.ts", import.meta.url)),
			},
		],
	},
	plugins: [lingui(), tailwindcss(), viteReact({ babel: { plugins: ["@lingui/babel-plugin-lingui-macro"] } })],
	build: {
		lib: {
			entry: fileURLToPath(new URL("./src/editor/web-component.tsx", import.meta.url)),
			name: "ResumeEditor",
			fileName: () => "resume-editor.js",
			formats: ["es"],
		},
		outDir: "dist/editor",
		emptyOutDir: true,
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === "style.css") return "assets/resume-editor.css";
					return "assets/[name][extname]";
				},
			},
		},
	},
});
