import { Head } from '@inertiajs/react';
import {
    Building2,
    ClipboardList,
    HardHat,
    Landmark,
    Music,
    Smartphone,
    Users,
} from 'lucide-react';
import Heading from '@/components/heading';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Segment {
    name: string;
    value: number;
}

interface TrendPoint {
    date: string;
    visitors: number;
}

interface AnalyticsData {
    occupancy: {
        total: number;
        occupied: number;
        rented: number;
        vacant: number;
        owner_occupied: number;
        occupancy_rate: number;
        tenants: number;
        defaulters: number;
        byStatus: Segment[];
    };
    tickets: { total: number; open: number; resolution_rate: number; byStatus: Segment[] };
    workOrders: { total: number; open: number; completed: number; byStatus: Segment[]; byPriority: Segment[] };
    visitors: { total: number; checkedIn: number; byStatus: Segment[]; byPurpose: Record<string, number>; trend: TrendPoint[] };
    finance: { billed: number; collected: number; pending: number; arrears: number; collection_rate: number; byMethod: Record<string, number> };
    community: { events: number; polls: number; amenityBookings: number };
    operations: {
        vehicles: number;
        vehiclesByType: Segment[];
        staff: number;
        activeStaff: number;
        staffByDesignation: Record<string, number>;
        gatepasses: number;
        gatepassByType: Segment[];
    };
}

const PIE_COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2, 173 58% 39%))',
    'hsl(var(--chart-3, 197 37% 24%))',
    'hsl(var(--chart-4, 43 74% 66%))',
    'hsl(var(--chart-5, 27 87% 67%))',
];

const rupee = (v: number) => `₹${Number(v).toLocaleString()}`;
const percent = (v: number) => `${v}%`;

function PairList({ data }: { data: Record<string, number> }) {
    const entries = Object.entries(data);
    if (entries.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">No data yet</p>;
    const total = entries.reduce((acc, [, v]) => acc + v, 0);
    return (
        <div className="space-y-2">
            {entries.map(([name, value]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-muted-foreground">{name}</span>
                    <span className="ml-4 font-medium tabular-nums">
                        {value}
                        {total > 0 ? ` (${Math.round((value / total) * 100)}%)` : ''}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsIndex({ occupancy, tickets, workOrders, visitors, finance, community, operations }: AnalyticsData) {
    return (
        <>
            <Head title="Analytics" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    variant="small"
                    title="Analytics"
                    description="Intelligence across your society operations"
                />

                {/* Top-level KPI cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Occupancy Rate" value={percent(occupancy.occupancy_rate)} icon={Building2} tone="success" hint={`${occupancy.occupied} of ${occupancy.total} units occupied`} />
                    <StatCard title="Open Tickets" value={tickets.open} icon={Smartphone} tone="warning" hint={`${tickets.resolution_rate}% resolution rate`} />
                    <StatCard title="Open Work Orders" value={workOrders.open} icon={HardHat} hint={`${workOrders.completed} completed`} />
                    <StatCard title="Collection Rate" value={percent(finance.collection_rate)} icon={Landmark} tone={finance.collection_rate >= 80 ? 'success' : 'warning'} hint={`${rupee(finance.collected)} collected`} />
                </div>

                {/* Occupancy + Finance */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Occupancy by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={occupancy.byStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                                            {occupancy.byStatus.map((_, idx) => (
                                                <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{occupancy.owner_occupied} owner-occupied</span>
                                <span>{occupancy.rented} rented</span>
                                <span>{occupancy.vacant} vacant</span>
                                <span>{occupancy.defaulters} defaulters</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Maintenance Collection</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">Billed</p>
                                    <p className="text-lg font-semibold tabular-nums">{rupee(finance.billed)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Collected</p>
                                    <p className="text-lg font-semibold tabular-nums text-emerald-600">{rupee(finance.collected)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <p className="text-lg font-semibold tabular-nums text-amber-600">{rupee(finance.pending)}</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Arrears: {rupee(finance.arrears)}</p>
                            <div>
                                <p className="mb-2 text-sm font-medium">By payment method</p>
                                <PairList data={finance.byMethod} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tickets + Work orders */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tickets by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={tickets.byStatus}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} width={28} />
                                        <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                                        <Bar dataKey="value" radius={4} fill="hsl(var(--primary))" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Work Orders by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={workOrders.byStatus}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} width={28} />
                                        <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                                        <Bar dataKey="value" radius={4} fill="hsl(var(--chart-2, 173 58% 39%))" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Visitors */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Visitor Activity (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={visitors.trend}>
                                    <defs>
                                        <linearGradient id="visitorFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} width={28} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fill="url(#visitorFill)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <div className="mt-2 text-xs text-muted-foreground">
                            {visitors.total} total visitors · {visitors.checkedIn} checked in
                        </div>
                    </CardContent>
                </Card>

                {/* Community + Operations */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Operations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="mb-2 text-sm font-medium">Vehicles</p>
                                    <p className="mb-2 text-2xl font-semibold tabular-nums">{operations.vehicles}</p>
                                    <PairList
                                        data={Object.fromEntries(
                                            operations.vehiclesByType.filter((s) => s.value > 0).map((s) => [s.name, s.value])
                                        )}
                                    />
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-medium">Staff</p>
                                    <p className="mb-2 text-2xl font-semibold tabular-nums">{operations.activeStaff} / {operations.staff} active</p>
                                    <PairList data={operations.staffByDesignation} />
                                </div>
                            </div>
                            <div className="mt-4 border-t pt-3">
                                <p className="text-sm text-muted-foreground">
                                    Gatepasses: {operations.gatepasses} total (
                                    {operations.gatepassByType.map((s) => `${s.name}: ${s.value}`).join(' · ')})
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Community</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 rounded-lg border p-3">
                                    <Music className="size-5 text-primary" />
                                    <div>
                                        <p className="text-2xl font-semibold tabular-nums">{community.events}</p>
                                        <p className="text-sm text-muted-foreground">Events</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border p-3">
                                    <ClipboardList className="size-5 text-primary" />
                                    <div>
                                        <p className="text-2xl font-semibold tabular-nums">{community.polls}</p>
                                        <p className="text-sm text-muted-foreground">Polls</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border p-3">
                                    <Users className="size-5 text-primary" />
                                    <div>
                                        <p className="text-2xl font-semibold tabular-nums">{community.amenityBookings}</p>
                                        <p className="text-sm text-muted-foreground">Amenity bookings</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function ChartTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number }>; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-background/95 px-3 py-2 text-sm shadow-md">
            {label && <div className="mb-1 text-xs font-medium text-muted-foreground capitalize">{label}</div>}
            {payload.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="font-medium capitalize">{entry.name ?? ''}</span>
                    <span className="ml-auto font-semibold">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

AnalyticsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Analytics', href: '/analytics' },
    ],
};
