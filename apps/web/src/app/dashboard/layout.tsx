import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-pulse-bg text-gray-100 font-display">
      <nav className="border-b border-pulse-border bg-pulse-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pulse-green animate-ping-slow"></div>
                CodePulse
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/dashboard"
                  className="text-pulse-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="bg-pulse-surface text-white px-3 py-2 rounded-md text-sm font-medium border border-pulse-border transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-pulse-border"
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
