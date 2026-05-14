import { useState, useMemo } from 'react'
import {
  Building2,
  Users,
  Stethoscope,
  Layers,
  CircleDollarSign,
  Wallet,
} from 'lucide-react'
import { OverviewKpiCard } from './OverviewKpiCard'
import { RevenueTrendChart } from './RevenueTrendChart'
import { SubscriptionDistributionCharts } from './SubscriptionDistributionCharts'
import { LiveActivityFeed } from './LiveActivityFeed'
import { FinancialSnapshotWidget } from './FinancialSnapshotWidget'
import { AIUsageOverviewWidget } from './AIUsageOverviewWidget'
import { SystemHealthWidget } from './SystemHealthWidget'
import { overviewByYear, overviewYears } from './dashboardData'
import { formatNumber } from '@/utils/formatters'

function formatUsd0(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(overviewYears[0] ?? '2026')

  const overviewRows = useMemo(() => overviewByYear[selectedYear] ?? [], [selectedYear])

  const kpis = useMemo(
    () => [
      {
        title: 'Total Clinics',
        value: formatNumber(12),
        change: 6,
        changeLabel: 'from last month',
        icon: Building2,
        featured: false as const,
      },
      {
        title: 'Total Practitioners',
        value: formatNumber(348),
        change: 4,
        changeLabel: 'from last month',
        icon: Stethoscope,
        featured: false as const,
      },
      {
        title: 'Total Patients',
        value: formatNumber(12_536),
        change: 2,
        changeLabel: 'from last month',
        icon: Users,
        featured: false as const,
      },
      {
        title: 'Active Subscriptions',
        value: formatNumber(592),
        change: 5,
        changeLabel: 'from last month',
        icon: Layers,
        featured: false as const,
      },
      {
        title: 'MRR',
        value: formatUsd0(52_400),
        change: 7.4,
        changeLabel: 'from last month',
        icon: CircleDollarSign,
        featured: true as const,
      },
      {
        title: 'ARR',
        value: formatUsd0(628_800),
        change: 12.1,
        changeLabel: 'YoY',
        icon: Wallet,
        featured: false as const,
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground">
          Clinics, subscribers, revenue, AI usage, and system health at a glance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((stat, index) => (
          <OverviewKpiCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <RevenueTrendChart
          data={overviewRows}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
        <LiveActivityFeed />
      </div>

      <FinancialSnapshotWidget />

      <AIUsageOverviewWidget />

      <SubscriptionDistributionCharts
        monthlyData={overviewRows}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      <SystemHealthWidget />
    </div>
  )
}
