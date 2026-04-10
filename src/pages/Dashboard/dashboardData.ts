const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

export type ChartDataPoint = {
    month: string
    /** Sales Overview: `revenue` is exact; axis labels may abbreviate (e.g. 5k), tooltip shows full amount. */
    revenue: number
    users: number
    orders: number
}

/** Dashboard overview: revenue trend + subscription volume per month */
export type OverviewMonthRow = {
    month: string
    revenue: number
    subscriptions: number
}

/** Horizontal “subscription plan” bars: label + scale end (5k–50k; bar runs from 50k at left to `endValue`). */
export type PlanTierRow = {
    label: string
    endValue: number
}

/** Monthly revenue (USD) for line chart — values roughly 5k–50k band */
export const overviewRevenueTrend2026: readonly number[] = [
    8500, 14000, 11800, 22000, 19500, 26500, 31000, 28500, 36000, 41000, 38500, 44500,
]

export const overviewSubscriptionCounts2026: readonly number[] = [
    95, 180, 220, 160, 280, 320, 240, 400, 360, 210, 190, 350,
]

/** Horizontal subscription chart — labels fixed above bars; lengths vs 50k–5k scale per design. */
export const overviewSubscriptionPlans: PlanTierRow[] = [
    { label: 'Basic ($4900/years)', endValue: 35000 },
    { label: 'Standart ($6200/years)', endValue: 25000 },
    { label: 'Standart ($5800/years)', endValue: 28000 },
]

const overviewRevenueTrendByYear: Record<string, readonly number[]> = {
    '2026': overviewRevenueTrend2026,
    '2025': [7200, 11000, 9800, 18500, 16800, 22000, 26500, 24000, 30500, 35000, 32000, 38000],
    '2024': [6000, 9200, 8000, 15000, 14000, 19000, 22000, 20000, 26000, 29000, 27000, 32000],
    '2023': [5000, 7800, 6500, 12000, 11500, 15500, 18000, 16500, 21000, 24000, 22000, 26000],
}

const overviewSubscriptionCountsByYear: Record<string, readonly number[]> = {
    '2026': overviewSubscriptionCounts2026,
    '2025': [85, 165, 200, 145, 250, 290, 220, 370, 330, 195, 175, 320],
    '2024': [75, 150, 180, 130, 220, 260, 200, 340, 300, 180, 160, 290],
    '2023': [65, 130, 155, 115, 190, 230, 175, 300, 270, 165, 145, 260],
}

function buildOverviewRows(year: string): OverviewMonthRow[] {
    const rev = overviewRevenueTrendByYear[year] ?? overviewRevenueTrendByYear['2026']
    const sub = overviewSubscriptionCountsByYear[year] ?? overviewSubscriptionCountsByYear['2026']
    return MONTHS.map((month, i) => ({
        month,
        revenue: rev[i] ?? 0,
        subscriptions: sub[i] ?? 0,
    }))
}

export const overviewByYear: Record<string, OverviewMonthRow[]> = Object.fromEntries(
    Object.keys(overviewRevenueTrendByYear).map((y) => [y, buildOverviewRows(y)])
) as Record<string, OverviewMonthRow[]>

export const overviewYears = Object.keys(overviewRevenueTrendByYear).sort((a, b) => Number(b) - Number(a))

export const PRESENT_YEAR = String(new Date().getFullYear())

export const salesRevenuePresentYear: readonly number[] = [
    3200, 12800, 3100, 8500, 15200, 9500, 4000, 11500, 5300, 16800, 4900, 8100,
]

const salesRevenueByPastYear: Record<string, readonly number[]> = {
    '2025': [3200, 8800, 4100, 5500, 7200, 9500, 4000, 7500, 5300, 6800, 4900, 5100],
    '2024': [2800, 4200, 3900, 5000, 6100, 8200, 3800, 6500, 4800, 5900, 4400, 4600],
    '2023': [2400, 3600, 3400, 4200, 5200, 6800, 3200, 5400, 4100, 5000, 3800, 4000],
    '2022': [2000, 3000, 2800, 3500, 4300, 5600, 2700, 4500, 3500, 4200, 3200, 3400],
    '2021': [1600, 2400, 2200, 2800, 3400, 4400, 2200, 3600, 2900, 3400, 2600, 2800],
}

export const salesRevenueByYear: Record<string, readonly number[]> = {
    ...salesRevenueByPastYear,
    [PRESENT_YEAR]: salesRevenuePresentYear,
}


export const defaultChartYear = PRESENT_YEAR

function buildYearlyChartRows(revenues: readonly number[]): ChartDataPoint[] {
    return MONTHS.map((month, i) => ({
        month,
        revenue: revenues[i] ?? 0,
        users: 0,
        orders: 0,
    }))
}

export const yearlyData: Record<string, ChartDataPoint[]> = Object.fromEntries(
    Object.entries(salesRevenueByYear).map(([year, rev]) => [year, buildYearlyChartRows(rev)])
) as Record<string, ChartDataPoint[]>

export const years = Object.keys(salesRevenueByYear).sort((a, b) => Number(b) - Number(a))

