'use client';

import { Info, BookOpen, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { useState } from 'react';

export default function Home() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    return (
        <div className="flex min-h-screen flex-col">
            <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-6 space-y-8 md:py-14 max-w-7xl">
                    <section className='text-center'>
                        <h1 className='text-3xl font-extrabold'>Timeboxing Productivity Method</h1>
                        <p className='text-sm text-gray-600 mt-4'>Master your time, enhance your focus, and achieve more.</p>
                    </section>

                    <Card>
                        <CardHeader>
                        <div className='flex items-center space-x-4'>
                            <Info size={24} />
                            <CardTitle>What is Timeboxing?</CardTitle>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <p className='text-md'>
                            Timeboxing is a productivity technique where you allocate fixed time
                            periods to specific tasks, enhancing focus and efficiency. By
                            dedicating set blocks of time to individual activities, you minimize
                            distractions and manage your workload more effectively.
                        </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                        <div className='flex items-center space-x-4'>
                            <BookOpen size={24} />
                            <CardTitle>Research Findings</CardTitle>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <p className='text-md'>
                            Research from Harvard Business Review shows that timeboxing can
                            significantly boost productivity. Professionals who implement this
                            method often accomplish more tasks within the same timeframe compared
                            to traditional work approaches.
                        </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                        <div className='flex items-center space-x-4'>
                            <CheckCircle size={24} />
                            <CardTitle>How to Use Timeboxing</CardTitle>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <ul className='list-disc pl-5 space-y-2 text-md'>
                            <li>Set clear goals for each task.</li>
                            <li>Break down larger projects into manageable tasks.</li>
                            <li>Assign specific time slots for each task. (This platform helps you track timeboxes and stay aware of time with its timer).</li>
                            <li>Minimize interruptions by silencing notifications.</li>
                            <li>Take regular breaks between time blocks.</li>
                            <li>Review your progress and adjust your plan for continuous improvement.</li>
                        </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
