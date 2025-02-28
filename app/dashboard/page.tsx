"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { DailyGoalComponent } from "@/components/daily-goal";
import { TimeboxTasks } from "@/components/timebox-tasks";

export default function Dashboard() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    return (
        <div className="flex min-h-screen flex-col">
            <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <main className="flex-1">
            <div className="container mx-auto px-4 py-6 space-y-8 md:py-14 max-w-7xl">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                    <DailyGoalComponent selectedDate={selectedDate} />
                    <TimeboxTasks selectedDate={selectedDate} />
                </div>
            </div>
            </main>
        </div>
    );
}
