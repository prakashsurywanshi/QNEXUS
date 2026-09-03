import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface BoomBarrierLog {
    id: number;
    gate_name: string;
    vehicle_number: string | null;
    direction: string;
    barrier_type: string;
    trigger_method: string;
    triggered_by: number | null;
    is_visitor: boolean;
    visitor_preapproval_id: number | null;
    opened_at: string;
    closed_at: string | null;
    triggered_by_user: { id: number; name: string } | null;
}

const directionColors: Record<string, string> = {
    in: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    out: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function BoomBarrierLogIndex({ logs }: { logs: BoomBarrierLog[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this log entry?')) {
            deleteForm(`/boom-barrier-logs/${id}`);
        }
    };

    const columns: ColumnDef<BoomBarrierLog>[] = [
        {
            accessorKey: 'gate_name',
            header: 'Gate',
        },
        {
            accessorKey: 'vehicle_number',
            header: 'Vehicle',
            cell: ({ row }) => row.original.vehicle_number ?? '—',
        },
        {
            accessorKey: 'direction',
            header: 'Direction',
            cell: ({ row }) => (
                <Badge variant="outline" className={directionColors[row.original.direction] ?? ''}>
                    {row.original.direction.toUpperCase()}
                </Badge>
            ),
        },
        {
            accessorKey: 'barrier_type',
            header: 'Type',
            cell: ({ row }) => row.original.barrier_type,
        },
        {
            accessorKey: 'trigger_method',
            header: 'Trigger',
            cell: ({ row }) => row.original.trigger_method.replace(/_/g, ' '),
        },
        {
            id: 'triggered_by',
            header: 'Triggered By',
            cell: ({ row }) => row.original.triggered_by_user?.name ?? '—',
        },
        {
            accessorKey: 'is_visitor',
            header: 'Visitor',
            cell: ({ row }) => row.original.is_visitor ? 'Yes' : 'No',
        },
        {
            accessorKey: 'opened_at',
            header: 'Opened At',
            cell: ({ row }) => row.original.opened_at ? new Date(row.original.opened_at).toLocaleString() : '—',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Boom Barrier') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/boom-barrier-logs/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Boom Barrier') && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Boom Barrier Logs" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Boom Barrier Logs"
                        description="Track boom barrier entry and exit logs"
                    />
                    {can('Create Boom Barrier') && (
                        <Button asChild size="sm">
                            <Link href="/boom-barrier-logs/create">
                                <Plus className="mr-1 size-4" />
                                New Log Entry
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={logs}
                    searchKey="vehicle_number"
                    searchPlaceholder="Search by vehicle number..."
                />
            </div>
        </>
    );
}

BoomBarrierLogIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Boom Barrier Logs', href: '/boom-barrier-logs' },
    ],
};
