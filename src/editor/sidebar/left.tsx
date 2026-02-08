import { Fragment, useCallback, useRef } from "react";
import { match } from "ts-pattern";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getSectionIcon, getSectionTitle, type LeftSidebarSection, leftSidebarSections } from "@/utils/resume/section";
import { BuilderSidebarEdge } from "@/routes/builder/$resumeId/-components/edge";
import { useBuilderSidebar } from "@/routes/builder/$resumeId/-store/sidebar";
import { AwardsSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/awards";
import { BasicsSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/basics";
import { CertificationsSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/certifications";
import { CustomSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/custom";
import { EducationSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/education";
import { ExperienceSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/experience";
import { InterestsSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/interests";
import { LanguagesSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/languages";
import { ProfilesSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/profiles";
import { ProjectsSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/projects";
import { PublicationsSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/publications";
import { ReferencesSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/references";
import { SkillsSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/skills";
import { SummarySectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/summary";
import { VolunteerSectionBuilder } from "@/routes/builder/$resumeId/-sidebar/left/sections/volunteer";
import { PictureSectionEditor } from "@/editor/sections/picture";

function getSectionComponent(type: LeftSidebarSection) {
	return match(type)
		.with("picture", () => <PictureSectionEditor />)
		.with("basics", () => <BasicsSectionBuilder />)
		.with("summary", () => <SummarySectionBuilder />)
		.with("profiles", () => <ProfilesSectionBuilder />)
		.with("experience", () => <ExperienceSectionBuilder />)
		.with("education", () => <EducationSectionBuilder />)
		.with("projects", () => <ProjectsSectionBuilder />)
		.with("skills", () => <SkillsSectionBuilder />)
		.with("languages", () => <LanguagesSectionBuilder />)
		.with("interests", () => <InterestsSectionBuilder />)
		.with("awards", () => <AwardsSectionBuilder />)
		.with("certifications", () => <CertificationsSectionBuilder />)
		.with("publications", () => <PublicationsSectionBuilder />)
		.with("volunteer", () => <VolunteerSectionBuilder />)
		.with("references", () => <ReferencesSectionBuilder />)
		.with("custom", () => <CustomSectionBuilder />)
		.exhaustive();
}

export function EditorSidebarLeft() {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	return (
		<>
			<SidebarEdge scrollAreaRef={scrollAreaRef} />

			<ScrollArea ref={scrollAreaRef} className="@container h-full bg-background sm:ms-12 print:hidden">
				<div className="space-y-4 p-4">
					{leftSidebarSections.map((section) => (
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
		(section: LeftSidebarSection) => {
			if (!scrollAreaRef.current) return;
			toggleSidebar("left", true);

			const sectionElement = scrollAreaRef.current.querySelector(`#sidebar-${section}`);
			sectionElement?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
		},
		[toggleSidebar, scrollAreaRef],
	);

	return (
		<BuilderSidebarEdge side="left">
			<div />

			<div className="flex flex-col justify-center gap-y-2">
				{leftSidebarSections.map((section) => (
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
