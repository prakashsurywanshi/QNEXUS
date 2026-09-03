import { Head } from '@inertiajs/react';
import {
    Building2,
    CreditCard,
    Wallet,
    PackageOpen,
    Users,
    UserCheck,
    UserX,
    Clock,
    Radio,
} from 'lucide-react';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
} from '@/components/ui/chart';
import { dashboard } from '@/routes/superadmin';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
} from 'recharts';

type SocietyRow = {
    id: number;
    name: string;
    slug: string;
    property_type: string | null;
    is_active: boolean;
    created_at: string;
    users_count: number;
};

type InvoiceRow = {
    id: number;
    invoice_id: string | null;
    amount: number | null;
    gateway_name: string | null;
    status: string | null;
    pay_date: string | null;
    society?: { id: number; name: string } | null;
};

type OfflineRequestRow = {
    id: number;
    society_id: number | null;
    package_type: string;
    amount: number | null;
    status: string;
    created_at: string | null;
    society?: { id: number; name: string } | null;
};

export default function SuperAdminDashboard({
    stats,
    recentSocieties,
    societiesByType,
    activeSocieties,
    inactiveSocieties,
    packageUsage,
    recentInvoices,
    offlineRequests,
}: {
    stats: {
        societies: number;
        users: number;
        packages: number;
        subscriptions: number;
        offline_requests: number;
        active_subscriptions: number;
        inactive_subscriptions: number;
        expected_revenue: number;
        paid_invoices: number;
        gateways: number;
    };
    recentSocieties: SocietyRow[];
    societiesByType: Record<string, number>;
    activeSocieties: number;
    inactiveSocieties: number;
    packageUsage: { name: string; societies: number }[];
    recentInvoices: InvoiceRow[];
    offlineRequests: OfflineRequestRow[];
}) {
    const cards = [
        { title: 'Societies', value: stats.societies, icon: Building2 },
        { title: 'Total Users', value: stats.users, icon: Users },
        { title: 'Packages', value: stats.packages, icon: PackageOpen },
        { title: 'Subscriptions', value: stats.subscriptions, icon: CreditCard },
        { title: 'Revenue', value: `$${stats.expected_revenue.toFixed(2)}`, icon: Wallet },
    ];

    const statusCards = [
        { title: 'Active Societies', value: activeSocieties, icon: UserCheck },
        { title: 'Inactive Societies', value: inactiveSocieties, icon: UserX },
        { title: 'Active Subscriptions', value: stats.active_subscriptions, icon: Radio },
        { title: 'Paid Invoices', value: stats.paid_invoices, icon: CreditCard },
        { title: 'Configured Gateways', value: stats.gateways, icon: Wallet },
    ];

    const chartData = Object.entries(societiesByType)
        .filter(([type]) => type)
        .map(([type, count]) => ({ type, count }));

    const packageData = packageUsage.filter((row) => row.name);

    return (
        <>
            <Head title="Super Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Super Admin Dashboard"
                    description="Platform-wide overview across all societies"
                />

                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                    {cards.map(({ title, value, icon: Icon }) => (
                        <Card key={title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                                <Icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                    {statusCards.map(({ title, value, icon: Icon }) => (
                        <Card key={title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                                <Icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Society status</CardTitle>
                            <CardDescription>Active vs inactive societies.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="flex items-center gap-2 text-sm">
                                    <UserCheck className="size-4 text-green-600" />
                                    Active
                                </span>
                                <span className="text-lg font-bold">{activeSocieties}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="flex items-center gap-2 text-sm">
                                    <UserX className="size-4 text-muted-foreground" />
                                    Inactive
                                </span>
                                <span className="text-lg font-bold">{inactiveSocieties}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="flex items-center gap-2 text-sm">
                                    <Clock className="size-4 text-muted-foreground" />
                                    Offline Requests
                                </span>
                                <span className="text-lg font-bold">{stats.offline_requests}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Subscriptions</CardTitle>
                            <CardDescription>Active vs inactive plan subscriptions.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="flex items-center gap-2 text-sm">
                                    <Radio className="size-4 text-green-600" />
                                    Active
                                </span>
                                <span className="text-lg font-bold">{stats.active_subscriptions}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="flex items-center gap-2 text-sm">
                                    <UserX className="size-4 text-muted-foreground" />
                                    Inactive
                                </span>
                                <span className="text-lg font-bold">{stats.inactive_subscriptions}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending offline requests</CardTitle>
                            <CardDescription>Latest plan/page payment approvals.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {offlineRequests.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No pending offline requests.
                                </p>
                            ) : (
                                offlineRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {request.society?.name ?? `Society #${request.society_id}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {request.package_type} · {request.status}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold">
                                            {request.amount != null ? `$${request.amount}` : '—'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Societies by property type</CardTitle>
                            <CardDescription>Distribution across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No societies yet.</p>
                            ) : (
                                <ChartContainer config={{}} className="h-[200px] w-full">
                                    <BarChart data={chartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="type"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <Tooltip cursor={false} />
                                        <Bar
                                            dataKey="count"
                                            fill="#6366f1"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Package usage</CardTitle>
                            <CardDescription>Societies subscribed per package.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {packageData.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No packages yet.</p>
                            ) : (
                                <ChartContainer config={{}} className="h-[200px] w-full">
                                    <BarChart data={packageData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <Tooltip cursor={false} />
                                        <Bar
                                            dataKey="societies"
                                            fill="var(--chart-1)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent invoices</CardTitle>
                            <CardDescription>The latest global invoices raised.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentInvoices.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No invoices raised yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="pb-2 font-medium">Invoice</th>
                                                <th className="pb-2 font-medium">Society</th>
                                                <th className="pb-2 font-medium">Gateway</th>
                                                <th className="pb-2 font-medium">Amount</th>
                                                <th className="pb-2 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentInvoices.map((invoice) => (
                                                <tr key={invoice.id} className="border-b">
                                                    <td className="py-2 font-medium">
                                                        {invoice.invoice_id ?? `#${invoice.id}`}
                                                    </td>
                                                    <td className="py-2">
                                                        {invoice.society?.name ?? '—'}
                                                    </td>
                                                    <td className="py-2 capitalize">
                                                        {invoice.gateway_name ?? '—'}
                                                    </td>
                                                    <td className="py-2">
                                                        {invoice.amount != null
                                                            ? `$${invoice.amount}`
                                                            : '—'}
                                                    </td>
                                                    <td className="py-2 capitalize">
                                                        {invoice.status ?? '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="mt-2 lg:mt-0">
                        <CardHeader>
                            <CardTitle>Recent societies</CardTitle>
                            <CardDescription>The latest societies that have been provisioned.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentSocieties.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No societies provisioned yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="pb-2 font-medium">Name</th>
                                                <th className="pb-2 font-medium">Type</th>
                                                <th className="pb-2 font-medium">Users</th>
                                                <th className="pb-2 font-medium">Status</th>
                                                <th className="pb-2 font-medium">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentSocieties.map((society) => (
                                                <tr key={society.id} className="border-b">
                                                    <td className="py-2 font-medium">{society.name}</td>
                                                    <td className="py-2 capitalize">
                                                        {society.property_type ?? '—'}
                                                    </td>
                                                    <td className="py-2">{society.users_count}</td>
                                                    <td className="py-2">
                                                        <span
                                                            className={
                                                                society.is_active
                                                                    ? 'text-green-600'
                                                                    : 'text-muted-foreground'
                                                            }
                                                        >
                                                            {society.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 text-muted-foreground">
                                                        {new Date(society.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

SuperAdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Super Admin',
            href: dashboard(),
        },
    ],
};