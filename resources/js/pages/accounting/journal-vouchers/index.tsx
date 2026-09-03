import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Voucher {
    id: number;
    voucher_number: string;
    date: string;
    description: string | null;
    total_debit: number;
    total_credit: number;
    status: string;
    creator?: { id: number; name: string } | null;
}

const statusColors: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function JournalVoucherIndex({ vouchers }: { vouchers: Voucher[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this voucher?')) {
            deleteForm(`/journal-vouchers/${id}`);
        }
    };

    const columns: ColumnDef<Voucher>[] = [
        {
            accessorKey: 'voucher_number',
            header: 'Voucher #',
        },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => row.original.description ?? '—',
        },
        {
            accessorKey: 'total_debit',
            header: 'Total Debit',
            cell: ({ row }) => Number(row.original.total_debit).toLocaleString(),
        },
        {
            accessorKey: 'total_credit',
            header: 'Total Credit',
            cell: ({ row }) => Number(row.original.total_credit).toLocaleString(),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant="outline" className={statusColors[row.original.status] ?? ''}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: 'creator',
            header: 'Created By',
            cell: ({ row }) => row.original.creator?.name ?? '—',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Journal Voucher') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/journal-vouchers/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Journal Voucher') && (
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
            <Head title="Journal Vouchers" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Journal Vouchers"
                        description="Manage journal voucher entries"
                    />
                    {can('Create Journal Voucher') && (
                        <Button asChild size="sm">
                            <Link href="/journal-vouchers/create">
                                <Plus className="mr-1 size-4" />
                                New Voucher
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={vouchers}
                    searchKey="voucher_number"
                    searchPlaceholder="Search by voucher number..."
                />
            </div>
        </>
    );
}

JournalVoucherIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Journal Vouchers', href: '/journal-vouchers' },
    ],
};
