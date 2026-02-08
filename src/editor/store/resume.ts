import { t } from "@lingui/core/macro";
import isDeepEqual from "fast-deep-equal";
import type { WritableDraft } from "immer";
import { current } from "immer";
import { toast } from "sonner";
import type { TemporalState } from "zundo";
import { temporal } from "zundo";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand/react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import type { ResumeData } from "@/schema/resume/data";

type Resume = {
	id: string;
	name: string;
	slug: string;
	tags: string[];
	data: ResumeData;
	isLocked: boolean;
};

type ResumeStoreState = {
	resume: Resume;
	isReady: boolean;
	onChange: ((data: ResumeData) => void) | null;
};

type ResumeStoreActions = {
	initialize: (resume: Resume | null) => void;
	setOnChange: (onChange: ((data: ResumeData) => void) | null) => void;
	updateResumeData: (fn: (draft: WritableDraft<ResumeData>) => void) => void;
};

type ResumeStore = ResumeStoreState & ResumeStoreActions;

let errorToastId: string | number | undefined;

type PartializedState = { resume: Resume | null };

export const useResumeStore = create<ResumeStore>()(
	temporal(
		immer((set) => ({
			resume: null as unknown as Resume,
			isReady: false,
			onChange: null as ((data: ResumeData) => void) | null,

			initialize: (resume) => {
				set((state) => {
					state.resume = resume as Resume;
					state.isReady = resume !== null;
					useResumeStore.temporal.getState().clear();
				});
			},

			setOnChange: (onChange) => {
				set((state) => {
					state.onChange = onChange ?? null;
				});
			},

			updateResumeData: (fn) => {
				set((state) => {
					if (!state.resume) return state;

					if (state.resume.isLocked) {
						errorToastId = toast.error(t`This resume is locked and cannot be updated.`, { id: errorToastId });
						return state;
					}

					fn(state.resume.data);
					const updatedResume = current(state.resume);
					state.onChange?.(updatedResume.data);
				});
			},
		})),
		{
			partialize: (state) => ({ resume: state.resume }),
			equality: (pastState, currentState) => isDeepEqual(pastState, currentState),
			limit: 100,
		},
	),
);

export function useTemporalStore<T>(selector: (state: TemporalState<PartializedState>) => T): T {
	return useStoreWithEqualityFn(useResumeStore.temporal, selector);
}
