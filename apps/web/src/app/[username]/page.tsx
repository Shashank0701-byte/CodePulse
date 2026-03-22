import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  return {
    title: `CodePulse | @${username}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Fetch the user from the database
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      codingSessions: {
        orderBy: { startTime: 'desc' },
        take: 1,
      },
      dailyStats: {
        orderBy: { date: 'desc' },
        take: 30,
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Determine active session
  const activeSession = user.codingSessions.length > 0 && !user.codingSessions[0].endTime ? user.codingSessions[0] : null;

  // Format stats
  const totalCommits = 1482; // Mocked for now, as not in schema
  const pullRequests = 84; // Mocked for now, as not in schema

  // Process language stats (mocking for 30 days based on design)
  // We'll calculate total seconds per language from daily stats if they exist, else use mock data
  let languageStats = [];
  if (user.dailyStats.length > 0) {
      const langTotals: Record<string, number> = {};
      let totalTime = 0;
      user.dailyStats.forEach(stat => {
          const langs = stat.languages as Record<string, number>;
          for (const [lang, seconds] of Object.entries(langs || {})) {
              langTotals[lang] = (langTotals[lang] || 0) + seconds;
              totalTime += seconds;
          }
      });

      const colors = ['bg-blue-400', 'bg-yellow-400', 'bg-primary', 'bg-slate-500', 'bg-purple-400'];
      let colorIndex = 0;
      for (const [lang, time] of Object.entries(langTotals).sort((a, b) => b[1] - a[1]).slice(0, 4)) {
          languageStats.push({
              name: lang,
              percentage: Math.round((time / totalTime) * 100),
              color: colors[colorIndex % colors.length]
          });
          colorIndex++;
      }
  }

  // Fallback to mock data if no stats
  if (languageStats.length === 0) {
      languageStats = [
        { name: 'TypeScript', percentage: 62, color: 'bg-blue-400' },
        { name: 'Python', percentage: 21, color: 'bg-yellow-400' },
        { name: 'Go', percentage: 12, color: 'bg-primary' },
        { name: 'Rust', percentage: 5, color: 'bg-slate-500' },
      ];
  }

  // Contribution heatmap (mocked grid to match design)
  const renderContributionGrid = () => {
    const weeks = 12;
    const days = 7;
    const grid = [];

    // Simple seeded random for consistent look
    let seed = 1;
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const intensities = [
        'bg-primary/5',
        'bg-primary/10',
        'bg-primary/20',
        'bg-primary/40',
        'bg-primary/70',
        'bg-primary'
    ];

    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < days; d++) {
          // Generate a pattern that looks somewhat realistic
          const intensityIndex = Math.floor(random() * random() * intensities.length);
          col.push(
              <div key={`${w}-${d}`} className={`contribution-cell w-3.5 ${intensities[intensityIndex]}`}></div>
          );
      }
      grid.push(
          <div key={`week-${w}`} className="grid grid-rows-7 gap-1.5">
              {col}
          </div>
      );
    }
    return grid;
  };


  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 py-3 bg-background-dark/50 backdrop-blur-md sticky top-0 z-50 lg:px-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 text-primary">
              <div className="size-6">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_330)">
                    <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_330"><rect fill="white" height="48" width="48"></rect></clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">CodePulse</h2>
            </Link>
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
                <div className="text-primary/60 flex border-none bg-primary/10 items-center justify-center pl-4">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input className="flex w-full min-w-0 flex-1 border-none bg-primary/10 text-slate-100 placeholder:text-primary/40 px-4 pl-2 text-sm focus:ring-0 focus:outline-none" placeholder="Search developers or projects" />
              </div>
            </label>
          </div>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-primary text-sm font-medium" href="/dashboard">Dashboard</Link>
              <Link className="text-slate-300 hover:text-primary transition-colors text-sm font-medium" href="/dashboard/settings">Settings</Link>
            </nav>
            <div className="flex gap-3">
              <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20"
                   style={{ backgroundImage: `url("${user.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSQTCw19V2puyu5DuTy9WpT99DjKqlIKIququ4edkxld2oUcV4COJkw3Ow5OVocQAbsclLtXdNXX1cjreMRd0gj__3mXBrpNdq7t3vMMbtv7c2deQyrAH8jQaziW33Iiasd8gFVIV0LxqNce7OFxBWc2b8kcX-Pp37zogPAdL6hQA97Q47dia5ppKdXw402pnoVS4QTXDxFEnc3qn-PZB8xus8BYS4QaGVW5G5msfUM0X0E7o1Y-XfO66FI5v14p6h2DJ4oumAgChL'}")` }}>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Sidebar */}
            <aside className="lg:col-span-3 flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <div className="relative w-32 h-32 lg:w-44 lg:h-44">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl w-full h-full shadow-2xl border border-primary/10"
                       style={{ backgroundImage: `url("${user.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7PKRf-MqOqXOgrCjBWghdO-piq2YTIBCqOGVmwK--J4beunTgwQFGrwQqqoKzx83ZB0zAzCgYk_ZpxN1SmUkhAuB7ypW5cJvg0K3qv5FvkX6wiZxK9mzVNm7MTyvS1EXdGb8ay4wf5-PJb-cn8ggg4ahVp0Qi6PLeDjjoJkZovDcNsKg1US0NMIAvZX7NG77Pj7ZWEdPNyVt2lh-u8JB_bpJVnEhSPnrg6krDeFKfWjbItwO1AzY9pEno6mWrcA4VQvSKsPh2HXIx'}")` }}>
                  </div>
                  {activeSession && (
                    <div className="absolute -bottom-2 -right-2 bg-background-dark p-1.5 rounded-full border border-primary/20">
                      <div className="size-4 bg-primary rounded-full shadow-[0_0_10px_rgba(0,255,157,0.8)] animate-pulse"></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="text-slate-100 text-3xl font-bold tracking-tight">{user.displayName || user.name || user.username}</h1>
                  <p className="text-primary font-mono text-sm">@{user.username}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-2">Full-stack Engineer & Open Source Contributor. Obsessed with high-performance distributed systems and clean TypeScript architecture.</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>San Francisco, CA</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Connect</h3>
                <div className="flex flex-wrap gap-2">
                  <a className="flex items-center gap-2 px-3 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-lg transition-colors group" href="#">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">hub</span>
                    <span className="text-slate-300 text-sm">GitHub</span>
                  </a>
                  <a className="flex items-center gap-2 px-3 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-lg transition-colors group" href="#">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">alternate_email</span>
                    <span className="text-slate-300 text-sm">Twitter</span>
                  </a>
                  <a className="flex items-center gap-2 px-3 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-lg transition-colors group" href="#">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">language</span>
                    <span className="text-slate-300 text-sm">Portfolio</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Column */}
            <div className="lg:col-span-9 flex flex-col gap-8">

              {/* Active Session Status */}
              <div className="glass-panel p-8 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center size-3">
                        {activeSession ? (
                            <>
                                <div className="absolute animate-ping size-3 rounded-full bg-primary opacity-75"></div>
                                <div className="relative size-2 rounded-full bg-primary"></div>
                            </>
                        ) : (
                            <div className="relative size-2 rounded-full bg-slate-500"></div>
                        )}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${activeSession ? 'text-primary' : 'text-slate-500'}`}>
                          {activeSession ? 'AI Status: Active' : 'AI Status: Inactive'}
                      </span>
                    </div>
                    <h2 className="text-slate-100 text-2xl font-bold">
                        {activeSession ? (activeSession.aiSummary || `Building ${activeSession.primaryProject || 'a project'}`) : 'Currently offline'}
                    </h2>
                  </div>
                  {activeSession && (
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-background-dark/80 border border-primary/30 rounded-full text-primary text-sm font-mono flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">timer</span>
                          2h 47m
                        </div>
                        <button className="bg-primary text-background-dark px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-primary/50 transition-all">View Stream</button>
                      </div>
                  )}
                </div>

                {activeSession && (
                    <>
                        <div className="mt-8 flex flex-wrap gap-3 relative z-10">
                          {activeSession.primaryLanguage && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                                <div className="size-2 rounded-full bg-blue-400"></div>
                                <span className="text-slate-300 text-xs font-medium">{activeSession.primaryLanguage}</span>
                              </div>
                          )}
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                            <span className="text-slate-300 text-xs font-medium">Architecture</span>
                          </div>
                        </div>
                        <div className="mt-6 w-full h-1.5 bg-primary/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_#00ff9d]"></div>
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                          <span>Initialization</span>
                          <span>Optimization phase</span>
                          <span>Testing</span>
                        </div>
                    </>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Language Activity */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-100 text-sm font-bold uppercase tracking-wider">Language Activity</h3>
                    <span className="text-slate-500 text-xs">Last 30 days</span>
                  </div>
                  <div className="glass-panel p-5 rounded-xl flex flex-col gap-4 h-full">
                    <div className="flex h-3 w-full rounded-full overflow-hidden">
                      {languageStats.map((stat) => (
                          <div key={stat.name} className={`${stat.color} h-full`} style={{ width: `${stat.percentage}%` }}></div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {languageStats.map((stat) => (
                          <div key={stat.name} className="flex items-center gap-2">
                            <div className={`size-2 rounded-full ${stat.color}`}></div>
                            <span className="text-slate-300 text-xs font-medium">{stat.name} ({stat.percentage}%)</span>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* System Stats */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-100 text-sm font-bold uppercase tracking-wider">System Stats</h3>
                    <span className="material-symbols-outlined text-slate-500 text-sm">info</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 h-full">
                    <div className="glass-panel p-4 rounded-xl flex flex-col justify-center gap-1">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Commits</span>
                      <span className="text-slate-100 text-xl font-bold">{totalCommits.toLocaleString()}</span>
                    </div>
                    <div className="glass-panel p-4 rounded-xl flex flex-col justify-center gap-1">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Pull Requests</span>
                      <span className="text-slate-100 text-xl font-bold">{pullRequests}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Contribution Pulse */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-100 text-sm font-bold uppercase tracking-wider">Contribution Pulse</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">Less</span>
                    <div className="flex gap-1">
                      <div className="size-2.5 rounded-sm bg-primary/5"></div>
                      <div className="size-2.5 rounded-sm bg-primary/20"></div>
                      <div className="size-2.5 rounded-sm bg-primary/40"></div>
                      <div className="size-2.5 rounded-sm bg-primary/70"></div>
                      <div className="size-2.5 rounded-sm bg-primary"></div>
                    </div>
                    <span className="text-slate-500 text-xs">More</span>
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-xl overflow-x-auto">
                  <div className="flex gap-1.5 min-w-[600px] justify-between">
                     {renderContributionGrid()}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
