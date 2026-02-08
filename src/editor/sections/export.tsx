import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { FilePdfIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionBase } from "@/routes/builder/$resumeId/-sidebar/right/shared/section-base";

export function ExportSectionEditor() {
	const onPrint = () => {
		if (typeof window === "undefined") return;
		toast.info(t`Opening print dialog...`);
		window.print();
	};

	return (
		<SectionBase type="export" className="space-y-4">
			<Button
				variant="outline"
				onClick={onPrint}
				className="h-auto gap-x-4 whitespace-normal p-4! text-start font-normal active:scale-98"
			>
				<FilePdfIcon className="size-6 shrink-0" />
				<div className="flex flex-1 flex-col gap-y-1">
					<h6 className="font-medium">PDF</h6>
					<p className="text-muted-foreground text-xs leading-normal">
						<Trans>Print your resume or save it as a PDF from the browser print dialog.</Trans>
					</p>
				</div>
			</Button>
		</SectionBase>
	);
}
