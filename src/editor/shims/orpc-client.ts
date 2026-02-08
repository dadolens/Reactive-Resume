import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BatchLinkPlugin } from "@orpc/client/plugins";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const getBaseUrl = () => {
	if (typeof window === "undefined") return "";
	return window.location.origin;
};

export const getORPCClient = () => {
	const link = new RPCLink({
		url: `${getBaseUrl()}/api/rpc`,
		plugins: [new BatchLinkPlugin({ groups: [{ condition: () => true, context: {} }] })],
		fetch: (request, init) => fetch(request, { ...init, credentials: "include" }),
	});

	return createORPCClient(link);
};

export const client = getORPCClient();
export const orpc = createTanstackQueryUtils(client);

export type RouterInput = any;
export type RouterOutput = any;
