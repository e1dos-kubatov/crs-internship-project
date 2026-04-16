import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { adminApi } from '../api/client';
import { normalizeRole } from '../api/adapters';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await adminApi.users());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-700">Security</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Backend users</h1>
        </div>
        <button onClick={loadUsers} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-xl backdrop-blur">
        {loading ? (
          <p className="p-8 text-slate-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-8 text-slate-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-sm font-black text-slate-950">{user.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-950">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{user.provider}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black uppercase text-sky-700">
                        {normalizeRole(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{user.deleted ? 'Banned' : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
