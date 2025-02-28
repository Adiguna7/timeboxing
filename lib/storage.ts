"use client";

import { BrainDumpItem, DailyGoal, TimeboxTask, ActiveTimebox } from "./types";

// Brain Dump Storage
export const getBrainDumpItems = (): BrainDumpItem[] => {
    if (typeof window === "undefined") return [];

    const items = localStorage.getItem("brainDumpItems");
    return items ? JSON.parse(items) : [];
};

export const saveBrainDumpItem = (item: BrainDumpItem): void => {
    const items = getBrainDumpItems();
    localStorage.setItem("brainDumpItems", JSON.stringify([...items, item]));
};

export const deleteBrainDumpItem = (id: string): void => {
    const items = getBrainDumpItems();
    localStorage.setItem(
        "brainDumpItems",
        JSON.stringify(items.filter((item) => item.id !== id))
    );
};

// Daily Goals Storage
export const getDailyGoals = (date: string): DailyGoal[] => {
    if (typeof window === "undefined") return [];

    const goals = localStorage.getItem(`dailyGoals-${date}`);
    return goals ? JSON.parse(goals) : [];
};

export const saveDailyGoal = (goal: DailyGoal): void => {
    const goals = getDailyGoals(goal.date);
    localStorage.setItem(
        `dailyGoals-${goal.date}`,
        JSON.stringify([...goals, goal])
    );
};

export const updateDailyGoal = (goal: DailyGoal): void => {
    const goals = getDailyGoals(goal.date);
    const updatedGoals = goals.map((g) => (g.id === goal.id ? goal : g));
    localStorage.setItem(`dailyGoals-${goal.date}`, JSON.stringify(updatedGoals));
};

export const deleteDailyGoal = (goal: DailyGoal): void => {
    const goals = getDailyGoals(goal.date);
    localStorage.setItem(
        `dailyGoals-${goal.date}`,
        JSON.stringify(goals.filter((g) => g.id !== goal.id))
    );
};

// Timebox Tasks Storage
export const getTimeboxTasks = (date: string): TimeboxTask[] => {
    if (typeof window === "undefined") return [];

    const tasks = localStorage.getItem(`timeboxTasks-${date}`);
    return tasks ? JSON.parse(tasks) : [];
};

export const saveTimeboxTask = (task: TimeboxTask): void => {
    const tasks = getTimeboxTasks(task.date);
    localStorage.setItem(
        `timeboxTasks-${task.date}`,
        JSON.stringify([...tasks, task])
    );
};

export const updateTimeboxTask = (task: TimeboxTask): void => {
    const tasks = getTimeboxTasks(task.date);
    const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
    localStorage.setItem(`timeboxTasks-${task.date}`, JSON.stringify(updatedTasks));
};

export const deleteTimeboxTask = (task: TimeboxTask): void => {
    const tasks = getTimeboxTasks(task.date);
    localStorage.setItem(
        `timeboxTasks-${task.date}`,
        JSON.stringify(tasks.filter((t) => t.id !== task.id))
    );
};

// Active Timebox Storage
export const getActiveTimebox = (): ActiveTimebox | null => {
    if (typeof window === "undefined") return null;

    const activeTimebox = localStorage.getItem("activeTimebox");
    return activeTimebox ? JSON.parse(activeTimebox) : null;
};

export const saveActiveTimebox = (timebox: ActiveTimebox): void => {
    localStorage.setItem("activeTimebox", JSON.stringify(timebox));
};

export const clearActiveTimebox = (): void => {
    localStorage.removeItem("activeTimebox");
};

// Completed Timeboxes History
export const getCompletedTimeboxes = (): TimeboxTask[] => {
    if (typeof window === "undefined") return [];

    const completedTimeboxes = localStorage.getItem("completedTimeboxes");
    return completedTimeboxes ? JSON.parse(completedTimeboxes) : [];
};

export const saveCompletedTimebox = (task: TimeboxTask): void => {
    const completedTimeboxes = getCompletedTimeboxes();
    localStorage.setItem(
        "completedTimeboxes",
        JSON.stringify([...completedTimeboxes, task])
    );
};
