import { defaultResumeData, type ResumeData } from "@/schema/resume/data";
import { templateSchema } from "@/schema/templates";

export type EditorResume = {
	id: string;
	name: string;
	slug: string;
	tags: string[];
	data: ResumeData;
	isLocked: boolean;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override: unknown): T {
	if (Array.isArray(base)) {
		return (Array.isArray(override) ? override : base) as T;
	}

	if (isPlainObject(base)) {
		const result: Record<string, unknown> = { ...base };

		if (isPlainObject(override)) {
			for (const [key, value] of Object.entries(override)) {
				const baseValue = (base as Record<string, unknown>)[key];
				if (baseValue === undefined) {
					result[key] = value;
				} else {
					result[key] = mergeDeep(baseValue, value);
				}
			}
		}

		return result as T;
	}

	return (override !== undefined ? override : base) as T;
}

export function cloneResumeData(data: ResumeData): ResumeData {
	if (typeof structuredClone === "function") {
		return structuredClone(data);
	}
	return JSON.parse(JSON.stringify(data)) as ResumeData;
}

export function buildEditorResume(data?: ResumeData): EditorResume {
	const normalized = mergeDeep(defaultResumeData, data ?? {});

	// Guard against legacy/unknown template ids (e.g. "modern") to prevent runtime errors.
	if (!templateSchema.safeParse(normalized.metadata.template).success) {
		normalized.metadata.template = defaultResumeData.metadata.template;
	}

	const name = normalized.basics?.name?.trim() || "Untitled Resume";

	return {
		id: "local",
		name,
		slug: "",
		tags: [],
		data: normalized,
		isLocked: false,
	};
}
