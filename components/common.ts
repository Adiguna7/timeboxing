import { Brain, ListCheck, Goal } from "lucide-react";

export enum TimelineItemType {
    BrainDump,
    CreateTask,
    StartTask,
    CompleteTask,
    CreateDailyGoal,
    CompleteDailyGoal
};

type TimeRange = {
    start: Date,
    end: Date
};

export const iconMapping = {
    [TimelineItemType.BrainDump]:  Brain,
    [TimelineItemType.CreateTask]: ListCheck,
    [TimelineItemType.StartTask]: ListCheck,
    [TimelineItemType.CompleteTask]: ListCheck,
    [TimelineItemType.CreateDailyGoal]: Goal,
    [TimelineItemType.CompleteDailyGoal]: Goal
}

export interface TimelineItem{
    name: string;
    description: string;
    type: TimelineItemType;
    timeRange: TimeRange;
};
