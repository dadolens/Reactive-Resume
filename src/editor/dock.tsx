import { t } from "@lingui/core/macro";
import {
	ArrowUUpLeftIcon,
	ArrowUUpRightIcon,
	CubeFocusIcon,
	FilePdfIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	type Icon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useControls } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { useTemporalStore } from "@/components/resume/store/resume";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/style";

export function EditorDock() {
	const { zoomIn, zoomOut, centerView, resetTransform } = useControls();

	const { undo, redo, pastStates, futureStates } = useTemporalStore((state) => ({
		undo: state.undo,
		redo: state.redo,
		pastStates: state.pastStates,
		futureStates: state.futureStates,
	}));

	const canUndo = pastStates.length > 1;
	const canRedo = futureStates.length > 0;

	useHotkeys("mod+z", () => undo(), { enabled: canUndo, preventDefault: true });
	useHotkeys(["mod+y", "mod+shift+z"], () => redo(), { enabled: canRedo, preventDefault: true });

	const onPrint = useCallback(() => {
		if (typeof window === "undefined") return;
		resetTransform();
		toast.info(t`Opening print dialog...`);
		requestAnimationFrame(() => window.print());
	}, [resetTransform]);

	return (
		<div className="absolute inset-x-0 bottom-4 flex items-center justify-center print:hidden">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 0.5, y: 0 }}
				whileHover={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
				className="flex items-center rounded-r-full rounded-l-full bg-popover px-2 shadow-xl"
			>
				<DockIcon
					disabled={!canUndo}
					onClick={() => undo()}
					icon={ArrowUUpLeftIcon}
					title={t({
						context: "'Ctrl' may be replaced with the locale-specific equivalent (e.g. 'Strg' for QWERTZ layouts).",
						message: "Undo (Ctrl+Z)",
					})}
				/>
				<DockIcon
					disabled={!canRedo}
					onClick={() => redo()}
					icon={ArrowUUpRightIcon}
					title={t({
						context: "'Ctrl' may be replaced with the locale-specific equivalent (e.g. 'Strg' for QWERTZ layouts).",
						message: "Redo (Ctrl+Y)",
					})}
				/>
				<div className="mx-1 h-8 w-px bg-border" />
				<DockIcon icon={MagnifyingGlassPlusIcon} title={t`Zoom in`} onClick={() => zoomIn(0.1)} />
				<DockIcon icon={MagnifyingGlassMinusIcon} title={t`Zoom out`} onClick={() => zoomOut(0.1)} />
				<DockIcon icon={CubeFocusIcon} title={t`Center view`} onClick={() => centerView()} />
				<div className="mx-1 h-8 w-px bg-border" />
				<DockIcon icon={FilePdfIcon} title={t`Print / Save PDF`} onClick={onPrint} />
			</motion.div>
		</div>
	);
}

type DockIconProps = {
	title: string;
	icon: Icon;
	disabled?: boolean;
	onClick: () => void;
	iconClassName?: string;
};

function DockIcon({ icon: Icon, title, disabled, onClick, iconClassName }: DockIconProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button size="icon" variant="ghost" disabled={disabled} onClick={onClick}>
					<Icon className={cn("size-4", iconClassName)} />
				</Button>
			</TooltipTrigger>
			<TooltipContent side="top" align="center" className="font-medium">
				{title}
			</TooltipContent>
		</Tooltip>
	);
}
