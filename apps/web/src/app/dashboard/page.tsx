import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DynamicLiveStatus as LiveStatus } from '@/components/DynamicLiveStatus';
import { DynamicCodingTime } from "@/components/DynamicCodingTime";
import { getDailyCodingTime, getLanguageStats, getRecentSessions, getProjectStats } from "@/lib/stats";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, apiKey: true }
  });

  const { hours, minutes, totalSeconds } = await getDailyCodingTime(userId);
  const langStats = await getLanguageStats(userId);
  const projectStats = await getProjectStats(userId);
  const recentSessions = await getRecentSessions(userId);
  const commitsToday = 0; 

  const displayApiKey = user?.apiKey 
    ? `${user.apiKey.slice(0, 7)}...${user.apiKey.slice(-4)}`
    : "Not generated yet";

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Developer Insights</h1>
            <p className="text-slate-400 mt-1">Real-time productivity metrics for the last 24 hours.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl max-w-sm">
            <LiveStatus userId={userId} />
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-pulse-green/10 border border-pulse-green/20 text-pulse-green text-sm font-bold hover:bg-pulse-green/20 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Last 7 Days
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Coding Time */}
        <DynamicCodingTime 
          initialHours={hours} 
          initialMinutes={minutes} 
          initialTotalSeconds={totalSeconds} 
        />

        {/* Commits Today */}
        <div className="glass rounded-xl p-6 flex flex-col gap-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-5xl">functions</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Commits Today</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">{commitsToday}</h3>
            <span className="text-slate-500 text-sm font-bold flex items-center">--</span>
          </div>
          <div className="flex gap-1 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 flex-1 bg-slate-800 rounded-sm"></div>
            ))}
          </div>
        </div>

        {/* Extension Sync Config */}
        <div className="bg-pulse-green/10 border border-pulse-green/20 rounded-xl p-6 flex flex-col justify-between relative group overflow-hidden">
          <div className="absolute -right-4 -bottom-4 bg-pulse-green/10 rounded-full h-24 w-24 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-pulse-green font-bold text-xs uppercase tracking-widest">Extension Sync</p>
              <h3 className="text-white font-bold mt-1">API Key Config</h3>
            </div>
            <span className="material-symbols-outlined text-pulse-green">key</span>
          </div>
          <div className="mt-4 z-10">
            <div className="flex items-center gap-2 bg-pulse-bg/60 rounded-lg p-2 border border-pulse-green/20">
              <code className="text-xs text-pulse-green/80 truncate">{displayApiKey}</code>
              <button className="ml-auto text-pulse-green hover:text-white">
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity and Projects Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coding Activity */}
        <div className="lg:col-span-2 glass rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Coding Activity</h3>
              <p className="text-sm text-slate-400">Total time spent across languages (30d)</p>
            </div>
            <div className="flex gap-4">
              {langStats.slice(0, 2).map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${s.name === 'TypeScript' ? 'bg-pulse-green' : 'bg-slate-600'}`}></div>
                  <span className="text-xs text-slate-300">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {langStats.length > 0 ? langStats.slice(0, 4).map(s => (
              <div key={s.name} className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{s.name}</span>
                  <span className="text-pulse-green">{Math.floor(s.seconds / 3600)}h {Math.floor((s.seconds % 3600) / 60)}m</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pulse-green rounded-full shadow-[0_0_10px_rgba(0,255,157,0.3)]" style={{ width: `${s.percentage}%` }}></div>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm italic py-10 text-center">No activity recorded yet.</p>
            )}
          </div>
        </div>

        {/* Projects Time Distribution */}
        <div className="glass rounded-xl p-8 flex flex-col items-center">
          <h3 className="text-xl font-bold text-white w-full mb-2">Projects</h3>
          <p className="text-sm text-slate-400 w-full mb-8 text-left">Time distribution per active project</p>

          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
              {projectStats.length > 0 ? (
                <circle 
                  cx="50" 
                  cy="50" 
                  fill="transparent" 
                  r="40" 
                  stroke="#00ff9d" 
                  strokeDasharray={`${(projectStats[0]?.percentage / 100) * 251.2} 251.2`} 
                  strokeLinecap="round" 
                  strokeWidth="8"
                ></circle>
              ) : null}
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-black text-white">{projectStats.length}</span>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Active Projects</p>
            </div>
          </div>

          <div className="w-full mt-8 space-y-3">
            {projectStats.length > 0 ? projectStats.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-pulse-green' : 'bg-slate-600'}`}></div>
                  <span className="text-sm text-slate-300 truncate max-w-[150px]">{p.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-100">{p.percentage}%</span>
              </div>
            )) : (
              <p className="text-slate-500 text-xs italic text-center py-4">No projects tracked yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-6 border-b border-pulse-green/10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
          <button className="text-pulse-green text-sm font-bold hover:underline">View All History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-pulse-green/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Session Date</th>
                <th className="px-6 py-4">Project / File</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pulse-green/10">
              {recentSessions.length > 0 ? recentSessions.map(session => (
                <tr key={session.id} className="hover:bg-pulse-green/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm text-white font-medium">{session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-[10px] text-slate-500">{session.startTime.toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-pulse-green text-xl">folder</span>
                      <div className="max-w-[200px]">
                        <p className="text-sm text-slate-200 truncate">{session.primaryProject || 'Unknown'}</p>
                        <p className="text-xs text-slate-500 truncate">{session.primaryLanguage || 'Unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">
                    {session.endTime ? `${Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 60000)}m` : 'Active'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-12 bg-pulse-green/20 rounded-full overflow-hidden">
                        <div className="h-full bg-pulse-green w-[80%]"></div>
                      </div>
                      <span className="text-xs text-pulse-green font-bold">Good</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 ${session.endTime ? 'bg-pulse-green/10 text-pulse-green' : 'bg-blue-500/10 text-blue-400'} text-[10px] font-bold rounded-full uppercase`}>
                      {session.endTime ? 'Synced' : 'Live'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">No recent sessions found. Install the VS Code extension to begin.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
