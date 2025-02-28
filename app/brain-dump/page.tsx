"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { BrainDump } from "@/components/brain-dump";

export default function BrainDumpPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    return (
        <div className="flex min-h-screen flex-col">
        <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <main className="flex-1">
            <div className="container mx-auto px-4 py-6 space-y-8 md:py-14 max-w-7xl">
            <h1 className="text-3xl font-bold">Brain Dump</h1>
            <p className="text-muted-foreground">
                Capture your thoughts, ideas, and tasks without worrying about organization.
                Clear your mind and focus on what matters.
            </p>

            <div className="grid gap-6">
                <BrainDump />
            </div>
            </div>
        </main>
        </div>
    );
}
