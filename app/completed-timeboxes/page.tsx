"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeboxTask } from "@/lib/types";
import { getCompletedTimeboxes } from "@/lib/storage";
import { formatTimeDisplay } from "@/lib/utils";

export default function CompletedTimeboxesPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [completedTimeboxes, setCompletedTimeboxes] = useState<TimeboxTask[]>([]);

    useEffect(() => {
        setCompletedTimeboxes(getCompletedTimeboxes());
    }, []);

    // Group timeboxes by date
    const groupedTimeboxes = completedTimeboxes.reduce((groups, task) => {
        const date = task.date;
        if (!groups[date]) {
        groups[date] = [];
        }
        groups[date].push(task);
        return groups;
    }, {} as Record<string, TimeboxTask[]>);

    // Sort dates in descending order
    const sortedDates = Object.keys(groupedTimeboxes).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    return (
        <div className="flex min-h-screen flex-col">
        <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <main className="flex-1">
            <div className="container mx-auto px-4 py-6 space-y-8 md:py-14 max-w-7xl">
            <h1 className="text-3xl font-bold">Completed Timeboxes</h1>
            <p className="text-muted-foreground">
                Review your completed timeboxes and track your productivity over time.
            </p>

            <div className="grid gap-6">
                <Card className="w-full">
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedDates.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No completed timeboxes yet. Start timeboxing your tasks to see your history here!
                    </p>
                    ) : (
                    <ScrollArea className="h-[600px]">
                        <div className="space-y-8">
                        {sortedDates.map(date => (
                            <div key={date} className="space-y-4">
                            <h3 className="text-lg font-semibold sticky top-0 bg-background py-2 border-b">
                                {format(new Date(date), "PPPP")}
                            </h3>
                            <div className="space-y-3 pl-4">
                                {groupedTimeboxes[date].map(task => (
                                <div key={task.id} className="border rounded-md p-4">
                                    <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{task.title}</h4>
                                        {task.subtasks && task.subtasks.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Subtasks:</p>
                                            <ul className="text-sm pl-4 space-y-1">
                                            {task.subtasks.map(subtask => (
                                                <li key={subtask.id} className={subtask.completed ? "line-through" : ""}>
                                                {subtask.title}
                                                </li>
                                            ))}
                                            </ul>
                                        </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium">
                                        {formatTimeDisplay(task.duration)}
                                    </span>
                                    </div>
                                    {task.startTime && task.endTime && (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {format(new Date(task.startTime), "p")} - {format(new Date(task.endTime), "p")}
                                    </div>
                                    )}
                                </div>
                                ))}
                            </div>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                    )}
                </CardContent>
                </Card>
            </div>
            </div>
        </main>
        </div>
    );
}
