import { match } from "ts-pattern";
import { Dialog } from "@/components/ui/dialog";
import { CreateAwardDialog, UpdateAwardDialog } from "@/dialogs/resume/sections/award";
import { CreateCertificationDialog, UpdateCertificationDialog } from "@/dialogs/resume/sections/certification";
import { CreateCoverLetterDialog, UpdateCoverLetterDialog } from "@/dialogs/resume/sections/cover-letter";
import { CreateCustomSectionDialog, UpdateCustomSectionDialog } from "@/dialogs/resume/sections/custom";
import { CreateEducationDialog, UpdateEducationDialog } from "@/dialogs/resume/sections/education";
import { CreateExperienceDialog, UpdateExperienceDialog } from "@/dialogs/resume/sections/experience";
import { CreateInterestDialog, UpdateInterestDialog } from "@/dialogs/resume/sections/interest";
import { CreateLanguageDialog, UpdateLanguageDialog } from "@/dialogs/resume/sections/language";
import { CreateProfileDialog, UpdateProfileDialog } from "@/dialogs/resume/sections/profile";
import { CreateProjectDialog, UpdateProjectDialog } from "@/dialogs/resume/sections/project";
import { CreatePublicationDialog, UpdatePublicationDialog } from "@/dialogs/resume/sections/publication";
import { CreateReferenceDialog, UpdateReferenceDialog } from "@/dialogs/resume/sections/reference";
import { CreateSkillDialog, UpdateSkillDialog } from "@/dialogs/resume/sections/skill";
import { CreateSummaryItemDialog, UpdateSummaryItemDialog } from "@/dialogs/resume/sections/summary-item";
import { CreateVolunteerDialog, UpdateVolunteerDialog } from "@/dialogs/resume/sections/volunteer";
import { TemplateGalleryDialog } from "@/dialogs/resume/template/gallery";
import { useDialogStore } from "@/dialogs/store";

export function EditorDialogManager() {
	const { open, activeDialog, onOpenChange } = useDialogStore();

	const dialogContent = match(activeDialog)
		.with({ type: "resume.template.gallery" }, () => <TemplateGalleryDialog />)
		.with({ type: "resume.sections.profiles.create" }, ({ data }) => <CreateProfileDialog data={data} />)
		.with({ type: "resume.sections.profiles.update" }, ({ data }) => <UpdateProfileDialog data={data} />)
		.with({ type: "resume.sections.experience.create" }, ({ data }) => <CreateExperienceDialog data={data} />)
		.with({ type: "resume.sections.experience.update" }, ({ data }) => <UpdateExperienceDialog data={data} />)
		.with({ type: "resume.sections.education.create" }, ({ data }) => <CreateEducationDialog data={data} />)
		.with({ type: "resume.sections.education.update" }, ({ data }) => <UpdateEducationDialog data={data} />)
		.with({ type: "resume.sections.skills.create" }, ({ data }) => <CreateSkillDialog data={data} />)
		.with({ type: "resume.sections.skills.update" }, ({ data }) => <UpdateSkillDialog data={data} />)
		.with({ type: "resume.sections.projects.create" }, ({ data }) => <CreateProjectDialog data={data} />)
		.with({ type: "resume.sections.projects.update" }, ({ data }) => <UpdateProjectDialog data={data} />)
		.with({ type: "resume.sections.certifications.create" }, ({ data }) => <CreateCertificationDialog data={data} />)
		.with({ type: "resume.sections.certifications.update" }, ({ data }) => <UpdateCertificationDialog data={data} />)
		.with({ type: "resume.sections.languages.create" }, ({ data }) => <CreateLanguageDialog data={data} />)
		.with({ type: "resume.sections.languages.update" }, ({ data }) => <UpdateLanguageDialog data={data} />)
		.with({ type: "resume.sections.publications.create" }, ({ data }) => <CreatePublicationDialog data={data} />)
		.with({ type: "resume.sections.publications.update" }, ({ data }) => <UpdatePublicationDialog data={data} />)
		.with({ type: "resume.sections.awards.create" }, ({ data }) => <CreateAwardDialog data={data} />)
		.with({ type: "resume.sections.awards.update" }, ({ data }) => <UpdateAwardDialog data={data} />)
		.with({ type: "resume.sections.interests.create" }, ({ data }) => <CreateInterestDialog data={data} />)
		.with({ type: "resume.sections.interests.update" }, ({ data }) => <UpdateInterestDialog data={data} />)
		.with({ type: "resume.sections.volunteer.create" }, ({ data }) => <CreateVolunteerDialog data={data} />)
		.with({ type: "resume.sections.volunteer.update" }, ({ data }) => <UpdateVolunteerDialog data={data} />)
		.with({ type: "resume.sections.references.create" }, ({ data }) => <CreateReferenceDialog data={data} />)
		.with({ type: "resume.sections.references.update" }, ({ data }) => <UpdateReferenceDialog data={data} />)
		.with({ type: "resume.sections.summary.create" }, ({ data }) => <CreateSummaryItemDialog data={data} />)
		.with({ type: "resume.sections.summary.update" }, ({ data }) => <UpdateSummaryItemDialog data={data} />)
		.with({ type: "resume.sections.cover-letter.create" }, ({ data }) => <CreateCoverLetterDialog data={data} />)
		.with({ type: "resume.sections.cover-letter.update" }, ({ data }) => <UpdateCoverLetterDialog data={data} />)
		.with({ type: "resume.sections.custom.create" }, ({ data }) => <CreateCustomSectionDialog data={data} />)
		.with({ type: "resume.sections.custom.update" }, ({ data }) => <UpdateCustomSectionDialog data={data} />)
		.otherwise(() => null);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{dialogContent}
		</Dialog>
	);
}
