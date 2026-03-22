import { prisma } from "./db";
import { startOfDay, endOfDay, subDays } from "date-fns";

export async function getDailyCodingTime(userId: string) {
  const today = subDays(new Date(), 1); // Last 24 hours
  const now = new Date();
  
  // Fetch sessions active recently
  const sessions = await prisma.codingSession.findMany({
    where: {
      userId,
      startTime: { gte: today },
    },
  });

  let totalSeconds = 0;
  sessions.forEach(session => {
    // If the session is finished, use endTime; if still active, use 'now'
    const end = session.endTime || now;
    totalSeconds += (end.getTime() - session.startTime.getTime()) / 1000;
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return { hours, minutes, totalSeconds };
}

export async function getLanguageStats(userId: string, days = 30) {
  const since = subDays(new Date(), days);
  const today = startOfDay(new Date());
  
  const stats = await prisma.dailyStat.findMany({
    where: {
      userId,
      date: { gte: since },
    },
  });

  const langTotals: Record<string, number> = {};
  let grandTotal = 0;

  stats.forEach(s => {
    const languages = s.languages as Record<string, number>;
    for (const [lang, seconds] of Object.entries(languages || {})) {
      langTotals[lang] = (langTotals[lang] || 0) + seconds;
      grandTotal += seconds;
    }
  });

  // Also include current active session languages from heartbeats
  const activeHeartbeats = await prisma.heartbeat.findMany({
    where: {
      userId,
      timestamp: { gte: today }
    },
    select: { language: true, timestamp: true }
  });

  // Simple heuristic: Each heartbeat represents ~30 seconds of work
  activeHeartbeats.forEach(hb => {
    const lang = hb.language || 'Unknown';
    langTotals[lang] = (langTotals[lang] || 0) + 30; 
    grandTotal += 30;
  });

  return Object.entries(langTotals)
    .map(([name, seconds]) => ({
      name,
      seconds,
      percentage: Math.round((seconds / (grandTotal || 1)) * 100),
    }))
    .sort((a, b) => b.seconds - a.seconds);
}

export async function getProjectStats(userId: string, days = 30) {
  const since = subDays(new Date(), days);
  const today = startOfDay(new Date());

  const stats = await prisma.dailyStat.findMany({
    where: { userId, date: { gte: since } },
  });

  const projectTotals: Record<string, number> = {};
  let grandTotal = 0;

  stats.forEach(s => {
    const projects = s.projects as Record<string, number>;
    for (const [project, seconds] of Object.entries(projects || {})) {
      projectTotals[project] = (projectTotals[project] || 0) + seconds;
      grandTotal += seconds;
    }
  });

  const activeHeartbeats = await prisma.heartbeat.findMany({
    where: { userId, timestamp: { gte: today } },
    select: { project: true }
  });

  activeHeartbeats.forEach(hb => {
    const project = hb.project || 'Unknown';
    projectTotals[project] = (projectTotals[project] || 0) + 30;
    grandTotal += 30;
  });

  return Object.entries(projectTotals)
    .map(([name, seconds]) => ({
      name,
      seconds,
      percentage: Math.round((seconds / (grandTotal || 1)) * 100),
    }))
    .sort((a, b) => b.seconds - a.seconds);
}

export async function getRecentSessions(userId: string, limit = 5) {
  return prisma.codingSession.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
    take: limit,
  });
}
