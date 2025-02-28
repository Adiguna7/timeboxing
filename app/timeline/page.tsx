'use client';

import { useState } from "react";
import { Header } from "@/components/header";
import { TimelineWithIcon } from "@/components/timeline";
import { TimelineItem, TimelineItemType} from "@/components/common";

export default function Timeline() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const timelineItems: TimelineItem[] = [
        {
            name: "test1",
            description: "brain dump",
            type: TimelineItemType.BrainDump,
            timeRange: {
                start: new Date(),
                end: new Date()
            }
        },
        {
            name: "test2",
            description: "brain dump",
            type: TimelineItemType.BrainDump,
            timeRange: {
                start: new Date(),
                end: new Date()
            }
        },
        {
            name: "test3",
            description: "brain dump",
            type: TimelineItemType.BrainDump,
            timeRange: {
                start: new Date(),
                end: new Date()
            }
        },
        {
            name: "test4",
            description: "brain dump",
            type: TimelineItemType.BrainDump,
            timeRange: {
                start: new Date(),
                end: new Date()
            }
        }
    ]

    return (
        <div className="flex min-h-screen flex-col">
            <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <main className="flex-1">     
                <div className="container mx-auto px-4 py-6 space-y-8 md:py-14 max-w-7xl">
                    <div className="flex justify-center">
                        <TimelineWithIcon timelineItems={timelineItems} />
                    </div>
                </div>
            </main>
        </div>
    );
}
