import { Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import Heading from '@/components/heading';
import { DataTable } from '@/components/ui/data-table';
import { dashboard } from '@/routes';
import { index as auditLogsIndex } from '@/routes/audit-logs';
import type { ColumnDef } from '@tanstack/react-table';

interface AuditLogItem {
    id: number;
    action: string;
    changes: string | null;
    ip_address: string | null;
    created_at: string | null;
    user?: { id: number; name: string } | null;
}

export default function AuditLogsIndex({ logs }: { logs: AuditLogItem[] }) {
    const columns: ColumnDef<AuditLogItem>[] = [
        {
            accessorKey: 'created_at',
            header: 'Timestamp',
            cell: (info) => {
                const value = info.getValue() as string | null;
                return value ? new Date(value).toLocaleString() : '—';
            },
        },
        {
            accessorKey: 'user',
            header: 'User',
            cell: (info) => (info.getValue() as AuditLogItem['user'])?.name ?? 'System',
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: (info) => (
                <span className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    {info.getValue() as string}
                </span>
            ),
        },
        {
            accessorKey: 'ip_address',
            header: 'IP',
            cell: (info) => (info.getValue() as string | null) ?? '—',
        },
    ];

    return (
        <>
            <Head title="Audit Trail" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading title="Audit Trail" description="Trace critical actions across the platform for accountability." />
                <DataTable columns={columns} data={logs} searchKey="action" exportable exportFilename="audit-logs.csv" />
            </div>
        </>
    );
}

AuditLogsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Audit Trail', href: auditLogsIndex() },
    ],
};
