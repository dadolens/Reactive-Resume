import { Fragment, useCallback, useRef } from "react";
import { match } from "ts-pattern";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getSectionIcon, getSectionTitle, type RightSidebarSection } from "@/utils/resume/section";
import { BuilderSidebarEdge } from "@/routes/builder/$resumeId/-components/edge";
import { useBuilderSidebar } from "@/routes/builder/$resumeId/-store/sidebar";
import { DesignSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/right/sections/design";
import { LayoutSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/right/sections/layout";
import { NotesSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/right/sections/notes";
import { PageSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/right/sections/page";
import { TemplateSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/right/sections/template";
import { TypographySectionBuilder } from "@/routes/builder/$resumeId/-sidebar/right/sections/typography";
import { ExportSectionEditor } from "@/editor/sections/export";

const rightSidebarSections: RightSidebarSection[] = [
	"template",
	"layout",
	"typography",
	"design",
	"page",
	"notes",
	"export",
] as const;

function getSectionComponent(type: RightSidebarSection) {
	return match(type)
		.with("template", () => <TemplateSectionBuilder />)
		.with("layout", () => <LayoutSectionBuilder />)
		.with("typography", () => <TypographySectionBuilder />)
		.with("design", () => <DesignSectionBuilder />)
		.with("page", () => <PageSectionBuilder />)
		.with("notes", () => <NotesSectionBuilder />)
		.with("export", () => <ExportSectionEditor />)
		// Not used in editor extraction
		.otherwise(() => null);
}

export function EditorSidebarRight() {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	return (
		<>
			<SidebarEdge scrollAreaRef={scrollAreaRef} />

			<ScrollArea ref={scrollAreaRef} className="@container h-full bg-background sm:me-12 print:hidden">
				<div className="space-y-4 p-4">
					{rightSidebarSections.map((section) => (
						<Fragment key={section}>
							{getSectionComponent(section)}
							<Separator />
						</Fragment>
					))}
				</div>
			</ScrollArea>
		</>
	);
}

type SidebarEdgeProps = {
	scrollAreaRef: React.RefObject<HTMLDivElement | null>;
};

function SidebarEdge({ scrollAreaRef }: SidebarEdgeProps) {
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	const scrollToSection = useCallback(
		(section: RightSidebarSection) => {
			if (!scrollAreaRef.current) return;
			toggleSidebar("right", true);

			const sectionElement = scrollAreaRef.current.querySelector(`#sidebar-${section}`);
			sectionElement?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
		},
		[toggleSidebar, scrollAreaRef],
	);

	return (
		<BuilderSidebarEdge side="right">
			<div />

			<div className="flex flex-col justify-center gap-y-2">
				{rightSidebarSections.map((section) => (
					<Button
						key={section}
						size="icon"
						variant="ghost"
						title={getSectionTitle(section)}
						onClick={() => scrollToSection(section)}
					>
						{getSectionIcon(section)}
					</Button>
				))}
			</div>

			<div />
		</BuilderSidebarEdge>
	);
}
