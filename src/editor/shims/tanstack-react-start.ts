type Handler<TArgs extends any[] = any[], TResult = any> = (...args: TArgs) => TResult;

type ServerChain = {
	client: <T extends Handler>(clientFn: T) => T;
};

export const createIsomorphicFn = () => ({
	server: (_serverFn?: Handler) =>
		({
			client: (clientFn: Handler) => clientFn,
		}) satisfies ServerChain,
	client: (clientFn: Handler) => clientFn,
});

export const createServerFn = () => {
	const chain = {
		inputValidator: (_validator: unknown) => chain,
		handler: <T extends Handler>(fn: T) => fn,
	};

	return chain;
};

export const createServerOnlyFn = () => ({
	handler: <T extends Handler>(fn: T) => fn,
});
