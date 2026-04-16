import React, { useCallback, useEffect, useState } from 'react';
import { Ban, RefreshCcw, Search, Trash2, Unlock, X } from 'lucide-react';
import { adminApi } from '../api/client';
import { normalizeRole } from '../api/adapters';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [banTarget, setBanTarget] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const roles = ['all', ...Array.from(new Set(users.map((user) => normalizeRole(user.role))))];
  const providers = ['all', ...Array.from(new Set(users.map((user) => String(user.provider || 'LOCAL').toLowerCase())))];

  const filteredUsers = users.filter((user) => {
    const haystack = `${user.id} ${user.name} ${user.email}`.toLowerCase();
    const status = user.banned ? 'banned' : 'active';
    const role = normalizeRole(user.role);
    const provider = String(user.provider || 'LOCAL').toLowerCase();

    return (!query || haystack.includes(query.toLowerCase()))
      && (roleFilter === 'all' || role === roleFilter)
      && (providerFilter === 'all' || provider === providerFilter)
      && (statusFilter === 'all' || status === statusFilter);
  });

  const openBanModal = (user) => {
    setBanTarget(user);
    setBanReason(user.bannedReason || '');
    setError('');
  };

  const closeBanModal = () => {
    setBanTarget(null);
    setBanReason('');
  };

  const submitBan = async () => {
    if (!banReason.trim()) {
      setError('Ban reason is required');
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      await adminApi.banUser(banTarget.id, { reason: banReason.trim() });
      closeBanModal();
      await loadUsers();
    } catch (banError) {
      setError(banError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const unbanUser = async (user) => {
    setActionLoading(true);
    setError('');
    try {
      await adminApi.unbanUser(user.id);
      await loadUsers();
    } catch (unbanError) {
      setError(unbanError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete user ${user.email}? This is a soft delete in the database.`)) return;

    setActionLoading(true);
    setError('');
    try {
      await adminApi.deleteUser(user.id);
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const statusLabel = (user) => user.banned ? 'Banned' : 'Active';

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

      <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl backdrop-blur">
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, name, or email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold capitalize outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
            {roles.map((role) => <option key={role} value={role}>{role === 'all' ? 'All roles' : role}</option>)}
          </select>
          <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold capitalize outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
            {providers.map((provider) => <option key={provider} value={provider}>{provider === 'all' ? 'All providers' : provider}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold capitalize outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-xl backdrop-blur">
        {loading ? (
          <p className="p-8 text-slate-500">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="p-8 text-slate-500">No users match the selected filters.</p>
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
                  <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">Reason</th>
                  <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-sm font-black text-slate-950">{user.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-950">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{user.email}</td>
                    <td className="px-6 py-4 text-sm uppercase text-slate-700">{user.provider}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black uppercase text-sky-700">
                        {normalizeRole(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${user.banned ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {statusLabel(user)}
                      </span>
                    </td>
                    <td className="max-w-xs px-6 py-4 text-sm text-slate-600">{user.bannedReason || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.banned ? (
                          <button disabled={actionLoading} onClick={() => unbanUser(user)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700 disabled:opacity-60">
                            <Unlock className="h-4 w-4" />
                            Unban
                          </button>
                        ) : (
                          <button disabled={actionLoading} onClick={() => openBanModal(user)} className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-3 py-2 text-xs font-black text-white hover:bg-amber-700 disabled:opacity-60">
                            <Ban className="h-4 w-4" />
                            Ban
                          </button>
                        )}
                        <button disabled={actionLoading} onClick={() => deleteUser(user)} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white hover:bg-red-700 disabled:opacity-60">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {banTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">Ban user</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">{banTarget.name}</h2>
                <p className="mt-1 text-slate-500">{banTarget.email}</p>
              </div>
              <button onClick={closeBanModal} className="rounded-2xl bg-slate-100 p-3 text-slate-700 hover:bg-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Banned reason</span>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Write why this user is banned..."
                className="min-h-36 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeBanModal} className="rounded-2xl bg-slate-200 px-5 py-3 font-black text-slate-800 hover:bg-slate-300">
                Cancel
              </button>
              <button disabled={actionLoading} onClick={submitBan} className="rounded-2xl bg-amber-600 px-5 py-3 font-black text-white hover:bg-amber-700 disabled:opacity-60">
                {actionLoading ? 'Banning...' : 'Ban user'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
