"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	// Toggle from what is actually shown, so "system" users get a visible change on first click.
	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			className="relative rounded-full"
			onClick={toggleTheme}
			aria-label="Toggle theme"
		>
			<Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button>
	);
}
