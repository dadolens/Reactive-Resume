import z from "zod";

const themeSchema = z.union([z.literal("light"), z.literal("dark")]);

export type Theme = z.infer<typeof themeSchema>;

export function isTheme(theme: string): theme is Theme {
	return themeSchema.safeParse(theme).success;
}
