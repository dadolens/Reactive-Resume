import { createContext, useContext } from "react";

type AssetBaseUrl = string | null;

const AssetBaseUrlContext = createContext<AssetBaseUrl>(null);

type AssetBaseUrlProviderProps = {
	baseUrl?: string | null;
	children: React.ReactNode;
};

export function AssetBaseUrlProvider({ baseUrl, children }: AssetBaseUrlProviderProps) {
	return <AssetBaseUrlContext value={baseUrl ?? null}>{children}</AssetBaseUrlContext>;
}

export function useAssetUrl(path?: string) {
	const baseUrl = useContext(AssetBaseUrlContext);

	if (!path) return path ?? "";
	if (!baseUrl) return path;

	if (/^(data:|https?:|blob:)/i.test(path)) return path;

	const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
	if (path.startsWith("/")) return `${normalizedBase}${path}`;
	return `${normalizedBase}/${path}`;
}
