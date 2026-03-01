"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Lead = {
  id: string;
  type?: string;
  name?: string;
  phone?: string;
  email?: string;
  project?: string;
  projectName?: string;
  preferredDate?: string;
  preferredTime?: string;
  createdAt?: { toDate?: () => Date };
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const leadsQuery = query(collection(db, "leads"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      leadsQuery,
      (snapshot) => {
        const mapped = snapshot.docs.map((leadSnapshot) => ({
          id: leadSnapshot.id,
          ...(leadSnapshot.data() as Omit<Lead, "id">),
        }));
        setLeads(mapped);
        setLoading(false);
      },
      () => {
        setLeads([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a3a52]">Leads</h1>
        <p className="text-sm text-slate-600">Recent website enquiries and site-visit requests.</p>
      </div>

      {loading ? <p className="text-slate-600">Loading leads...</p> : null}

      {!loading && !leads.length ? (
        <p className="rounded-md border border-slate-200 bg-white p-6 text-slate-500">No leads found.</p>
      ) : null}

      {!loading && leads.length ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Schedule</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{lead.type || "-"}</td>
                  <td className="px-4 py-3">{lead.name || "-"}</td>
                  <td className="px-4 py-3">{lead.phone || "-"}</td>
                  <td className="px-4 py-3">{lead.projectName || lead.project || "-"}</td>
                  <td className="px-4 py-3">
                    {lead.preferredDate && lead.preferredTime
                      ? `${lead.preferredDate} ${lead.preferredTime}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
