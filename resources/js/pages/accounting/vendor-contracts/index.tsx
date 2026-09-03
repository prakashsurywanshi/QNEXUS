import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Contract {
    id: number;
    contract_number: string;
    title: string;
    description: string | null;
    contract_value: number;
    start_date: string;
    end_date: string | null;
    status: string;
    payment_terms: string | null;
    auto_renew: boolean;
    vendor?: { name: string } | null;
}

const statusColors: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    expired: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    terminated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function VendorContractIndex({ contracts }: { contracts: Contract[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this contract?')) {
            deleteForm(`/vendor-contracts/${id}`);
        }
    };

    const columns: ColumnDef<Contract>[] = [
        {
            accessorKey: 'contract_number',
            header: 'Contract #',
        },
        {
            accessorKey: 'title',
            header: 'Title',
        },
        {
            id: 'vendor',
            header: 'Vendor',
            cell: ({ row }) => row.original.vendor?.name ?? '—',
        },
        {
            accessorKey: 'contract_value',
            header: 'Value',
            cell: ({ row }) => Number(row.original.contract_value).toLocaleString(),
        },
        {
            accessorKey: 'start_date',
            header: 'Start Date',
            cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString(),
        },
        {
            accessorKey: 'end_date',
            header: 'End Date',
            cell: ({ row }) => (row.original.end_date ? new Date(row.original.end_date).toLocaleDateString() : '—'),
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
            accessorKey: 'auto_renew',
            header: 'Auto Renew',
            cell: ({ row }) =>
                row.original.auto_renew ? (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Yes
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                        No
                    </Badge>
                ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Vendor Contract') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/vendor-contracts/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Vendor Contract') && (
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
            <Head title="Vendor Contracts" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Vendor Contracts"
                        description="Manage vendor contracts"
                    />
                    {can('Create Vendor Contract') && (
                        <Button asChild size="sm">
                            <Link href="/vendor-contracts/create">
                                <Plus className="mr-1 size-4" />
                                New Contract
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={contracts}
                    searchKey="contract_number"
                    searchPlaceholder="Search by contract number..."
                />
            </div>
        </>
    );
}

VendorContractIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Vendor Contracts', href: '/vendor-contracts' },
    ],
};
