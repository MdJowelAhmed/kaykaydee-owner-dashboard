import { useState, useMemo } from 'react'
import { Building2, Users, UserCog, CircleDollarSign } from 'lucide-react'
import { OverviewKpiCard } from './OverviewKpiCard'
import { RevenueTrendChart } from './RevenueTrendChart'
import { SubscriptionDistributionCharts } from './SubscriptionDistributionCharts'
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
        title: 'Total Revenue',
        value: formatUsd0(35000),
        change: 8,
        changeLabel: 'from last month',
        icon: CircleDollarSign,
        featured: true as const,
      },
      {
        title: 'Active Clinics',
        value: formatNumber(12),
        change: 2,
        changeLabel: 'from last month',
        icon: Building2,
        featured: false as const,
      },
      {
        title: 'Total Patients',
        value: formatNumber(12536),
        change: 2,
        changeLabel: 'from last month',
        icon: Users,
        featured: false as const,
      },
      {
        title: 'Platform Users',
        value: formatNumber(620),
        change: 2,
        changeLabel: 'from last month',
        icon: UserCog,
        featured: false as const,
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((stat, index) => (
          <OverviewKpiCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      <RevenueTrendChart
        data={overviewRows}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      <SubscriptionDistributionCharts
        monthlyData={overviewRows}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
    </div>
  )
}
