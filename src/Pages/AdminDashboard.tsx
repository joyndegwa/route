import { useEffect, useState } from "react";
import { userRepo } from "../lib/user";
import { productService } from "../Services/productservice";
import { repairService } from "../Services/repairservice";
import StatCard from "../components/StatCard";
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
        setError(err instanceof Error ? err.message : "Failed to load data"),
      );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-slate-500">Platform-wide overview.</p>
      </div>

      {error && (
        <p className="rounded bg-amber-50 p-3 text-sm text-amber-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Users" value={users.length} />
        <StatCard label="Products" value={productCount} />
        <StatCard label="Repairs" value={repairCount} />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-lg font-semibold">Users</h2>
        {users.length === 0 ? (
          <p className="text-sm text-slate-500">No users found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2">{u.fullName || "—"}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{roleLabel(u.role)}</td>
                  <td className="py-2">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
