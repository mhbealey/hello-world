export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Crestview Partners
          </h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Cybersecurity Governance Platform
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
