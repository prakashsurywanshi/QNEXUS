import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Gauge, Zap, Coins } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { StatCard } from '@/components/ui/stat-card';

interface MeterRow {
    id: number;
    meter_number: string | null;
    meter_type: string;
    is_active: boolean;
    apartment: { id: number; apartment_number: string } | null;
    current_reading: number;
    units_consumed: number;
    balance: number;
    last_reading_date: string | null;
    low_credit: boolean;
}

interface Totals {
    total_meters: number;
    total_usage: number;
    total_topups: number;
    low_credit: number;
    inactive: number;
}

const rupee = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function EnergyIndex({
    meters,
    totals,
}: {
    meters: MeterRow[];
    totals: Totals;
}) {
    const columns: ColumnDef<MeterRow>[] = [
        {
            accessorKey: 'meter_number',
            header: 'Meter No.',
            cell: ({ row }) => row.original.meter_number ?? '—',
        },
        {
            accessorKey: 'meter_type',
            header: 'Type',
            cell: ({ row }) => row.original.meter_type || '—',
        },
        {
            id: 'apartment',
            header: 'Apartment',
            cell: ({ row }) => row.original.apartment?.apartment_number ?? '—',
        },
        {
            accessorKey: 'current_reading',
            header: 'Current Reading',
            cell: ({ row }) => row.original.current_reading.toLocaleString('en-IN'),
        },
        {
            accessorKey: 'units_consumed',
            header: 'Units Consumed',
            cell: ({ row }) => row.original.units_consumed.toLocaleString('en-IN'),
        },
        {
            accessorKey: 'balance',
            header: 'Balance',
            cell: ({ row }) => (
                <span className={row.original.low_credit ? 'font-semibold text-destructive' : ''}>
                    {rupee(row.original.balance)}
                </span>
            ),
        },
        {
            accessorKey: 'low_credit',
            header: 'Status',
            cell: ({ row }) => {
                if (!row.original.is_active) return <Badge variant="outline">Inactive</Badge>;
                if (row.original.low_credit) return <Badge variant="destructive">Low Credit</Badge>;
                return <Badge className="bg-emerald-500 text-white">Active</Badge>;
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/energy/${row.original.id}/topups`}>Topups</Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Energy" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Heading
                    variant="small"
                    title="Energy & Smart Meters"
                    description="Monitor meter balances, consumption and prepaid recharges"
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Meters" value={totals.total_meters} icon={Gauge} hint={`${totals.inactive} inactive`} />
                    <StatCard title="Units Consumed" value={totals.total_usage.toLocaleString('en-IN')} icon={Zap} hint="Total consumption" />
                    <StatCard title="Total Recharges" value={rupee(totals.total_topups)} icon={Coins} tone="success" />
                    <StatCard
                        title="Low Credit"
                        value={totals.low_credit}
                        icon={AlertTriangle}
                        tone={totals.low_credit > 0 ? 'warning' : 'success'}
                        hint="Meters below ₹500"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Meters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={meters} searchKey="meter_number" searchPlaceholder="Search by meter number..." />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EnergyIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Energy', href: '/energy' },
    ],
};