export type RecentBookingItem = {
    id: string
    customerName: string
    serviceType: string
    startDate: string
    endDate: string
    amount: number
    status: 'pending' | 'confirmed'
    avatarUrl: string
}

export const recentBookingsDashboard: RecentBookingItem[] = [
    {
        id: 'rb-1',
        customerName: 'Mohammad Shakil',
        serviceType: 'Shoe Shine',
        startDate: '2026-03-17',
        endDate: '2026-03-20',
        amount: 120,
        status: 'pending',
        avatarUrl: 'https://i.pravatar.cc/96?img=12',
    },
    {
        id: 'rb-2',
        customerName: 'Sarah Chen',
        serviceType: 'Cleaning',
        startDate: '2026-03-10',
        endDate: '2026-03-12',
        amount: 1200,
        status: 'confirmed',
        avatarUrl: 'https://i.pravatar.cc/96?img=5',
    },
    {
        id: 'rb-3',
        customerName: 'James Wilson',
        serviceType: 'Plumbing',
        startDate: '2026-04-02',
        endDate: '2026-04-04',
        amount: 450,
        status: 'confirmed',
        avatarUrl: 'https://i.pravatar.cc/96?img=33',
    },
    {
        id: 'rb-4',
        customerName: 'Emily Rodriguez',
        serviceType: 'Deep Cleaning',
        startDate: '2026-04-15',
        endDate: '2026-04-18',
        amount: 890,
        status: 'pending',
        avatarUrl: 'https://i.pravatar.cc/96?img=45',
    },
    {
        id: 'rb-5',
        customerName: 'David Okonkwo',
        serviceType: 'AC Repair',
        startDate: '2026-04-08',
        endDate: '2026-04-09',
        amount: 275,
        status: 'confirmed',
        avatarUrl: 'https://i.pravatar.cc/96?img=60',
    },
    {
        id: 'rb-6',
        customerName: 'Priya Patel',
        serviceType: 'Electrical',
        startDate: '2026-05-01',
        endDate: '2026-05-03',
        amount: 620,
        status: 'pending',
        avatarUrl: 'https://i.pravatar.cc/96?img=47',
    },
    {
        id: 'rb-7',
        customerName: 'John Doe',
        serviceType: 'AC Repair',
        startDate: '2026-04-08',
        endDate: '2026-04-09',
        amount: 275,
        status: 'confirmed',
        avatarUrl: 'https://i.pravatar.cc/96?img=12',
    },
    {
        id: 'rb-6',
        customerName: 'Jane Smith',
        serviceType: 'Deep Cleaning',
        startDate: '2026-04-15',
        endDate: '2026-04-18',
        amount: 890,
        status: 'confirmed',
        avatarUrl: 'https://i.pravatar.cc/96?img=5',
    },
]

export const carBookingsData = [
    {
        id: 'Ik-20248',
        startDate: '21 Aug 2026',
        endDate: '26 Aug 2026',
        clientName: 'Alice Jhonson',
        carModel: 'Toyota Corolla',
        licensePlate: 'TX1234',
        plan: '2 Days',
        payment: '€350',
        paymentStatus: 'Paid',
        status: 'Completed',
    },
    {
        id: 'Ik-20249',
        startDate: '21 Aug 2026',
        endDate: '26 Aug 2026',
        clientName: 'Alice Jhonson',
        carModel: 'Toyota Corolla',
        licensePlate: 'TX1234',
        plan: '2 Days',
        payment: '$500',
        paymentStatus: 'Pending',
        status: 'Upcoming',
    },
    {
        id: 'Ik-20250',
        startDate: '21 Aug 2026',
        endDate: '26 Aug 2026',
        clientName: 'Alice Jhonson',
        carModel: 'Toyota Corolla',
        licensePlate: 'TX1234',
        plan: '2 Days',
        payment: '$500',
        paymentStatus: 'Pending',
        status: 'Running',
    },
    {
        id: 'Ik-20251',
        startDate: '21 Aug 2026',
        endDate: '26 Aug 2026',
        clientName: 'Alice Jhonson',
        carModel: 'Toyota Corolla',
        licensePlate: 'TX1234',
        plan: '2 Days',
        payment: '$500',
        paymentStatus: 'Paid',
        status: 'Completed',
    },
    {
        id: 'Ik-20252',
        startDate: '21 Aug 2026',
        endDate: '26 Aug 2026',
        clientName: 'Alice Jhonson',
        carModel: 'Toyota Corolla',
        licensePlate: 'TX1234',
        plan: '2 Days',
        payment: '$500',
        paymentStatus: 'Pending',
        status: 'Upcoming',
    },
]

export const recentActivityData = [
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 min ago' },
    { id: 2, action: 'Product updated', user: 'Jane Smith', time: '15 min ago' },
    { id: 3, action: 'Order completed', user: 'Mike Johnson', time: '1 hour ago' },
    { id: 4, action: 'Category created', user: 'Sarah Williams', time: '2 hours ago' },
    { id: 5, action: 'User blocked', user: 'Admin', time: '3 hours ago' },
]

