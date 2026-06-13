"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/store/auth";
import { getAdminUsers, updateUserRole, toggleUserStatus } from "@/lib/admin-api";
import { AdminToolbar, Card, Empty, Spinner, StatusPill } from "@/components/admin/ui";
import { formatBDT } from "@/lib/site";
import type { AdminUserRow } from "@/lib/types";

const ROLES: AdminUserRow["role"][] = ["customer", "moderator", "admin"];

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers(token)
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [token]);

  async function changeRole(u: AdminUserRow, role: AdminUserRow["role"]) {
    const prev = u.role;
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, role } : x)));
    try {
      await updateUserRole(u.id, role, token);
      toast.success(`${u.name} is now ${role}.`);
    } catch (err) {
      setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, role: prev } : x)));
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function toggleStatus(u: AdminUserRow) {
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, isActive: !x.isActive } : x)));
    try {
      await toggleUserStatus(u.id, token);
      toast.success(`${u.name} ${u.isActive ? "deactivated" : "activated"}.`);
    } catch (err) {
      setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, isActive: u.isActive } : x)));
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  }

  return (
    <div>
      <AdminToolbar title="Users" subtitle={`${users.length} accounts`} />

      <Card>
        {loading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <Empty message="No users." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-right">Orders</th>
                  <th className="px-4 py-3 text-right">Spent</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="border-b border-line/50 last:border-0 hover:bg-charcoal/40">
                      <td className="px-4 py-3 text-ink">
                        {u.name}
                        {isSelf && <span className="ml-2 text-[10px] uppercase text-gold">you</span>}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        <div>{u.email}</div>
                        <div>{u.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-ink/70">{u.ordersCount}</td>
                      <td className="px-4 py-3 text-right text-ink/70">{formatBDT(u.totalSpent)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => changeRole(u, e.target.value as AdminUserRow["role"])}
                          className="border border-line bg-obsidian px-2 py-1 text-xs text-ink focus:border-gold focus:outline-none disabled:opacity-50"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={u.isActive ? "active" : "inactive"} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={isSelf}
                          className="text-xs text-gold hover:opacity-70 disabled:opacity-40"
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
