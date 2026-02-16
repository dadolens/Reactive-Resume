import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { useResumeStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { useBuilderSidebar } from "@/routes/builder/$resumeId/-store/sidebar";

import { useIsMobile } from "@/hooks/use-mobile";

export function EditorHeader({ onOpenLeftSidebar, onOpenRightSidebar }: {
	onOpenLeftSidebar?: () => void,
	onOpenRightSidebar?: () => void,
}) {
	const name = useResumeStore((state) => state.resume.data.basics.name || "Untitled Resume");
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);
	const isMobile = useIsMobile();

	return (
		<div className="z-10 flex h-14 items-center justify-between border-b bg-popover px-1.5 print:hidden">
			<Button size="icon" variant="ghost" onClick={() => isMobile && onOpenLeftSidebar ? onOpenLeftSidebar() : toggleSidebar("left")}>
				<SidebarSimpleIcon />
			</Button>

			<div className="flex items-center gap-x-2">
				<h2 className="max-w-[60vw] truncate font-medium">{name}</h2>
			</div>

			<Button size="icon" variant="ghost" onClick={() => isMobile && onOpenRightSidebar ? onOpenRightSidebar() : toggleSidebar("right")}>
				<SidebarSimpleIcon className="-scale-x-100" />
			</Button>
		</div>
	);
}
