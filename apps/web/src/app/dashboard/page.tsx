import React from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Developer Insights</h1>
          <p className="text-slate-400 mt-1">Real-time productivity metrics for the last 24 hours.</p>
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
        <div className="glass rounded-xl p-6 flex flex-col gap-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-5xl">schedule</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Daily Coding Time</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">6h 42m</h3>
            <span className="text-pulse-green text-sm font-bold flex items-center">+14%</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-pulse-green w-[85%] rounded-full glow-shadow"></div>
          </div>
        </div>

        {/* Commits Today */}
        <div className="glass rounded-xl p-6 flex flex-col gap-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-5xl">functions</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Commits Today</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">24</h3>
            <span className="text-pulse-green text-sm font-bold flex items-center">↑ 8</span>
          </div>
          <div className="flex gap-1 mt-4">
            <div className="h-6 flex-1 bg-pulse-green/40 rounded-sm"></div>
            <div className="h-6 flex-1 bg-pulse-green/20 rounded-sm"></div>
            <div className="h-6 flex-1 bg-pulse-green/60 rounded-sm"></div>
            <div className="h-6 flex-1 bg-pulse-green rounded-sm"></div>
            <div className="h-6 flex-1 bg-pulse-green/30 rounded-sm"></div>
            <div className="h-6 flex-1 bg-pulse-green/80 rounded-sm"></div>
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
              <code className="text-xs text-pulse-green/80 truncate">sk_live_284...9482</code>
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
              <p className="text-sm text-slate-400">Hours spent across different languages</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pulse-green"></div>
                <span className="text-xs text-slate-300">TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                <span className="text-xs text-slate-300">Rust</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">TypeScript</span>
                <span className="text-pulse-green">12h 45m</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-pulse-green w-[75%] rounded-full shadow-[0_0_10px_rgba(0,255,157,0.3)]"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Rust</span>
                <span className="text-slate-400">4h 20m</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-600 w-[40%] rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Python</span>
                <span className="text-slate-400">3h 15m</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 w-[25%] rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Go</span>
                <span className="text-slate-400">1h 50m</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-pulse-green/30 w-[15%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Time Distribution */}
        <div className="glass rounded-xl p-8 flex flex-col items-center">
          <h3 className="text-xl font-bold text-white w-full mb-2">Projects</h3>
          <p className="text-sm text-slate-400 w-full mb-8 text-left">Time distribution per active project</p>

          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
              {/* Stroke dashes roughly 55%, 28%, 17% */}
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#00ff9d" strokeDasharray="138 251.2" strokeLinecap="round" strokeWidth="8"></circle>
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#334155" strokeDasharray="70 251.2" strokeDashoffset="-138" strokeLinecap="round" strokeWidth="8"></circle>
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-black text-white">4</span>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Active Projects</p>
            </div>
          </div>

          <div className="w-full mt-8 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pulse-green"></div>
                <span className="text-sm text-slate-300">Quantum Dashboard</span>
              </div>
              <span className="text-xs font-bold text-slate-100">55%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <span className="text-sm text-slate-300">Nitro Engine</span>
              </div>
              <span className="text-xs font-bold text-slate-100">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <span className="text-sm text-slate-300">Pulse API</span>
              </div>
              <span className="text-xs font-bold text-slate-100">17%</span>
            </div>
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
              <tr className="hover:bg-pulse-green/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm text-white font-medium">Today, 14:20</p>
                  <p className="text-[10px] text-slate-500">2 hours ago</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-pulse-green text-xl">folder</span>
                    <div>
                      <p className="text-sm text-slate-200">Quantum Dashboard</p>
                      <p className="text-xs text-slate-500">src/components/Charts.tsx</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-white">2h 15m</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-12 bg-pulse-green/20 rounded-full overflow-hidden">
                      <div className="h-full bg-pulse-green w-[80%]"></div>
                    </div>
                    <span className="text-xs text-pulse-green font-bold">High</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-1 bg-pulse-green/10 text-pulse-green text-[10px] font-bold rounded-full uppercase">Synced</span>
                </td>
              </tr>

              <tr className="hover:bg-pulse-green/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm text-white font-medium">Today, 09:15</p>
                  <p className="text-[10px] text-slate-500">7 hours ago</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-xl">folder</span>
                    <div>
                      <p className="text-sm text-slate-200">Nitro Engine</p>
                      <p className="text-xs text-slate-500">core/optimizer.rs</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-white">4h 05m</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-12 bg-pulse-green/20 rounded-full overflow-hidden">
                      <div className="h-full bg-pulse-green w-[95%]"></div>
                    </div>
                    <span className="text-xs text-pulse-green font-bold">Peak</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-1 bg-pulse-green/10 text-pulse-green text-[10px] font-bold rounded-full uppercase">Synced</span>
                </td>
              </tr>

              <tr className="hover:bg-pulse-green/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm text-white font-medium">Yesterday, 20:00</p>
                  <p className="text-[10px] text-slate-500">20 hours ago</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-xl">folder</span>
                    <div>
                      <p className="text-sm text-slate-200">Pulse API</p>
                      <p className="text-xs text-slate-500">routes/auth.go</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-white">1h 32m</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-12 bg-pulse-green/20 rounded-full overflow-hidden">
                      <div className="h-full bg-pulse-green w-[40%]"></div>
                    </div>
                    <span className="text-xs text-pulse-green/60 font-bold">Mid</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-1 bg-pulse-green/10 text-pulse-green text-[10px] font-bold rounded-full uppercase">Synced</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
