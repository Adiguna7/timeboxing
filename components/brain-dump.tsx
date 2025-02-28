"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { BrainDumpItem } from "@/lib/types";
import { getBrainDumpItems, saveBrainDumpItem, deleteBrainDumpItem } from "@/lib/storage";
import { generateId, getCurrentTime } from "@/lib/utils";

export function BrainDump() {
  const [items, setItems] = useState<BrainDumpItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setItems(getBrainDumpItems());
  }, []);

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    const item: BrainDumpItem = {
      id: generateId(),
      content: newItem,
      createdAt: getCurrentTime(),
    };

    saveBrainDumpItem(item);
    setItems([...items, item]);
    setNewItem("");

    toast({
      title: "Thought captured!",
      description: "Your brain dump item has been saved.",
    });
  };

  const handleDeleteItem = (id: string) => {
    deleteBrainDumpItem(id);
    setItems(items.filter((item) => item.id !== id));

    toast({
      title: "Item deleted",
      description: "Your brain dump item has been removed.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Brain Dump</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Dump your thoughts here..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddItem}>Capture Thought</Button>
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No thoughts captured yet. Start dumping your ideas above!
                </p>
              ) : (
                items
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border p-3 text-card-foreground shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(item.createdAt), "PPP p")}
                          </p>
                          <p className="whitespace-pre-wrap">{item.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
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