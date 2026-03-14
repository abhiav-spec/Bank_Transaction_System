export default function UsersTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead>
          <tr className="border-b border-white/15 text-xs uppercase text-slate-300">
            <th className="px-3 py-3">User ID</th>
            <th className="px-3 py-3">Name</th>
            <th className="px-3 py-3">Email</th>
            <th className="px-3 py-3">Number of Accounts</th>
            <th className="px-3 py-3">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-white/10">
              <td className="px-3 py-3 font-mono text-xs text-cyan-100">{user.id}</td>
              <td className="px-3 py-3">{user.name || '-'}</td>
              <td className="px-3 py-3">{user.email || '-'}</td>
              <td className="px-3 py-3">{user.accountCount}</td>
              <td className="px-3 py-3">{user.createdDateLabel}</td>
            </tr>
          ))}
          {!users.length && (
            <tr>
              <td className="px-3 py-8 text-center text-slate-300" colSpan={5}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
