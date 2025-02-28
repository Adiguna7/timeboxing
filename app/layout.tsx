import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'TimeBoxing - Manage Your Time Effectively',
    description: 'A timeboxing app to help you manage your time, set goals, and organize your thoughts.',
    icons: '/clock.svg'
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <Analytics/>
            <body className={inter.className}>
                <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                >
                    {children}
                <Toaster />
                </ThemeProvider>
                <footer className='text-center text-gray-500 text-sm mt-16 pb-10'>
                © {new Date().getFullYear()} Timeboxing Platform. All rights reserved.
                </footer>
            </body>            
        </html>
    );
}
