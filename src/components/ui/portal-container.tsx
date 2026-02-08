import { createContext, useContext, type ReactNode } from "react";

type PortalContainer = Element | DocumentFragment | null;

const PortalContainerContext = createContext<PortalContainer>(null);

type PortalContainerProviderProps = {
	container: PortalContainer;
	children: ReactNode;
};

export function PortalContainerProvider({ container, children }: PortalContainerProviderProps) {
	return <PortalContainerContext value={container}>{children}</PortalContainerContext>;
}

export function usePortalContainer() {
	return useContext(PortalContainerContext);
}
