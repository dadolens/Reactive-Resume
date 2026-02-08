import { i18n } from "@lingui/core";
import { I18nProvider, Trans } from "@lingui/react";
import { IconContext } from "@phosphor-icons/react";
import { MotionConfig } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { AssetBaseUrlProvider } from "@/components/resume/assets";
import { ThemeProviderBase } from "@/components/theme/provider";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import { PortalContainerProvider } from "@/components/ui/portal-container";
import { ConfirmDialogProvider } from "@/hooks/use-confirm";
import { PromptDialogProvider } from "@/hooks/use-prompt";
import { ResumeEditor } from "@/editor/editor";
import { EditorDialogManager } from "@/editor/dialogs/manager";
import type { ResumeData } from "@/schema/resume/data";
import { isRTL, loadLocale, type Locale } from "@/utils/locale";
import type { Theme } from "@/utils/theme";
import { cn } from "@/utils/style";

type EditorAppProps = {
	value: ResumeData;
	onChange?: (data: ResumeData) => void;
	locale?: Locale;
	theme?: Theme;
	assetsBaseUrl?: string;
	portalContainer?: Element | DocumentFragment | null;
	showPageNumbers?: boolean;
	className?: string;
};

export function EditorApp({
	value,
	onChange,
	locale = "en-US",
	theme = "light",
	assetsBaseUrl,
	portalContainer = null,
	showPageNumbers = true,
	className,
}: EditorAppProps) {
	const [resolvedTheme, setResolvedTheme] = useState<Theme>(theme);
	const [isLocaleReady, setIsLocaleReady] = useState(false);

	useEffect(() => {
		setResolvedTheme(theme);
	}, [theme]);

	useEffect(() => {
		let isMounted = true;
		setIsLocaleReady(false);
		loadLocale(locale).then(() => {
			if (isMounted) setIsLocaleReady(true);
		});
		return () => {
			isMounted = false;
		};
	}, [locale]);

	const dir = useMemo(() => (isRTL(locale) ? "rtl" : "ltr"), [locale]);

	const setTheme = (value: Theme) => {
		setResolvedTheme(value);
	};

	const toggleTheme = () => {
		setResolvedTheme((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return (
		<PortalContainerProvider container={portalContainer}>
			<AssetBaseUrlProvider baseUrl={assetsBaseUrl}>
				<MotionConfig reducedMotion="user">
					<I18nProvider i18n={i18n}>
						<IconContext.Provider value={{ size: 16, weight: "regular" }}>
							<ThemeProviderBase theme={resolvedTheme} setTheme={setTheme} toggleTheme={toggleTheme}>
								<div dir={dir} className={cn("relative h-full w-full", resolvedTheme === "dark" && "dark", className)}>
									<ConfirmDialogProvider>
										<PromptDialogProvider>
											{isLocaleReady ? (
												<ResumeEditor value={value} onChange={onChange} showPageNumbers={showPageNumbers} />
											) : (
												<div className="flex h-full w-full items-center justify-center gap-x-3 bg-background">
													<Spinner className="size-6" />
													<p className="text-muted-foreground">
														<Trans>Loading...</Trans>
													</p>
												</div>
											)}

											<EditorDialogManager />
											<Toaster richColors position="bottom-right" />
										</PromptDialogProvider>
									</ConfirmDialogProvider>
								</div>
							</ThemeProviderBase>
						</IconContext.Provider>
					</I18nProvider>
				</MotionConfig>
			</AssetBaseUrlProvider>
		</PortalContainerProvider>
	);
}
