"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, Building2, PlusCircle, Users } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { db } from "@/lib/firebase";
import { Lead } from "@/types/lead";
import { mapProjectSnapshot } from "@/lib/projects";
import { Project } from "@/types/project";

type DashboardLead = Lead & {
  enquiryType?: string;
  source?: string;
};

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<DashboardLead[]>([]);

  useEffect(() => {
    const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const leadsQuery = query(collection(db, "leads"), orderBy("createdAt", "desc"));

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      setProjects(snapshot.docs.map(mapProjectSnapshot).filter(Boolean) as Project[]);
    });

    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      setLeads(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<DashboardLead, "id">),
        }))
      );
    });

    return () => {
      unsubscribeProjects();
      unsubscribeLeads();
    };
  }, []);

  const totalLeads = leads.length;
  const projectViews = leads.filter((lead) => lead.source === "project_detail" || lead.source === "project-page").length;
  const brochureDownloads = leads.filter(
    (lead) => lead.enquiryType === "Download Brochure" || lead.type === "download-brochure"
  ).length;
  const siteVisitRequests = leads.filter(
    (lead) => lead.enquiryType === "Schedule Site Visit" || lead.type === "site-visit"
  ).length;

  const leadChartData = useMemo(
    () => [
      { name: "Total Leads", value: totalLeads },
      { name: "Project Views", value: projectViews },
      { name: "Brochure", value: brochureDownloads },
      { name: "Site Visits", value: siteVisitRequests },
    ],
    [brochureDownloads, projectViews, siteVisitRequests, totalLeads]
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-[#1a3a52]">Admin Dashboard</h1>
        <p className="text-slate-600">
          Monitor listings, lead flow, and project engagement from one place.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Projects" value={String(projects.length)} icon={<Building2 size={22} />} />
        <StatCard title="Total Leads" value={String(totalLeads)} icon={<Users size={22} />} />
        <StatCard title="Brochure Downloads" value={String(brochureDownloads)} icon={<BarChart3 size={22} />} />
        <StatCard title="Add Project" value="+" icon={<PlusCircle size={22} />} action="/admin/projects/new" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#1a3a52]">Lead Analytics</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1a3a52" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#1a3a52]">Performance Snapshot</h2>
          <div className="space-y-4">
            <MetricRow label="Total Leads" value={totalLeads} />
            <MetricRow label="Project Views" value={projectViews} />
            <MetricRow label="Brochure Downloads" value={brochureDownloads} />
            <MetricRow label="Site Visit Requests" value={siteVisitRequests} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-[#1a3a52]">Quick Actions</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <ActionButton href="/admin/projects" label="Manage Projects" />
          <ActionButton href="/admin/leads" label="View Leads" />
          <ActionButton href="/admin/projects/new" label="Add New Project" primary />
        </div>
      </section>
    </div>
  );
}

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
  const card = (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-[#1a3a52]">{value}</p>
      </div>
      <div className="text-[#1a3a52]">{icon}</div>
    </div>
  );

  return action ? <Link href={action}>{card}</Link> : card;
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
      className={`rounded-lg px-5 py-3 text-center text-sm font-medium transition ${
        primary
          ? "bg-[#1a3a52] text-white hover:bg-[#224865]"
          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </Link>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-lg font-semibold text-[#1a3a52]">{value}</span>
    </div>
  );
}
