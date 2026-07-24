"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GrowthChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2BA893" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2BA893" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#28313D" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#7C8794"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#7C8794" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "#1D2530",
            border: "1px solid #28313D",
            borderRadius: 8,
            fontSize: 12,
            color: "#F5F2ED",
          }}
        />
        <Area type="monotone" dataKey="count" stroke="#2BA893" strokeWidth={2} fill="url(#growthFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
