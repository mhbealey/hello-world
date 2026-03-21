import { BottomTabBar } from "@/components/ui/bottom-tab-bar";
import { ToastProvider } from "@/components/ui/toast";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen max-w-[390px] mx-auto">
        <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
          {children}
        </main>
        <BottomTabBar />
      </div>
    </ToastProvider>
  );
}
