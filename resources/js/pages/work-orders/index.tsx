import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Wrench } from 'lucide-react';
import DeleteDialog from '@/components/delete-dialog';
import PageHeader from '@/components/page-header';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import { dashboard } from '@/routes';
import { index as workOrdersIndex } from '@/routes/work-orders';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

interface WorkOrder {
    id: number;
    title: string;
    priority: string;
    status: string;
    due_date: string | null;
    asset?: { id: number; name: string } | null;
    assignee?: { id: number; name: string } | null;
    creator?: { id: number; name: string } | null;
}

const priorityTones: Record<string, 'default' | 'info' | 'warning' | 'danger'> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    urgent: 'danger',
};

export default function WorkOrdersIndex({ workOrders }: { workOrders: WorkOrder[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);

    const handleDelete = () => {
        if (pendingDelete === null) return;
        deleteForm(`/work-orders/${pendingDelete}`, {
            onSuccess: () => setPendingDelete(null),
        });
    };

    const columns: ColumnDef<WorkOrder>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: (info) => <span className="font-mono text-muted-foreground">WO-{String(info.getValue())}</span>,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: (info) => (
                <Link href={`/work-orders/${info.row.original.id}/edit`} className="font-medium hover:underline">
                    {info.getValue() as string}
                </Link>
            ),
        },
        {
            accessorKey: 'asset',
            header: 'Asset',
            cell: (info) => (info.getValue() as WorkOrder['asset'])?.name ?? '—',
        },
        {
            accessorKey: 'assignee',
            header: 'Assigned To',
            cell: (info) => (info.getValue() as WorkOrder['assignee'])?.name ?? 'Unassigned',
        },
        {
            accessorKey: 'priority',
            header: 'Priority',
            cell: (info) => {
                const priority = (info.getValue() as string) ?? 'medium';
                return (
                    <StatusBadge tone={priorityTones[priority] ?? 'default'} status={priority}>
                        {priority}
                    </StatusBadge>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => {
                const status = (info.getValue() as string) ?? 'open';
                return <StatusBadge status={status}>{status.replace('_', ' ')}</StatusBadge>;
            },
        },
        {
            accessorKey: 'due_date',
            header: 'Due Date',
            cell: (info) => {
                const date = info.getValue() as string | null;
                return date ? new Date(date).toLocaleDateString() : '—';
            },
        },
        {
            id: 'actions',
            header: '',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Link href={`/work-orders/${info.row.original.id}/edit`} className="text-sm text-primary hover:underline">
                        Edit
                    </Link>
                    {can('Delete Work Orders') && (
                        <Button variant="ghost" size="sm" onClick={() => setPendingDelete(info.row.original.id)} className="text-destructive hover:text-destructive">
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Work Orders" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <PageHeader
                    title="Work Orders"
                    description="Track and manage maintenance work orders."
                    icon={<Wrench className="size-5" />}
                    actions={
                        can('Create Work Orders') && (
                            <Link href="/work-orders/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    New Work Order
                                </Button>
                            </Link>
                        )
                    }
                />

                <DataTable
                    columns={columns}
                    data={workOrders}
                    searchKey="title"
                    emptyTitle="No work orders"
                    emptyDescription="Create a work order to start tracking maintenance tasks."
                    emptyIcon={Wrench}
                    exportable
                    exportFilename="work-orders.csv"
                />

                <DeleteDialog
                    trigger={null}
                    open={pendingDelete !== null}
                    onOpenChange={(open) => !open && setPendingDelete(null)}
                    onConfirm={handleDelete}
                    description="This work order will be permanently deleted."
                />
            </div>
        </>
    );
}

WorkOrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Work Orders', href: workOrdersIndex() },
    ],
};
