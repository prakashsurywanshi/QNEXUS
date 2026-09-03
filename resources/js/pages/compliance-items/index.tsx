import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface ComplianceItem {
    id: number;
    category: string;
    item_name: string;
    description: string | null;
    due_date: string | null;
    status: string;
    last_completed: string | null;
    next_due: string | null;
    assigned_to: number | null;
    assignee: { id: number; name: string } | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function ComplianceItemIndex({ complianceItems }: { complianceItems: ComplianceItem[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this compliance item?')) {
            deleteForm(`/compliance-items/${id}`);
        }
    };

    const columns: ColumnDef<ComplianceItem>[] = [
        {
            accessorKey: 'item_name',
            header: 'Item',
        },
        {
            accessorKey: 'category',
            header: 'Category',
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
            accessorKey: 'due_date',
            header: 'Due Date',
            cell: ({ row }) => row.original.due_date ? new Date(row.original.due_date).toLocaleDateString() : '—',
        },
        {
            id: 'assigned_to',
            header: 'Assigned To',
            cell: ({ row }) => row.original.assignee?.name ?? '—',
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <span className="line-clamp-1 max-w-[200px]">{row.original.description ?? '—'}</span>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Compliance') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/compliance-items/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Compliance') && (
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
            <Head title="Compliance Items" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Compliance Items"
                        description="Track and manage compliance tasks"
                    />
                    {can('Create Compliance') && (
                        <Button asChild size="sm">
                            <Link href="/compliance-items/create">
                                <Plus className="mr-1 size-4" />
                                New Compliance Item
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={complianceItems}
                    searchKey="item_name"
                    searchPlaceholder="Search by item name..."
                />
            </div>
        </>
    );
}

ComplianceItemIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Compliance Items', href: '/compliance-items' },
    ],
};
