import { defaultResumeData, type ResumeData } from "@/schema/resume/data";

export type EditorResume = {
	id: string;
	name: string;
	slug: string;
	tags: string[];
	data: ResumeData;
	isLocked: boolean;
};

export function cloneResumeData(data: ResumeData): ResumeData {
	if (typeof structuredClone === "function") {
		return structuredClone(data);
	}
	return JSON.parse(JSON.stringify(data)) as ResumeData;
}

export function buildEditorResume(data?: ResumeData): EditorResume {
	const normalized = cloneResumeData(data ?? defaultResumeData);
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
