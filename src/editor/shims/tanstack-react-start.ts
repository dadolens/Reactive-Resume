type Handler<TArgs extends any[] = any[], TResult = any> = (...args: TArgs) => TResult;
type IsomorphicChain = {
	client: (clientFn: Handler) => IsomorphicFn;
	server: (serverFn?: Handler) => IsomorphicFn;
};

type IsomorphicFn = Handler & {
	client: (clientFn: Handler) => IsomorphicFn;
	server: (serverFn: Handler) => IsomorphicFn;
};

export const createIsomorphicFn = (): IsomorphicChain => {
	let clientFn: Handler | undefined;
	let serverFn: Handler | undefined;

	const resolve = (): Handler => {
		if (clientFn) return clientFn;
		if (serverFn) {
			return () => {
				throw new Error("Server-only function called in the browser");
			};
		}
		return () => undefined;
	};

	const fn = ((...args: any[]) => resolve()(...args)) as IsomorphicFn;

	fn.client = (nextClient: Handler) => {
		clientFn = nextClient;
		return fn;
	};

	fn.server = (nextServer: Handler) => {
		serverFn = nextServer;
		return fn;
	};

	return {
		server: (serverHandler?: Handler) => fn.server(serverHandler ?? (() => undefined)),
		client: (clientHandler: Handler) => fn.client(clientHandler),
	};
};

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
