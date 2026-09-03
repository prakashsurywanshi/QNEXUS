import { Head, Link, useForm } from '@inertiajs/react';
import { Download, LifeBuoy, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef, Row } from '@tanstack/react-table';

interface Ticket {
    id: number;
    ticket_number: number | null;
    subject: string | null;
    status: 'open' | 'pending' | 'resolved' | 'closed';
    user?: { id: number; name: string } | null;
    ticketType?: { id: number; type_name: string } | null;
}

const statusTones: Record<Ticket['status'], string> = {
    open: 'text-amber-600',
    pending: 'text-orange-600',
    resolved: 'text-green-600',
    closed: 'text-muted-foreground',
};

const exportTicket = (row: Row<Ticket>) => {
    const t = row.original;
    const csv = [
        ['ID', 'Subject', 'Status', 'Reported by', 'Type'],
        [`#${t.ticket_number ?? t.id}`, t.subject ?? 'Untitled', t.status, t.user?.name ?? '', t.ticketType?.type_name ?? ''],
    ]
        .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tickets.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export default function TicketsIndex({ tickets }: { tickets: Ticket[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this ticket?')) {
            deleteForm(`/tickets/${id}`);
        }
    };

    const columns: ColumnDef<Ticket>[] = [
        {
            accessorKey: 'ticket_number',
            header: 'ID',
            cell: (info) => (info.getValue() ? `#${info.getValue()}` : `#T${info.row.original.id}`),
        },
        {
            accessorKey: 'subject',
            header: 'Subject',
            cell: (info) => (
                <Link href={`/tickets/${info.row.original.id}`} className="font-medium hover:underline">
                    {(info.getValue() as string | null) ?? 'Untitled'}
                </Link>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: (info) => (
                <span className={`capitalize ${statusTones[info.row.original.status]}`}>
                    {info.getValue() as string}
                </span>
            ),
        },
        {
            accessorKey: 'user.name',
            header: 'Reported by',
            cell: (info) => info.row.original.user?.name ?? '—',
        },
        {
            accessorKey: 'ticketType.type_name',
            header: 'Type',
            cell: (info) => info.row.original.ticketType?.type_name ?? '—',
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/tickets/${info.row.original.id}`}>View</Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(info.row.original.id)}
                        disabled={!can('Delete Tickets')}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Tickets" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LifeBuoy className="size-5 text-muted-foreground" />
                        <h1 className="text-xl font-semibold">Tickets</h1>
                    </div>
                    {can('Create Tickets') && (
                        <Button asChild size="sm">
                            <Link href="/tickets/create">
                                <Plus /> New Ticket
                            </Link>
                        </Button>
                    )}
                </div>
                <DataTable
                    columns={columns}
                    data={tickets}
                    searchKey="subject"
                    searchPlaceholder="Search tickets..."
                    selectable
                    getRowId={(row) => String(row.id)}
                    bulkActions={(rows) => (
                        <Button size="sm" variant="outline" onClick={() => rows.forEach(exportTicket)}>
                            <Download className="mr-2 size-4" />
                            Export selected
                        </Button>
                    )}
                />
            </div>
        </>
    );
}