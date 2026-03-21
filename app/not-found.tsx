import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <h1 className="text-6xl font-bold text-textMuted">404</h1>
      <p className="mt-4 text-lg font-medium text-text">Page not found</p>
      <p className="mt-2 text-sm text-textSecondary">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/home"
        className="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
