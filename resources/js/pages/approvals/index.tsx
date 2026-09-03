import { Head, Link, router, useForm } from '@inertiajs/react';
import { Check, Plus, X } from 'lucide-react';
import DeleteDialog from '@/components/delete-dialog';
import Heading from '@/components/heading';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import { dashboard } from '@/routes';
import { index as approvalsIndex } from '@/routes/approvals';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

interface ApprovalStepItem {
    id: number;
    step_number: number;
    title: string;
    description: string | null;
    status: string;
    decision_notes: string | null;
    assignee?: { id: number; name: string } | null;
    decided_by?: { id: number; name: string } | null;
}

interface ApprovalItem {
    id: number;
    type: string;
    title: string;
    description: string | null;
    status: string;
    decision_notes: string | null;
    requester?: { id: number; name: string } | null;
    approver?: { id: number; name: string } | null;
    steps: ApprovalStepItem[];
}

export default function ApprovalsIndex({ approvals }: { approvals: ApprovalItem[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [expanded, setExpanded] = useState<number | null>(null);

    const decideStep = (approvalId: number, stepId: number, decision: string) => {
        const notes = prompt('Add decision notes (optional):') || '';
        router.patch(`/approvals/${approvalId}/steps/${stepId}/decide`, { decision, notes });
    };

    const handleDelete = () => {
        if (pendingDelete === null) return;
        deleteForm(`/approvals/${pendingDelete}`, {
            onSuccess: () => setPendingDelete(null),
        });
    };

    const columns: ColumnDef<ApprovalItem>[] = [
        {
            accessorKey: 'type',
            header: 'Type',
            cell: (info) => <span className="capitalize">{info.getValue() as string}</span>,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
        },
        {
            accessorKey: 'requester',
            header: 'Requested By',
            cell: (info) => (info.getValue() as ApprovalItem['requester'])?.name ?? '—',
        },
        {
            accessorKey: 'steps',
            header: 'Progress',
            cell: (info) => {
                const steps = info.getValue() as ApprovalStepItem[];
                if (!steps?.length) return <span className="text-xs text-muted-foreground">Single</span>;
                const done = steps.filter((s) => s.status === 'approved').length;
                return (
                    <span className="text-xs text-muted-foreground">
                        {done}/{steps.length} steps
                    </span>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => {
                const status = (info.getValue() as string) ?? 'pending';
                return <StatusBadge status={status}>{status}</StatusBadge>;
            },
        },
        {
            id: 'actions',
            header: '',
            cell: (info) => {
                const row = info.row.original;
                if (row.status !== 'pending') {
                    return (
                        <div className="flex items-center gap-2">
                            {row.decision_notes && <span className="text-xs text-muted-foreground">{row.decision_notes}</span>}
                            {can('Delete Approval') && (
                                <Button variant="ghost" size="sm" onClick={() => setPendingDelete(row.id)} className="text-destructive">
                                    Delete
                                </Button>
                            )}
                        </div>
                    );
                }
                const hasSteps = row.steps?.length > 0;
                return (
                    <div className="flex items-center gap-1">
                        {hasSteps && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                            >
                                Steps
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            disabled={!hasSteps}
                            onClick={() => decideStep(row.id, row.steps.find((s) => s.status === 'in_progress')?.id ?? row.steps[0].id, 'approved')}
                        >
                            <Check className="size-4" />
                            Approve
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            disabled={!hasSteps}
                            onClick={() => decideStep(row.id, row.steps.find((s) => s.status === 'in_progress')?.id ?? row.steps[0].id, 'rejected')}
                        >
                            <X className="size-4" />
                            Reject
                        </Button>
                        {can('Delete Approval') && (
                            <Button variant="ghost" size="sm" onClick={() => setPendingDelete(row.id)} className="text-destructive">
                                Delete
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Approvals" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Approvals" description="Review and decide on pending approval requests." />
                    {can('Create Approval') && (
                        <Link href="/approvals/create">
                            <Button>
                                <Plus className="mr-2 size-4" />
                                New Request
                            </Button>
                        </Link>
                    )}
                </div>

                {expanded !== null && (() => {
                    const row = approvals.find((a) => a.id === expanded);
                    if (!row) return null;
                    return (
                        <div className="rounded-lg border p-4">
                            <p className="text-sm font-medium">{row.title}</p>
                            <div className="mt-3 flex flex-col gap-2">
                                {row.steps.map((step) => (
                                    <div key={step.id} className="flex items-center justify-between rounded-md border p-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">#{step.step_number}</span>
                                            <span className="text-sm font-medium">{step.title}</span>
                                            {step.description && (
                                                <span className="text-xs text-muted-foreground">{step.description}</span>
                                            )}
                                            {step.assignee && (
                                                <span className="text-xs text-muted-foreground">→ {step.assignee.name}</span>
                                            )}
                                        </div>
                                        <StatusBadge status={step.status}>{step.status}</StatusBadge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                <DataTable columns={columns} data={approvals} searchKey="title" emptyTitle="No approvals" emptyDescription="Approval requests raised for your society will appear here." emptyIcon={Check} exportable exportFilename="approvals.csv" />

                <DeleteDialog
                    trigger={null}
                    open={pendingDelete !== null}
                    onOpenChange={(open) => !open && setPendingDelete(null)}
                    onConfirm={handleDelete}
                    description="This approval request will be permanently deleted."
                />
            </div>
        </>
    );
}

ApprovalsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Approvals', href: approvalsIndex() },
    ],
};
