export interface BrainDumpItem {
    id: string;
    content: string;
    createdAt: string;
}

export interface DailyGoal {
    id: string;
    content: string;
    completed: boolean;
    date: string;
}

export interface TimeboxTask {
    id: string;
    title: string;
    duration: number; // in minutes
    completed: boolean;
    startTime?: string;
    endTime?: string;
    date: string;
    subtasks?: SubTask[];
}

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

export interface ActiveTimebox {
    taskId: string;
    startTime: string;
    endTime: string;
    remainingSeconds: number;
}
