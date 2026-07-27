import { useEffect, useState } from "react";
import { userRepo } from "../lib/user";
import { productService } from "../Services/productservice";
import { repairService } from "../Services/repairservice";
import MessageBanner from "../components/MessageBanner";
import StatCard from "../components/StatCard";
import { getErrorMessage } from "../utils/errors";
import { formatDate, roleLabel } from "../utils/formatters";
import type { UserProfile } from "../types/user";

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [repairCount, setRepairCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      userRepo.list(),
      productService.listAll(),
      repairService.listAll(),
    ])
      .then(([allUsers, allProducts, allRepairs]) => {
        setUsers(allUsers);
        setProductCount(allProducts.length);
        setRepairCount(allRepairs.length);
      })
      .catch((err: unknown) =>
        setError(getErrorMessage(err, "Failed to load data")),
      );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
        <p className="text-slate-500">Platform-wide overview.</p>
      </div>

      {error && <MessageBanner tone="warning">{error}</MessageBanner>}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Users" value={users.length} icon="👥" />
        <StatCard label="Products" value={productCount} icon="📦" />
        <StatCard label="Repairs" value={repairCount} icon="🔧" />
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Users</h2>
        </div>
        {users.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-slate-500">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {u.fullName || "—"}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{u.email}</td>
                    <td className="px-6 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {roleLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
