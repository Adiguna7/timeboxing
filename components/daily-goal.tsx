"use client";

import { useState, useEffect } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DailyGoal } from "@/lib/types";
import { getDailyGoals, saveDailyGoal, updateDailyGoal, deleteDailyGoal } from "@/lib/storage";
import { generateId, formatDate } from "@/lib/utils";

export function DailyGoalComponent({ selectedDate }: { selectedDate: Date }) {
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const { toast } = useToast();
  const formattedDate = formatDate(selectedDate);

  useEffect(() => {
    setGoals(getDailyGoals(formattedDate));
  }, [formattedDate]);

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;

    // Only allow one main goal per day
    if (goals.length >= 1) {
      toast({
        title: "Limit reached",
        description: "You can only set one main goal per day.",
        variant: "destructive",
      });
      return;
    }

    const goal: DailyGoal = {
      id: generateId(),
      content: newGoal,
      completed: false,
      date: formattedDate,
    };

    saveDailyGoal(goal);
    setGoals([...goals, goal]);
    setNewGoal("");

    toast({
      title: "Goal set!",
      description: "Your main goal for the day has been set.",
    });
  };

  const handleToggleGoal = (goal: DailyGoal) => {
    const updatedGoal = { ...goal, completed: !goal.completed };
    updateDailyGoal(updatedGoal);
    
    setGoals(
      goals.map((g) => (g.id === goal.id ? updatedGoal : g))
    );

    toast({
      title: updatedGoal.completed ? "Goal completed!" : "Goal reopened",
      description: updatedGoal.completed
        ? "Congratulations on completing your main goal!"
        : "You can work on your goal again.",
    });
  };

  const handleDeleteGoal = (goal: DailyGoal) => {
    deleteDailyGoal(goal);
    setGoals(goals.filter((g) => g.id !== goal.id));

    toast({
      title: "Goal deleted",
      description: "Your goal has been removed.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Main Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="space-y-2">
              <Input
                placeholder="What's your main goal for today?"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
              />
              <Button onClick={handleAddGoal} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Set Main Goal
              </Button>
            </div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between space-x-2 rounded-lg border p-4"
              >
                <div className="flex items-center space-x-3">
                  <Button
                    variant={goal.completed ? "default" : "outline"}
                    size="icon"
                    onClick={() => handleToggleGoal(goal)}
                    className={goal.completed ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">
                      {goal.completed ? "Mark as incomplete" : "Mark as complete"}
                    </span>
                  </Button>
                  <span className={goal.completed ? "line-through text-muted-foreground" : ""}>
                    {goal.content}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteGoal(goal)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}