"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
// import { buttonVariants } from "@/components/ui/button"

export function Header({ selectedDate, setSelectedDate }: {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between max-w-7xl">
            <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                    >
                    <Clock className="h-5 w-5" />
                    <span>TimeBoxing</span>
                    </Link>
                    <Link
                    href="/dashboard"
                    className="hover:text-foreground/80 transition-colors"
                    >
                    Dashboard
                    </Link>
                    <Link
                    href="/brain-dump"
                    className="hover:text-foreground/80 transition-colors"
                    >
                    Brain Dump
                    </Link>
                    <Link
                    href="/completed-timeboxes"
                    className="hover:text-foreground/80 transition-colors"
                    >
                    Completed Timeboxes
                    </Link>
                </nav>
                </SheetContent>
            </Sheet>
            <Link
                href="/"
                className="hidden md:flex items-center gap-2 text-lg font-semibold"
            >
                <Clock className="h-5 w-5" />
                <span>TimeBoxing</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
                <Link
                href="/dashboard"
                className="hover:text-foreground/80 transition-colors"
                >
                Dashboard
                </Link>
                <Link
                href="/brain-dump"
                className="hover:text-foreground/80 transition-colors"
                >
                Brain Dump
                </Link>
                <Link
                href="/completed-timeboxes"
                className="hover:text-foreground/80 transition-colors"
                >
                Completed Timeboxes
                </Link>
            </nav>
            </div>
            <div className="flex items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                    "justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                    if (date) {
                        setSelectedDate(date);
                        setIsOpen(false);
                    }
                    }}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            <ThemeToggle />
            {/* <Link className={buttonVariants({ variant: "outline" })} href="/login">Login with Google</Link> */}
            </div>
        </div>
        </header>
    );
}
