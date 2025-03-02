"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Check, Clock, Pause, Play, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TimeboxTask, SubTask, ActiveTimebox } from "@/lib/types";
import {
    getTimeboxTasks,
    saveTimeboxTask,
    updateTimeboxTask,
    deleteTimeboxTask,
    getActiveTimebox,
    saveActiveTimebox,
    clearActiveTimebox,
    saveCompletedTimebox
} from "@/lib/storage";
import { generateId, formatDate, formatTimeDisplay, getCurrentTime, sendNotification, playSound } from "@/lib/utils";


enum State {
    Completed,
    TimesUp
}

export function TimeboxTasks({ selectedDate }: { selectedDate: Date }) {
    const [tasks, setTasks] = useState<TimeboxTask[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDuration, setNewTaskDuration] = useState(25);
    const [activeTimebox, setActiveTimebox] = useState<ActiveTimebox | null>(null);
    const [newSubtask, setNewSubtask] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();
    const formattedDate = formatDate(selectedDate);

    useEffect(() => {
        setTasks(getTimeboxTasks(formattedDate));
        const active = getActiveTimebox();
        if (active) {
            setActiveTimebox(active);
        }
    }, [formattedDate]);

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        if (activeTimebox) {
            timerRef.current = setInterval(() => {
                setActiveTimebox(prev => {
                    if (!prev) return null;

                    const newRemainingSeconds = prev.remainingSeconds - 1;

                    if (newRemainingSeconds <= 0) {
                        clearInterval(timerRef.current!);
                        handleCompleteTimebox();
                        return null;
                    }

                    const updatedTimebox = {
                        ...prev,
                        remainingSeconds: newRemainingSeconds
                    };

                    saveActiveTimebox(updatedTimebox);
                    return updatedTimebox;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [activeTimebox]);

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;

        const task: TimeboxTask = {
            id: generateId(),
            title: newTaskTitle,
            duration: newTaskDuration,
            completed: false,
            date: formattedDate,
            subtasks: []
        };

        saveTimeboxTask(task);
        setTasks([...tasks, task]);
        setNewTaskTitle("");
        setNewTaskDuration(25);

        toast({
            title: "Task added!",
            description: `Added "${newTaskTitle}" with a ${formatTimeDisplay(newTaskDuration)} timebox.`,
        });
    };

    const handleStartTask = (task: TimeboxTask) => {
        if (activeTimebox) {
            toast({
                title: "Task already in progress",
                description: "Please complete or cancel the current task before starting a new one.",
                variant: "destructive"
            });
            return;
        }

        const now = getCurrentTime();
        const updatedTask = {
            ...task,
            startTime: now,
        };

        updateTimeboxTask(updatedTask);

        const newActiveTimebox: ActiveTimebox = {
            taskId: task.id,
            startTime: now,
            endTime: "",
            remainingSeconds: task.duration * 60
        };

        saveActiveTimebox(newActiveTimebox);
        setActiveTimebox(newActiveTimebox);
        setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));

        toast({
            title: "Task started!",
            description: `Started working on "${task.title}".`,
        });
    };

    const handlePauseTimebox = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;

            toast({
                title: "Timer paused",
                description: "You can resume the timer when you're ready to continue.",
            });
        }
    };

    const handleResumeTimebox = () => {
        if (!activeTimebox) return;

        timerRef.current = setInterval(() => {
        setActiveTimebox(prev => {
            if (!prev) return null;

            const newRemainingSeconds = prev.remainingSeconds - 1;

            if (newRemainingSeconds <= 0) {
                clearInterval(timerRef.current!);
                handleCompleteTimebox();
                return null;
            }

            const updatedTimebox = {
            ...prev,
            remainingSeconds: newRemainingSeconds
            };

            saveActiveTimebox(updatedTimebox);
            return updatedTimebox;
        });
        }, 1000);

        toast({
            title: "Timer resumed",
            description: "Keep focusing on your task!",
        });
    };

    const handleCancelTimebox = () => {
        if (!activeTimebox) return;

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        clearActiveTimebox();
        setActiveTimebox(null);

        toast({
            title: "Timer cancelled",
            description: "You can restart the timer when you're ready.",
        });
    };

    const handleCompleteTimebox = (state: State=State.TimesUp) => {
        if (!activeTimebox) return;

        const task = tasks.find(t => t.id === activeTimebox.taskId);
        if (!task) return;

        const now = getCurrentTime();
        const updatedTask = {
            ...task,
            completed: true,
            endTime: now
        };

        updateTimeboxTask(updatedTask);
        saveCompletedTimebox(updatedTask);

        setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));

        clearActiveTimebox();
        setActiveTimebox(null);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        toast({
            title: "Task completed!",
            description: `Completed "${task.title}".`,
        });

        if (state === State.Completed) {
            sendNotification(
                {
                    title: `✅ Timebox ${task.title} Completed!`,
                    body: `Task finished — review your progress and plan ahead.`,
                    icon: '/check.svg'
                }
            )
        } else {
            sendNotification(
                {
                    title: `⏰ Time’s Up! ${task.title}`,
                    body: `Great job staying focused — ready for the next task?`,
                    icon: '/clock.svg'
                }
            )
            playSound('/classic_alarm.mp3');
        }
    };

    const handleDeleteTask = (task: TimeboxTask) => {
        if (activeTimebox && activeTimebox.taskId === task.id) {
            toast({
                title: "Cannot delete active task",
                description: "Please complete or cancel the current task before deleting it.",
                variant: "destructive"
            });
            return;
        }

        deleteTimeboxTask(task);
        setTasks(tasks.filter((t) => t.id !== task.id));

        toast({
            title: "Task deleted",
            description: `Removed "${task.title}" from your timeboxes.`,
        });
    };

    const handleAddSubtask = (taskId: string) => {
        if (!newSubtask.trim()) return;

        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const subtask: SubTask = {
            id: generateId(),
            title: newSubtask,
            completed: false
        };

        const updatedTask = {
            ...task,
            subtasks: [...(task.subtasks || []), subtask]
        };

        updateTimeboxTask(updatedTask);
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        setNewSubtask("");

        toast({
            title: "Subtask added",
            description: `Added "${newSubtask}" to "${task.title}".`,
        });
    };

    const handleToggleSubtask = (taskId: string, subtaskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.subtasks) return;

        const updatedSubtasks = task.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );

        const updatedTask = {
            ...task,
            subtasks: updatedSubtasks
        };

        updateTimeboxTask(updatedTask);
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    };

    const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.subtasks) return;

        const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);

        const updatedTask = {
            ...task,
            subtasks: updatedSubtasks
        };

        updateTimeboxTask(updatedTask);
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));

        toast({
            title: "Subtask deleted",
            description: "Subtask has been removed.",
        });
    };

    const getTotalTime = () => {
        return tasks.reduce((total, task) => total + task.duration, 0);
    };

    const getCompletedTime = () => {
        return tasks
        .filter((task) => task.completed)
        .reduce((total, task) => total + task.duration, 0);
    };

    const getProgressPercentage = () => {
        const total = getTotalTime();
        if (total === 0) return 0;
        return Math.round((getCompletedTime() / total) * 100);
    };

    const formatTimeLeft = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getActiveTask = () => {
        if (!activeTimebox) return null;
        return tasks.find(task => task.id === activeTimebox.taskId);
    };

    return (
        <Card className="w-full">
        <CardHeader>
            <CardTitle>Timeboxed Tasks</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
            {activeTimebox && (
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Current Timebox</h3>
                    <div className="text-2xl font-bold">
                        {formatTimeLeft(activeTimebox.remainingSeconds)}
                    </div>
                    </div>

                    <div className="space-y-2">
                    <p className="font-medium">{getActiveTask()?.title}</p>
                    <Progress
                        value={100 - (activeTimebox.remainingSeconds / (getActiveTask()?.duration || 1) / 60 * 100)}
                        className="h-2"
                    />
                    </div>

                    <div className="flex space-x-2">
                    {timerRef.current ? (
                        <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handlePauseTimebox}
                        >
                        <Pause className="mr-2 h-3 w-3" /> Pause
                        </Button>
                    ) : (
                        <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleResumeTimebox}
                        >
                        <Play className="mr-2 h-3 w-3" /> Resume
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleCancelTimebox}
                    >
                        <X className="mr-2 h-3 w-3" /> Cancel
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCompleteTimebox(State.Completed)}
                    >
                        <Check className="mr-2 h-3 w-3" /> Complete
                    </Button>
                    </div>
                </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                <Input
                    placeholder="What task do you want to timebox?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Slider
                    value={[newTaskDuration]}
                    min={5}
                    max={120}
                    step={5}
                    onValueChange={(value) => setNewTaskDuration(value[0])}
                    className="flex-1"
                    />
                    <span className="min-w-[60px] text-sm">
                    {formatTimeDisplay(newTaskDuration)}
                    </span>
                </div>
                </div>
                <Button onClick={handleAddTask} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Timebox
                </Button>
            </div>

            {tasks.length > 0 && (
                <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Progress: {getProgressPercentage()}%</span>
                    <span>
                    {getCompletedTime()}/{getTotalTime()} minutes
                    </span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
                </div>
            )}

            <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                {tasks.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                    No timeboxed tasks yet. Add your first task above!
                    </p>
                ) : (
                    tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`rounded-lg border p-4 ${
                        task.completed ? "bg-muted/50" : ""
                        } ${activeTimebox?.taskId === task.id ? "border-primary" : ""}`}
                    >
                        <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                            <span
                            className={`font-medium ${
                                task.completed ? "line-through text-muted-foreground" : ""
                            }`}
                            >
                            {task.title}
                            </span>
                            <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">
                                {formatTimeDisplay(task.duration)}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task)}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                            </div>
                        </div>

                        {task.startTime && !task.completed && (
                            <p className="text-xs text-muted-foreground">
                            Started at {format(new Date(task.startTime), "p")}
                            </p>
                        )}

                        {task.completed && task.startTime && task.endTime && (
                            <p className="text-xs text-muted-foreground">
                            Completed: {format(new Date(task.startTime), "p")} - {format(new Date(task.endTime), "p")}
                            </p>
                        )}

                        {/* Subtasks section */}
                        {selectedTaskId === task.id && (
                            <div className="mt-2 space-y-2 pl-4 border-l-2 border-muted">
                            <div className="flex space-x-2">
                                <Input
                                placeholder="Add a subtask"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                className="flex-1"
                                // size="sm"
                                />
                                <Button
                                size="sm"
                                onClick={() => handleAddSubtask(task.id)}
                                >
                                Add
                                </Button>
                            </div>

                            <div className="space-y-2 mt-2">
                                {task.subtasks && task.subtasks.length > 0 ? (
                                task.subtasks.map(subtask => (
                                    <div key={subtask.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                        id={subtask.id}
                                        checked={subtask.completed}
                                        onCheckedChange={() => handleToggleSubtask(task.id, subtask.id)}
                                        />
                                        <Label
                                        htmlFor={subtask.id}
                                        className={subtask.completed ? "line-through text-muted-foreground" : ""}
                                        >
                                        {subtask.title}
                                        </Label>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteSubtask(task.id, subtask.id)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                    </div>
                                ))
                                ) : (
                                <p className="text-xs text-muted-foreground">No subtasks yet</p>
                                )}
                            </div>
                            </div>
                        )}

                        <div className="flex space-x-2">
                            {!task.startTime && !task.completed && !activeTimebox && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleStartTask(task)}
                            >
                                <Play className="mr-2 h-3 w-3" /> Start
                            </Button>
                            )}

                            <Button
                            variant={selectedTaskId === task.id ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                            >
                            {selectedTaskId === task.id ? "Hide Subtasks" : "Manage Subtasks"}
                            </Button>
                        </div>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </ScrollArea>
            </div>
        </CardContent>
        </Card>
    );
}
