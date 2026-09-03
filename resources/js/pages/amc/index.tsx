import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Wrench } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import { dashboard } from '@/routes';
import { index as amcIndex } from '@/routes/amc';
import type { ColumnDef } from '@tanstack/react-table';

interface Amc {
    id: number;
    reference_no: string | null;
    service_name: string | null;
    start_date: string | null;
    end_date: string | null;
    cost: string | number | null;
    frequency: string;
    status: string;
    asset?: { id: number; name: string } | null;
    vendor?: { id: number; name: string } | null;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-muted text-muted-foreground',
};

const frequencyLabels: Record<string, string> = {
    one_time: 'One Time',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    half_yearly: 'Half Yearly',
    yearly: 'Yearly',
};

export default function AmcIndex({ amcs }: { amcs: Amc[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this AMC?')) {
            deleteForm(`/amc/${id}`);
        }
    };

    const columns: ColumnDef<Amc>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: (info) => <span className="font-mono text-muted-foreground">AMC-{String(info.getValue())}</span>,
        },
        {
            accessorKey: 'service_name',
            header: 'Service',
            cell: (info) => (
                <Link href={`/amc/${info.row.original.id}/edit`} className="font-medium hover:underline">
                    {info.getValue() as string}
                </Link>
            ),
        },
        {
            accessorKey: 'asset',
            header: 'Asset',
            cell: (info) => (info.getValue() as Amc['asset'])?.name ?? '—',
        },
        {
            accessorKey: 'vendor',
            header: 'Vendor',
            cell: (info) => (info.getValue() as Amc['vendor'])?.name ?? '—',
        },
        {
            accessorKey: 'cost',
            header: 'Cost',
            cell: (info) => {
                const cost = info.getValue() as string | number | null;
                return cost === null ? '—' : `₹${Number(cost).toLocaleString()}`;
            },
        },
        {
            accessorKey: 'frequency',
            header: 'Frequency',
            cell: (info) => {
                const freq = (info.getValue() as string) ?? 'yearly';
                return <span className="capitalize">{frequencyLabels[freq] ?? freq}</span>;
            },
        },
        {
            accessorKey: 'end_date',
            header: 'End Date',
            cell: (info) => {
                const date = info.getValue() as string | null;
                return date ? new Date(date).toLocaleDateString() : '—';
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => {
                const status = (info.getValue() as string) ?? 'active';
                return (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[status] ?? ''}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: '',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Link href={`/amc/${info.row.original.id}/edit`} className="text-sm text-primary hover:underline">
                        Edit
                    </Link>
                    {can('Delete AMC') && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(info.row.original.id)} className="text-destructive hover:text-destructive">
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="AMC Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="AMC Management" description="Manage annual maintenance contracts for assets and vendors." />
                    {can('Create AMC') && (
                        <Link href="/amc/create">
                            <Button>
                                <Plus className="mr-2 size-4" />
                                New AMC
                            </Button>
                        </Link>
                    )}
                </div>

                <DataTable columns={columns} data={amcs} searchKey="service_name" exportable exportFilename="amc.csv" />
            </div>
        </>
    );
}

AmcIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'AMC Management', href: amcIndex() },
    ],
};
