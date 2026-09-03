import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface MoveRecord {
    id: number;
    move_type: string;
    move_date: string;
    forwarding_address: string | null;
    deposit_amount: number | null;
    deposit_status: string | null;
    pending_dues: number | null;
    noc_status: string;
    noc_date: string | null;
    notes: string | null;
    user: { id: number; name: string } | null;
    apartment: { apartment_number: string } | null;
    noc_issuer: { id: number; name: string } | null;
}

const nocStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const depositStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    refunded: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    forfeited: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function MoveRecordIndex({ moveRecords }: { moveRecords: MoveRecord[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this move record?')) {
            deleteForm(`/move-records/${id}`);
        }
    };

    const columns: ColumnDef<MoveRecord>[] = [
        {
            id: 'user',
            header: 'Resident',
            cell: ({ row }) => row.original.user?.name ?? '—',
        },
        {
            id: 'apartment',
            header: 'Apartment',
            cell: ({ row }) => row.original.apartment?.apartment_number ?? '—',
        },
        {
            accessorKey: 'move_type',
            header: 'Type',
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.move_type === 'in' ? 'Move In' : 'Move Out'}
                </Badge>
            ),
        },
        {
            accessorKey: 'move_date',
            header: 'Move Date',
            cell: ({ row }) => row.original.move_date ? new Date(row.original.move_date).toLocaleDateString() : '—',
        },
        {
            accessorKey: 'noc_status',
            header: 'NOC',
            cell: ({ row }) => (
                <Badge variant="outline" className={nocStatusColors[row.original.noc_status] ?? ''}>
                    {row.original.noc_status}
                </Badge>
            ),
        },
        {
            accessorKey: 'deposit_status',
            header: 'Deposit',
            cell: ({ row }) => row.original.deposit_status ? (
                <Badge variant="outline" className={depositStatusColors[row.original.deposit_status] ?? ''}>
                    {row.original.deposit_status}
                </Badge>
            ) : '—',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Move Record') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/move-records/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Move Record') && (
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
            <Head title="Move Records" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Move Records"
                        description="Track resident move-in and move-out records"
                    />
                    {can('Create Move Record') && (
                        <Button asChild size="sm">
                            <Link href="/move-records/create">
                                <Plus className="mr-1 size-4" />
                                New Move Record
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={moveRecords}
                    searchKey="notes"
                    searchPlaceholder="Search by notes..."
                />
            </div>
        </>
    );
}

MoveRecordIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Move Records', href: '/move-records' },
    ],
};
