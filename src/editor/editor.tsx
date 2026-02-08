import isDeepEqual from "fast-deep-equal";
import { useEffect, useMemo } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { ResumePreview } from "@/components/resume/preview";
import { useCSSVariables } from "@/components/resume/hooks/use-css-variables";
import { useResumeStore } from "@/components/resume/store/resume";
import { defaultResumeData, type ResumeData } from "@/schema/resume/data";
import { ResizableGroup, ResizablePanel, ResizableSeparator } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePanelRef } from "react-resizable-panels";
import { useBuilderSidebar, useBuilderSidebarStore } from "@/routes/builder/$resumeId/-store/sidebar";
import { EditorDock } from "@/editor/dock";
import { EditorHeader } from "@/editor/header";
import { EditorSidebarLeft } from "@/editor/sidebar/left";
import { EditorSidebarRight } from "@/editor/sidebar/right";
import { buildEditorResume } from "@/editor/utils/resume";

type ResumeEditorProps = React.ComponentProps<"div"> & {
	value: ResumeData;
	onChange?: (data: ResumeData) => void;
	showPageNumbers?: boolean;
};

const defaultLayout = { left: 30, artboard: 40, right: 30 };

export function ResumeEditor({ value, onChange, showPageNumbers = true, ...props }: ResumeEditorProps) {
	const resume = useResumeStore((state) => state.resume);
	const isReady = useResumeStore((state) => state.isReady);
	const initialize = useResumeStore((state) => state.initialize);
	const setOnChange = useResumeStore((state) => state.setOnChange);

	const style = useCSSVariables(resume?.data ?? defaultResumeData);

	useEffect(() => {
		setOnChange(onChange ?? null);
		return () => setOnChange(null);
	}, [onChange, setOnChange]);

	useEffect(() => {
		const nextResume = buildEditorResume(value);
		const currentData = useResumeStore.getState().resume?.data ?? null;

		if (!currentData || !isDeepEqual(currentData, nextResume.data)) {
			initialize(nextResume);
		}
	}, [value, initialize]);

	useEffect(() => {
		return () => {
			initialize(null);
		};
	}, [initialize]);

	if (!isReady) return <LoadingScreen />;

	return <EditorLayout style={style} showPageNumbers={showPageNumbers} {...props} />;
}

type EditorLayoutProps = React.ComponentProps<"div"> & {
	showPageNumbers: boolean;
};

function EditorLayout({ showPageNumbers, ...props }: EditorLayoutProps) {
	const isMobile = useIsMobile();

	const leftSidebarRef = usePanelRef();
	const rightSidebarRef = usePanelRef();

	const setLeftSidebar = useBuilderSidebarStore((state) => state.setLeftSidebar);
	const setRightSidebar = useBuilderSidebarStore((state) => state.setRightSidebar);

	const { maxSidebarSize, collapsedSidebarSize } = useBuilderSidebar((state) => ({
		maxSidebarSize: state.maxSidebarSize,
		collapsedSidebarSize: state.collapsedSidebarSize,
	}));

	useEffect(() => {
		if (!leftSidebarRef || !rightSidebarRef) return;

		setLeftSidebar(leftSidebarRef);
		setRightSidebar(rightSidebarRef);
	}, [leftSidebarRef, rightSidebarRef, setLeftSidebar, setRightSidebar]);

	const layout = useMemo(() => defaultLayout, []);

	const leftSidebarSize = isMobile ? 0 : layout.left;
	const rightSidebarSize = isMobile ? 0 : layout.right;
	const artboardSize = isMobile ? 100 : layout.artboard;

	return (
		<div className="flex h-full w-full flex-col" {...props}>
			<EditorHeader />

			<ResizableGroup orientation="horizontal" className="flex-1">
				<ResizablePanel
					collapsible
					id="left"
					panelRef={leftSidebarRef}
					maxSize={maxSidebarSize}
					minSize={collapsedSidebarSize * 2}
					collapsedSize={collapsedSidebarSize}
					defaultSize={leftSidebarSize}
					className="z-20 h-full"
				>
					<EditorSidebarLeft />
				</ResizablePanel>
				<ResizableSeparator withHandle className="z-20 border-s print:hidden" />
				<ResizablePanel id="artboard" defaultSize={artboardSize} className="h-full">
					<EditorCanvas showPageNumbers={showPageNumbers} />
				</ResizablePanel>
				<ResizableSeparator withHandle className="z-20 border-e print:hidden" />
				<ResizablePanel
					collapsible
					id="right"
					panelRef={rightSidebarRef}
					maxSize={maxSidebarSize}
					minSize={collapsedSidebarSize * 2}
					collapsedSize={collapsedSidebarSize}
					defaultSize={rightSidebarSize}
					className="z-20 h-full"
				>
					<EditorSidebarRight />
				</ResizablePanel>
			</ResizableGroup>
		</div>
	);
}

type EditorCanvasProps = {
	showPageNumbers: boolean;
};

function EditorCanvas({ showPageNumbers }: EditorCanvasProps) {
	return (
		<div className="absolute inset-0">
			<TransformWrapper centerOnInit limitToBounds={false} minScale={0.3} initialScale={0.6} maxScale={6}>
				<TransformComponent wrapperClass="h-full! w-full!">
					<ResumePreview
						showPageNumbers={showPageNumbers}
						className="flex items-start space-x-10 space-y-10"
						pageClassName="shadow-xl rounded-md overflow-hidden print:w-full!"
					/>
				</TransformComponent>

				<EditorDock />
			</TransformWrapper>
		</div>
	);
}
