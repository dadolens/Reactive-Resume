import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import type { Theme } from "@/utils/theme";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (value: Theme, options?: { playSound?: boolean }) => void;
	toggleTheme: (options?: { playSound?: boolean }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderBaseProps = PropsWithChildren<ThemeContextValue>;

export function ThemeProviderBase({ children, theme, setTheme, toggleTheme }: ThemeProviderBaseProps) {
	return <ThemeContext value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext>;
}

type ThemeProviderProps = PropsWithChildren<{ theme: Theme }>;

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
	const [currentTheme, setCurrentTheme] = useState<Theme>(theme);

	const value = useMemo(
		() => ({
			theme: currentTheme,
			setTheme: (value: Theme) => setCurrentTheme(value),
			toggleTheme: () => setCurrentTheme((prev) => (prev === "dark" ? "light" : "dark")),
		}),
		[currentTheme],
	);

	return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
	const value = useContext(ThemeContext);
	if (!value) throw new Error("useTheme must be used within a ThemeProvider");
	return value;
}
