import { Head, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Building2,
    CalendarCheck2,
    CreditCard,
    DoorOpen,
    LifeBuoy,
    Megaphone,
    ShieldCheck,
    Users,
    Wrench,
    Zap,
} from 'lucide-react';
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
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { WidgetList } from '@/components/ui/widget-list';
import { ChartContainer } from '@/components/ui/chart';
import { dashboard } from '@/routes';
import { index as noticesIndex } from '@/routes/notices';
import { index as amenitiesIndex } from '@/routes/amenities';
import { index as visitorsIndex } from '@/routes/visitors';

interface StatItem {
    value: number;
    label: string;
}

interface WidgetRow {
    id: string | number;
    title: string;
    subtitle?: string;
    meta?: string;
}

interface QuickAction {
    label: string;
    description: string;
    href: string;
    icon: string;
}

interface DashboardProps {
    greeting: {
        name: string;
        society_name: string | null;
        property_type: string | null;
        date: string;
    };
    stats: Record<string, StatItem>;
    lists: Record<string, WidgetRow[]>;
    charts: {
        tickets_by_status: { name: string; value: number }[];
        visitors_last_7_days: { date: string; visitors: number }[];
    };
    quick_actions: QuickAction[];
}

interface TenancyProp {
    role?: string;
}

const actionIcons: Record<string, typeof Building2> = {
    calendar: CalendarCheck2,
    lifebuoy: LifeBuoy,
    megaphone: Megaphone,
    door: DoorOpen,
    alert: AlertTriangle,
    wrench: Wrench,
    shield: ShieldCheck,
    users: Users,
};

const statMeta: Record<
    string,
    { title: string; icon: typeof Building2 | null; tone: 'default' | 'success' | 'warning' | 'danger' | 'muted' }
> = {
    towers: { title: 'Towers', icon: Building2, tone: 'default' },
    apartments: { title: 'Apartments', icon: DoorOpen, tone: 'default' },
    owners: { title: 'Owners', icon: Users, tone: 'success' },
    tenants: { title: 'Tenants', icon: Users, tone: 'success' },
    maintenance_dues: { title: 'Maintenance', icon: CreditCard, tone: 'warning' },
    parking: { title: 'Parking', icon: Zap, tone: 'default' },
    open_tickets: { title: 'Open Tickets', icon: LifeBuoy, tone: 'danger' },
    notices: { title: 'Notices', icon: Megaphone, tone: 'default' },
    commercial_units: { title: 'Commercial Units', icon: Building2, tone: 'default' },
    commercial_tenants: { title: 'Commercial Tenants', icon: Users, tone: 'success' },
    active_leases: { title: 'Active Leases', icon: CreditCard, tone: 'default' },
    my_tickets: { title: 'My Tickets', icon: LifeBuoy, tone: 'danger' },
    my_bookings: { title: 'My Bookings', icon: CalendarCheck2, tone: 'default' },
    checkins_today: { title: "Today's Check-ins", icon: DoorOpen, tone: 'default' },
    active_visitors: { title: 'Active Visitors', icon: DoorOpen, tone: 'warning' },
    pending_approvals: { title: 'Pending Approvals', icon: ShieldCheck, tone: 'warning' },
    open_work_orders: { title: 'Open Work Orders', icon: Wrench, tone: 'danger' },
    active_automations: { title: 'Active Automations', icon: Zap, tone: 'success' },
};

const listMeta: Record<string, { title: string; icon: typeof Building2 | null }> = {
    rents_due: { title: 'Rents Due', icon: CreditCard },
    open_tickets: { title: 'Open & Pending Tickets', icon: LifeBuoy },
    visitors_today: { title: "Today's Visitors", icon: DoorOpen },
    notices: { title: 'Recent Notices', icon: Megaphone },
    bookings: { title: 'Pending Bookings', icon: CalendarCheck2 },
    sos: { title: 'SOS Alerts', icon: ShieldCheck },
    pending_approvals: { title: 'Pending Approvals', icon: ShieldCheck },
    work_orders: { title: 'Open Work Orders', icon: Wrench },
    amc_expiring: { title: 'AMC Expiring Soon', icon: CalendarCheck2 },
};

