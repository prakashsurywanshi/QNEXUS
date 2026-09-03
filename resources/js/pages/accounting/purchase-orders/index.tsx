import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface PurchaseOrder {
    id: number;
    po_number: string;
    po_date: string;
    total_amount: number;
    tax_amount: number;
    grand_total: number;
    status: string;
    vendor?: { name: string } | null;
}

const statusColors: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    ordered: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    partially_received: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    received: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function PurchaseOrderIndex({ purchaseOrders }: { purchaseOrders: PurchaseOrder[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this purchase order?')) {
            deleteForm(`/purchase-orders/${id}`);
        }
    };

    const columns: ColumnDef<PurchaseOrder>[] = [
        {
            accessorKey: 'po_number',
            header: 'PO #',
        },
        {
            accessorKey: 'po_date',
            header: 'Date',
            cell: ({ row }) => new Date(row.original.po_date).toLocaleDateString(),
        },
        {
            id: 'vendor',
            header: 'Vendor',
            cell: ({ row }) => row.original.vendor?.name ?? '—',
        },
        {
            accessorKey: 'total_amount',
            header: 'Total',
            cell: ({ row }) => Number(row.original.total_amount).toLocaleString(),
        },
        {
            accessorKey: 'tax_amount',
            header: 'Tax',
            cell: ({ row }) => Number(row.original.tax_amount).toLocaleString(),
        },
        {
            accessorKey: 'grand_total',
            header: 'Grand Total',
            cell: ({ row }) => Number(row.original.grand_total).toLocaleString(),
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
                    {can('Create Purchase Order') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/purchase-orders/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Purchase Order') && (
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
            <Head title="Purchase Orders" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Purchase Orders"
                        description="Manage purchase orders to vendors"
                    />
                    {can('Create Purchase Order') && (
                        <Button asChild size="sm">
                            <Link href="/purchase-orders/create">
                                <Plus className="mr-1 size-4" />
                                New Purchase Order
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={purchaseOrders}
                    searchKey="po_number"
                    searchPlaceholder="Search by PO number..."
                />
            </div>
        </>
    );
}

PurchaseOrderIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Purchase Orders', href: '/purchase-orders' },
    ],
};
