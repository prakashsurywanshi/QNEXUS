import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface VendorPayment {
    id: number;
    amount: number;
    payment_date: string;
    payment_method: string;
    transaction_id: string | null;
    tds_amount: number | null;
    net_amount: number;
    invoice_number: string | null;
    status: string;
    notes: string | null;
    vendor?: { name: string } | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function VendorPaymentIndex({ payments }: { payments: VendorPayment[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this payment?')) {
            deleteForm(`/vendor-payments/${id}`);
        }
    };

    const columns: ColumnDef<VendorPayment>[] = [
        {
            id: 'vendor',
            header: 'Vendor',
            cell: ({ row }) => row.original.vendor?.name ?? '—',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => Number(row.original.amount).toLocaleString(),
        },
        {
            accessorKey: 'payment_date',
            header: 'Payment Date',
            cell: ({ row }) => new Date(row.original.payment_date).toLocaleDateString(),
        },
        {
            accessorKey: 'payment_method',
            header: 'Method',
        },
        {
            accessorKey: 'transaction_id',
            header: 'Transaction ID',
            cell: ({ row }) => row.original.transaction_id ?? '—',
        },
        {
            accessorKey: 'tds_amount',
            header: 'TDS',
            cell: ({ row }) => (row.original.tds_amount != null ? Number(row.original.tds_amount).toLocaleString() : '—'),
        },
        {
            accessorKey: 'net_amount',
            header: 'Net Amount',
            cell: ({ row }) => Number(row.original.net_amount).toLocaleString(),
        },
        {
            accessorKey: 'invoice_number',
            header: 'Invoice',
            cell: ({ row }) => row.original.invoice_number ?? '—',
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
                    {can('Create Vendor Payment') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/vendor-payments/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Vendor Payment') && (
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
            <Head title="Vendor Payments" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Vendor Payments"
                        description="Manage payments made to vendors"
                    />
                    {can('Create Vendor Payment') && (
                        <Button asChild size="sm">
                            <Link href="/vendor-payments/create">
                                <Plus className="mr-1 size-4" />
                                New Payment
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={payments}
                    searchKey="vendor"
                    searchPlaceholder="Search by vendor..."
                />
            </div>
        </>
    );
}

VendorPaymentIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Vendor Payments', href: '/vendor-payments' },
    ],
};
