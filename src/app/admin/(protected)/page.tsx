import {
  Building2,
  PlusCircle,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-[#1a3a52]">
          Admin Dashboard
        </h1>
        <p className="text-slate-600">
          Manage projects, leads, and site content from here.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projects"
          value="1"
          icon={<Building2 size={22} />}
        />
        <StatCard
          title="Leads"
          value="0"
          icon={<Users size={22} />}
        />
        <StatCard
          title="Active Listings"
          value="1"
          icon={<BarChart3 size={22} />}
        />
        <StatCard
          title="Add Project"
          value="+"
          icon={<PlusCircle size={22} />}
          action="/admin/projects/new"
        />
      </section>

      {/* Primary Actions */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-[#1a3a52] mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <ActionButton
            href="/admin/projects"
            label="Manage Projects"
          />
          <ActionButton
            href="/admin/leads"
            label="View Leads"
          />
          <ActionButton
            href="/admin/projects/new"
            label="Add New Project"
            primary
          />
        </div>
      </section>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({
  title,
  value,
  icon,
  action,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  action?: string;
}) {
  const Card = (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm transition">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-[#1a3a52]">{value}</p>
      </div>
      <div className="text-[#1a3a52]">{icon}</div>
    </div>
  );

  return action ? <Link href={action}>{Card}</Link> : Card;
}

function ActionButton({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-5 py-3 text-sm font-medium text-center transition ${
        primary
          ? "bg-[#1a3a52] text-white hover:bg-[#224865]"
          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </Link>
  );
}