import { StatCard } from "./StatCard.jsx";

export function StatsGrid({ stats }) {
  return (
    <section className="stats-grid">
      <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
      <StatCard label="Students" value={stats?.students ?? 0} />
      <StatCard label="Teachers" value={stats?.teachers ?? 0} />
      <StatCard label="Admins" value={stats?.admins ?? 0} />
      <StatCard label="Free Users" value={stats?.freeUsers ?? 0} />
      <StatCard label="Premium Users" value={stats?.premiumUsers ?? 0} />
      <StatCard label="Active Subs" value={stats?.activeUsers ?? 0} />
      <StatCard label="Suspended" value={stats?.suspendedUsers ?? 0} />
    </section>
  );
}