import Link from "next/link";

export default function GlobalNotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-serif text-[#1a3a52]">Page Not Found</h1>
      <p className="mb-6 max-w-xl text-slate-600">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="rounded-md bg-[#1a3a52] px-6 py-3 text-white transition hover:bg-[#224865]">
        Go to Homepage
      </Link>
    </div>
  );
}
