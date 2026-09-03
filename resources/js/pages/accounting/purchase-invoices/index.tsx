import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface PurchaseInvoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    paid_amount: number;
    status: string;
    due_date: string | null;
    vendor?: { name: string } | null;
    purchase_order?: { po_number: string } | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    partially_paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-muted text-muted-foreground',
};

export default function PurchaseInvoiceIndex({ invoices }: { invoices: PurchaseInvoice[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this invoice?')) {
            deleteForm(`/purchase-invoices/${id}`);
        }
    };

    const columns: ColumnDef<PurchaseInvoice>[] = [
        {
            accessorKey: 'invoice_number',
            header: 'Invoice #',
        },
        {
            accessorKey: 'invoice_date',
            header: 'Date',
            cell: ({ row }) => new Date(row.original.invoice_date).toLocaleDateString(),
        },
        {
            id: 'vendor',
            header: 'Vendor',
            cell: ({ row }) => row.original.vendor?.name ?? '—',
        },
        {
            id: 'purchase_order',
            header: 'PO',
            cell: ({ row }) => row.original.purchase_order?.po_number ?? '—',
        },
        {
            accessorKey: 'subtotal',
            header: 'Subtotal',
            cell: ({ row }) => Number(row.original.subtotal).toLocaleString(),
        },
        {
            accessorKey: 'tax_amount',
            header: 'Tax',
            cell: ({ row }) => Number(row.original.tax_amount).toLocaleString(),
        },
        {
            accessorKey: 'total_amount',
            header: 'Total',
            cell: ({ row }) => Number(row.original.total_amount).toLocaleString(),
        },
        {
            accessorKey: 'paid_amount',
            header: 'Paid',
            cell: ({ row }) => Number(row.original.paid_amount).toLocaleString(),
        },
        {
            accessorKey: 'due_date',
            header: 'Due Date',
            cell: ({ row }) => (row.original.due_date ? new Date(row.original.due_date).toLocaleDateString() : '—'),
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
                    {can('Create Purchase Invoice') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/purchase-invoices/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Purchase Invoice') && (
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
            <Head title="Purchase Invoices" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Purchase Invoices"
                        description="Manage vendor purchase invoices"
                    />
                    {can('Create Purchase Invoice') && (
                        <Button asChild size="sm">
                            <Link href="/purchase-invoices/create">
                                <Plus className="mr-1 size-4" />
                                New Invoice
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={invoices}
                    searchKey="invoice_number"
                    searchPlaceholder="Search by invoice number..."
                />
            </div>
        </>
    );
}

PurchaseInvoiceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Purchase Invoices', href: '/purchase-invoices' },
    ],
};
