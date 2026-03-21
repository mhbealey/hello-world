export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surfaceDim p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text">
            Crestview Partners
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Cybersecurity Governance Platform
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
