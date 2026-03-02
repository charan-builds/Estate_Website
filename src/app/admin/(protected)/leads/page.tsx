"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Lead } from "@/types/lead";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mapped: Lead[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Lead, "id">),
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

  function getTypeBadge(type: Lead["type"]) {
    const map: Record<string, string> = {
      enquiry: "bg-blue-100 text-blue-700",
      "site-visit": "bg-green-100 text-green-700",
      callback: "bg-yellow-100 text-yellow-700",
      "download-brochure": "bg-purple-100 text-purple-700",
    };

    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${map[type]}`}>
        {type.replace("-", " ")}
      </span>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#1a3a52]">Leads</h1>
        <p className="text-sm text-slate-600">
          Website enquiries, callbacks, and site visit requests.
        </p>
      </header>

      {loading && <p className="text-slate-600">Loading leads...</p>}

      {!loading && leads.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No leads yet. Website enquiries will appear here.
        </div>
      )}

      {!loading && leads.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Project</th>
                <th className="px-4 py-3 text-left">Schedule</th>
                <th className="px-4 py-3 text-left">Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="px-4 py-3">{getTypeBadge(lead.type)}</td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">
                    {lead.projectName || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {lead.preferredDate
                      ? `${lead.preferredDate} ${lead.preferredTime ?? ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {lead.createdAt?.toDate
                      ? lead.createdAt.toDate().toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}