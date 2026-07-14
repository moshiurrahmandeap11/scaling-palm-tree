"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IUser, UserRole } from "@/lib/types";
import { toast } from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get<{ users: IUser[] }>("/users/")
      .then((r) => setUsers(r.users))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id: string, role: UserRole) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      toast.success("Role updated.");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this user? This cannot be undone.")) return;
    try {
      await api.del(`/users/${id}`);
      toast.success("User removed.");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800">Manage Users</h1>
      <p className="mt-1 text-slate-500">Update roles or remove accounts.</p>

      {loading ? (
        <p className="mt-8 text-slate-400">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto card-surface">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u.photoURL} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
                      <span className="font-medium text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className="input py-1.5"
                      value={u.role}
                      onChange={(e) => changeRole(u._id, e.target.value as UserRole)}
                    >
                      <option value="admin">admin</option>
                      <option value="creator">creator</option>
                      <option value="supporter">supporter</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{u.credits}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(u._id)} className="btn-danger px-3 py-1.5 text-xs">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}