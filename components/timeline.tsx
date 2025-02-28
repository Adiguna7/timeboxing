'use client';

import { TimelineItem as TimelineItemInterface, iconMapping } from "./common";

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

export function TimelineWithIcon({timelineItems}: {timelineItems: TimelineItemInterface[]}) {
    return (
        <Timeline>
            {timelineItems.map((item, index) => {            
                const Icon = iconMapping[item.type]; // Get the right icon component
                return (
                    <TimelineItem key={index}>
                        <TimelineSeparator>
                            <TimelineDot>
                                <Icon/>
                            </TimelineDot>
                            {
                                index !== timelineItems.length - 1 && (
                                    <TimelineConnector />
                                )
                            }
                        </TimelineSeparator>
                        <TimelineContent>
                            <TimelineTitle>{item.name}</TimelineTitle>
                            <TimelineDescription>{item.description}</TimelineDescription>
                        </TimelineContent>
                    </TimelineItem>
                )
            })}
        </Timeline>
    )
}
