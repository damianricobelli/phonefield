import { Link } from "@tanstack/react-router";
import { SitePage } from "@/components/site-page";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
	return (
		<SitePage>
			{/* React hoists these into <head>; keep missing pages out of the index. */}
			<title>Page not found — PhoneField</title>
			<meta name="robots" content="noindex" />
			<section className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center sm:px-6">
				<p className="font-mono text-sm text-sky-700">404</p>
				<h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
					This page doesn&apos;t exist.
				</h1>
				<p className="mt-3 text-base leading-7 text-slate-600">
					The link may be outdated. The docs, playground, and recipes are still
					one click away.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Button render={<Link to="/" />} nativeButton={false}>
						Go home
					</Button>
					<Button
						variant="outline"
						render={<Link to="/recipes" />}
						nativeButton={false}
					>
						Browse recipes
					</Button>
				</div>
			</section>
		</SitePage>
	);
}