const ticketChartColors: Record<string, string> = {
    Open: 'var(--chart-3)',
    Pending: 'var(--chart-5)',
    Resolved: 'var(--chart-2)',
    Closed: 'var(--chart-4)',
};

export default function Dashboard({ greeting, stats, lists, charts, quick_actions }: DashboardProps) {
    const { props } = usePage();
    const tenancy = (props.tenancy ?? {}) as TenancyProp;
    const role = tenancy.role ?? '';

    const statCards = Object.entries(stats).map(([key, value]) => ({
        key,
        ...(statMeta[key] ?? { title: key.replace('_', ' '), icon: null, tone: 'default' as const }),
        value: value.value,
    }));

    const listGroups = Object.entries(lists)
        .map(([key, rows]) => ({
            key,
            rows,
            ...(listMeta[key] ?? { title: key.replace('_', ' '), icon: null }),
        }))
        .filter((group) => group.rows.length > 0 || ['rents_due', 'open_tickets', 'visitors_today'].includes(group.key));

    const isResident = role === 'Owner' || role === 'Tenant';
    const isGuard = role === 'Guard';
    const isPersonal = isResident || isGuard;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Card className="gap-0 py-6">
                    <CardContent className="flex flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold">
                                {greeting.name
                                    ? `Welcome back, ${greeting.name.split(' ')[0]}`
                                    : 'Welcome back'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {greeting.society_name ?? 'Your society'} · {greeting.date}
                            </p>
                        </div>
                        {!isPersonal && (
                            <div className="flex flex-wrap gap-2">
                                <Button asChild size="sm" variant="outline">
                                    <Link href={noticesIndex().url}>
                                        <Megaphone /> Notice Board
                                    </Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href={amenitiesIndex().url}>
                                        <CalendarCheck2 /> Amenities
                                    </Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href={visitorsIndex().url}>
                                        <DoorOpen /> Visitors
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {quick_actions.length > 0 && (
                    <Card className="gap-0 py-0">
                        <CardHeader className="border-b py-4">
                            <CardTitle className="text-sm">{isGuard ? 'Your Guard Console' : 'Quick Actions'}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
                            {quick_actions.map((action) => {
                                const Icon = actionIcons[action.icon] ?? ArrowRight;
                                return (
                                    <Button
                                        key={action.label}
                                        asChild
                                        variant="outline"
                                        className="h-auto flex-col items-start gap-2 p-4 text-left"
                                    >
                                        <Link href={action.href}>
                                            <Icon className="size-5 text-primary" />
                                            <span className="flex flex-col gap-0.5">
                                                <span className="font-medium">{action.label}</span>
                                                <span className="text-xs font-normal text-muted-foreground">{action.description}</span>
                                            </span>
                                        </Link>
                                    </Button>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {statCards.map((card) => (
                        <StatCard
                            key={card.key}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            tone={card.tone}
                        />
                    ))}
                </div>

                {!isPersonal && charts.tickets_by_status.some((t) => t.value > 0) && (
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Tickets by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={charts.tickets_by_status}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                            <Tooltip cursor={false} />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {charts.tickets_by_status.map((entry) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={ticketChartColors[entry.name] ?? 'var(--chart-1)'}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Visitors — Last 7 Days</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={charts.visitors_last_7_days}>
                                            <defs>
                                                <linearGradient id="visitorFill" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" tickLine={false} axisLine={false} />
                                            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                            <Tooltip cursor={false} />
                                            <Area
                                                type="monotone"
                                                dataKey="visitors"
                                                stroke="var(--chart-1)"
                                                fill="url(#visitorFill)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {listGroups.map((group) => (
                        <WidgetList
                            key={group.key}
                            title={group.title}
                            icon={group.icon}
                            rows={group.rows}
                            emptyText="Nothing to show right now."
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};