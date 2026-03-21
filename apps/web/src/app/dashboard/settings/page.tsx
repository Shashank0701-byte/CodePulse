import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ApiKeyDisplay from "./ApiKeyDisplay";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings | CodePulse Dashboard",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch the full user from DB to get the API Key
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      apiKey: true,
      username: true,
      displayName: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-pulse-muted">Manage your profile and developer configurations.</p>
      </div>

      {/* Profile Info Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white border-b border-pulse-border pb-2">Profile Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-md bg-pulse-surface border border-pulse-border">
            <span className="block text-xs uppercase text-pulse-muted font-bold tracking-wide mb-1">Username</span>
            <span className="text-white font-mono">{user.username || "—"}</span>
          </div>
          <div className="p-4 rounded-md bg-pulse-surface border border-pulse-border">
            <span className="block text-xs uppercase text-pulse-muted font-bold tracking-wide mb-1">Display Name</span>
            <span className="text-white">{user.displayName || "—"}</span>
          </div>
          <div className="p-4 rounded-md bg-pulse-surface border border-pulse-border md:col-span-2">
            <span className="block text-xs uppercase text-pulse-muted font-bold tracking-wide mb-1">Email Linked</span>
            <span className="text-white">{user.email || "—"}</span>
          </div>
        </div>
      </div>

      {/* Developer Settings Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-semibold text-white border-b border-pulse-border pb-2">Developer Integrations</h2>
        {user.apiKey ? (
           <ApiKeyDisplay apiKey={user.apiKey} />
        ) : (
           <div className="mt-4 p-6 rounded-lg border border-red-900/50 bg-red-900/10 text-red-400">
             <h3 className="font-semibold mb-1">API Key Missing</h3>
             <p className="text-sm">Something went wrong during account creation and an API key was not generated for your profile. Please contact support.</p>
           </div>
        )}
      </div>
    </div>
  );
}
