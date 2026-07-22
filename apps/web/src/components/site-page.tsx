import type { ReactNode } from "react";
import { PageFooter } from "@/components/page-footer";
import { PageHeader } from "@/components/page-header";

export function SitePage({
	children,
	decorated = false,
}: {
	children: ReactNode;
	decorated?: boolean;
}) {
	return (
		<div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-950">
			{decorated && (
				<>
					<div className="docs-grid pointer-events-none absolute inset-x-0 top-0 h-[48rem]" />
					<div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_at_top,rgba(186,230,253,0.42),transparent_58%)]" />
				</>
			)}

			<PageHeader />
			<main className="relative">{children}</main>
			<PageFooter />
		</div>
	);
}
