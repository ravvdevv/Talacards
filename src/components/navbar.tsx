import { ModeToggle } from "./mode-toggle"
import { BookOpen, Github } from "lucide-react"
import { Button } from "./ui/button"

export function Navbar() {
	return (
		<header
			className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
			aria-label="Main navigation"
		>
			<div className="container flex h-16 items-center justify-between px-4">
				<a
					href="/"
					className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
					aria-label="Talacards home"
				>
					<BookOpen className="h-6 w-6 text-primary" />
					<span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						Talacards
					</span>
				</a>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" asChild>
						<a
							href="https://github.com/ravvdevv/talacards"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span className="flex items-center gap-1.5">
								<Github className="h-4 w-4" aria-hidden="true" />
							</span>
						</a>
					</Button>
					<ModeToggle />
				</div>
			</div>
		</header>
	)
}