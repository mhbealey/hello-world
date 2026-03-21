export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen max-w-[390px] mx-auto">
      <main className="flex-1 pb-[80px]">{children}</main>
      {/* BottomTabBar will be added in Prompt 3d */}
    </div>
  );
}
