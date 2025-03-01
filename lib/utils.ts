import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

export function formatTimeDisplay(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }

    return `${mins}m`;
}

export function getCurrentTime(): string {
    return new Date().toISOString();
}

export const sendNotification = ({
    title,
    body,
    icon
}: {
    title: string;
    body: string;
    icon: string;
}) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
    }

    new Notification(
        title, {
            body,
            icon
        }
    )
}
