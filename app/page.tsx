import { HabitDashboard } from "@/components/dashboard/HabitDashboard";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <SupabaseProvider>
          <HabitDashboard />
        </SupabaseProvider>
      </div>
    </main>
  );
}
