import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface FixedDeposit {
    id: number;
    bank_name: string;
    fd_number: string;
    amount: string;
    interest_rate: string;
    start_date: string | null;
    maturity_date: string | null;
    status: string;
    renewal_action: string | null;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    matured: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    renewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    losed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function FixedDepositIndex({ deposits }: { deposits: FixedDeposit[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this fixed deposit?')) {
            deleteForm(`/fixed-deposits/${id}`);
        }
    };

    const columns: ColumnDef<FixedDeposit>[] = [
        {
            accessorKey: 'fd_number',
            header: 'FD Number',
        },
        {
            accessorKey: 'bank_name',
            header: 'Bank',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `₹${Number(row.original.amount).toLocaleString()}`,
        },
        {
            accessorKey: 'interest_rate',
            header: 'Rate',
            cell: ({ row }) => `${row.original.interest_rate}%`,
        },
        {
            accessorKey: 'start_date',
            header: 'Start',
            cell: ({ row }) => (row.original.start_date ? new Date(row.original.start_date).toLocaleDateString() : '—'),
        },
        {
            accessorKey: 'maturity_date',
            header: 'Maturity',
            cell: ({ row }) => (row.original.maturity_date ? new Date(row.original.maturity_date).toLocaleDateString() : '—'),
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
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Fixed Deposit') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/fixed-deposits/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Fixed Deposit') && (
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
            <Head title="Fixed Deposits" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Fixed Deposits"
                        description="Track society term deposits and maturity dates"
                    />
                    {can('Create Fixed Deposit') && (
                        <Button asChild size="sm">
                            <Link href="/fixed-deposits/create">
                                <Plus className="mr-1 size-4" />
                                New Fixed Deposit
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={deposits}
                    searchKey="fd_number"
                    searchPlaceholder="Search by FD number..."
                />
            </div>
        </>
    );
}

FixedDepositIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Fixed Deposits', href: '/fixed-deposits' },
    ],
};
