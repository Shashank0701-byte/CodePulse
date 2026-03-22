import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden grid-bg">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined font-bold">terminal</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">CodePulse</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Dashboard</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Settings</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-background-dark rounded-lg text-sm font-bold hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
              <span>GitHub Login</span>
            </button>
            <div className="size-9 rounded-full bg-slate-800 border border-white/10 overflow-hidden relative">
              <Image
                alt="User profile avatar"
                className="w-full h-full object-cover"
                fill
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUF6Ux3dA5iG9fto9oz02k1hyZ5nBK0I7EvjLNCItFiFbMr3Xc5Och9dENhS-nD7OW3-yeSLJsH7L4FA3Elrk1vXo89SKcsAerXXxRcDNdRnXboLnMlMsZT9ZYn2GRxe5qDt5iGiMR_wW4cJFKeEU9EbuUudrDyMFZXeyRgY9uRH2h4qqcaFNEMkISraAvKuJ7pHzzo7MLAUwjjIKtNCjARqWBELie3MFP2mT0tTA2L90CH1iO7wLFWUpeI-wDeKmCnZnERGFGoREW"
              />
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <section className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live now: 12.4k developers coding
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              Show the world what you're <span className="text-primary">building</span> — live.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed mx-auto lg:mx-0">
              A real-time developer presence platform powered by your editor. Share your progress, stack, and activity with one simple sync.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-primary text-background-dark rounded-xl font-bold text-lg hover:scale-105 transition-transform glow-shadow">
                Get Your CodePulse Profile
              </button>
              <button className="px-8 py-4 glass text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">extension</span>
                Install Extension
              </button>
            </div>
          </div>
          <div className="flex-[1.2] w-full relative">
            <div className="relative w-full aspect-square glass rounded-3xl overflow-hidden shadow-2xl border-white/20 p-2 lg:scale-110">
              <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden relative">
                <Image
                  alt="Code editor interface"
                  className="w-full h-full object-cover opacity-40"
                  fill
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtrJUN_PWksgBvsUaw6yENUroc9OAMXhbtQ1j1mnNVut95g8Z92M4BFF9viYE_554c1aoTiAVy1bfRlOPb4mL2PtMTlpuhzb5lJ7_bC1helrrLGznXGsaynxE_kkvAN7qIS3r50Y2zwozlwTifpAf-slVSEJaTuf8eW6rIXJ86ObDDzhE5pKi4nbSRvT6CqCOVlqW75WqgfInemjW1BR1cqKWXUfBHPX0qvhmSf9DsloNVT3kc5l7TBNui4GSzg7oPYyHwuMvQiXmO"
                />
                <div className="absolute inset-0 p-8 flex flex-col">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="size-16 rounded-full border-2 border-primary p-0.5 relative">
                      <Image
                        alt="Developer photo"
                        className="w-full h-full rounded-full object-cover"
                        fill
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfU7qSeuSiSyacsChOFooLODvFKBAREI2G4D92T5UpHzUfXQ8wC6AtXHG2mLNB1TSVPM-xEJQzopuuGTVqgVLedbLKSkkY0zDt33_X8BfVhhs7feMbHniAzbheSkltEd8-TR2wa_q_drObZC2yvZR0dzJyNXOcamvAHieOHikxePJyd4Pm6MANGubT6vSi8HUrTEe4s4wyLPfjF_tG7aomydMmY_t7pjCxErUCK1uOrSknbnMmVxDPB7j1owhKDz8kKnYWULDUJnTo"
                      />
                    </div>
                    <div>
                      <p className="text-white font-bold text-2xl">Alex Rivera</p>
                      <p className="text-primary text-base flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">sensors</span> Working on "Artemis UI"
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass p-5 rounded-xl border-white/10">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-3">Current Language</p>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-400">javascript</span>
                        <span className="font-mono text-white text-lg">TypeScript</span>
                      </div>
                    </div>
                    <div className="glass p-5 rounded-xl border-white/10">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-3">Time Elapsed</p>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">timer</span>
                        <span className="font-mono text-white text-lg">04:22:15</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto glass p-6 rounded-xl border-white/10">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-4">Now Building</p>
                    <p className="text-lg text-slate-100 leading-relaxed italic">
                      "Implementing the new glassmorphism dashboard components using Tailwind CSS and React Server Components."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Overlays */}
            <div className="absolute -top-10 -right-10 glass p-5 rounded-2xl hidden lg:block animate-bounce duration-[3000ms] z-20">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined text-2xl">local_fire_department</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Current Streak</p>
                  <p className="text-base font-bold text-white">14 Days</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-10 -left-12 glass p-5 rounded-2xl hidden lg:block z-20">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">code</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Active Files</p>
                  <p className="text-base font-bold text-white">dashboard.tsx, nav.tsx</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-60">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Engineered for Modern Developers</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Seamlessly bridge the gap between your local environment and your public presence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-8 rounded-2xl group hover:border-primary/50 transition-all">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">person_pin_circle</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Live Coding Profiles</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A dynamic public profile that reflects your current work, language distribution, and real-time status.
              </p>
            </div>
            <div className="glass p-8 rounded-2xl group hover:border-primary/50 transition-all">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Summaries</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our AI analyzes your commit patterns and file changes to generate elegant summaries of what you're building.
              </p>
            </div>
            <div className="glass p-8 rounded-2xl group hover:border-primary/50 transition-all">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">grid_view</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Activity Heatmap</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize your coding intensity across different projects and languages with ultra-fine granularity.
              </p>
            </div>
            <div className="glass p-8 rounded-2xl group hover:border-primary/50 transition-all">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">settings_ethernet</span>
              </div>
              <h3 className="text-xl font-bold mb-3">VS Code Sync</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Zero-config setup with our lightweight extension. Privacy-first tracking only shares what you permit.
              </p>
            </div>
          </div>
        </section>
        <section className="mt-40 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[2rem] blur-2xl opacity-20"></div>
          <div className="relative glass rounded-[2rem] p-8 md:p-16 overflow-hidden">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to pulse?</h2>
              <p className="text-slate-400 text-lg mb-10">Join thousands of developers sharing their journey in real-time. Start building in the open.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-10 py-5 bg-primary text-background-dark rounded-2xl font-black text-xl hover:scale-105 transition-transform glow-shadow">
                  Get Started Free
                </button>
                <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xl hover:bg-white/10 transition-all">
                  View Demo Profile
                </button>
              </div>
            </div>
            <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">description</span> Documentation</div>
              <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">forum</span> Community</div>
              <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined">security</span> Privacy First</div>
            </div>
          </div>
        </section>
        <footer className="mt-40 pt-16 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="size-6 bg-primary rounded flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-[16px] font-bold">terminal</span>
              </div>
              <span className="font-black text-lg">CodePulse</span>
            </div>
            <div className="flex gap-8 text-slate-500 text-sm font-medium">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Twitter</a>
              <a className="hover:text-primary transition-colors" href="#">Discord</a>
            </div>
            <div className="text-slate-500 text-sm">
              © 2024 CodePulse. Built for builders.
            </div>
          </div>
        </footer>
      </main>
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10"></div>
    </div>
  );
}
