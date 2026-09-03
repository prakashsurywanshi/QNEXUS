import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface CreditNote {
    id: number;
    credit_number: string;
    amount: number;
    reason: string | null;
    applied_to_invoice: string | null;
    status: string;
    apartment?: { apartment_number: string } | null;
    creator?: { name: string } | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    applied: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function CreditNoteIndex({ creditNotes }: { creditNotes: CreditNote[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this credit note?')) {
            deleteForm(`/credit-notes/${id}`);
        }
    };

    const columns: ColumnDef<CreditNote>[] = [
        {
            accessorKey: 'credit_number',
            header: 'Credit #',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => Number(row.original.amount).toLocaleString(),
        },
        {
            accessorKey: 'reason',
            header: 'Reason',
            cell: ({ row }) => row.original.reason ?? '—',
        },
        {
            accessorKey: 'applied_to_invoice',
            header: 'Applied To',
            cell: ({ row }) => row.original.applied_to_invoice ?? '—',
        },
        {
            id: 'apartment',
            header: 'Apartment',
            cell: ({ row }) => row.original.apartment?.apartment_number ?? '—',
        },
        {
            id: 'creator',
            header: 'Created By',
            cell: ({ row }) => row.original.creator?.name ?? '—',
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
                    {can('Create Credit Note') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/credit-notes/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Credit Note') && (
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
            <Head title="Credit Notes" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Credit Notes"
                        description="Manage credit notes issued to apartments"
                    />
                    {can('Create Credit Note') && (
                        <Button asChild size="sm">
                            <Link href="/credit-notes/create">
                                <Plus className="mr-1 size-4" />
                                New Credit Note
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={creditNotes}
                    searchKey="credit_number"
                    searchPlaceholder="Search by credit number..."
                />
            </div>
        </>
    );
}

CreditNoteIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Credit Notes', href: '/credit-notes' },
    ],
};
