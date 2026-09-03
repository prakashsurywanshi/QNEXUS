import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, QrCode } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Preapproval {
    id: number;
    visitor_name: string;
    visitor_phone: string | null;
    status: string;
    expected_arrival: string | null;
    expires_at: string | null;
    qr_code: string;
    purpose: string | null;
    entry_type: string;
    user?: { id: number; name: string } | null;
    apartment?: { id: number; apartment_number: string } | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    expired: 'bg-muted text-muted-foreground',
};

export default function VisitorPreapprovalIndex({ preapprovals }: { preapprovals: Preapproval[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this preapproval?')) {
            deleteForm(`/visitor-preapprovals/${id}`);
        }
    };

    const columns: ColumnDef<Preapproval>[] = [
        {
            accessorKey: 'visitor_name',
            header: 'Visitor',
        },
        {
            accessorKey: 'visitor_phone',
            header: 'Phone',
        },
        {
            id: 'apartment',
            header: 'Apartment',
            cell: ({ row }) => row.original.apartment?.apartment_number ?? '—',
        },
        {
            id: 'requested_by',
            header: 'Requested By',
            cell: ({ row }) => row.original.user?.name ?? '—',
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
            accessorKey: 'expected_arrival',
            header: 'Expected',
            cell: ({ row }) => row.original.expected_arrival ? new Date(row.original.expected_arrival).toLocaleDateString() : '—',
        },
        {
            accessorKey: 'expires_at',
            header: 'Expires',
            cell: ({ row }) => row.original.expires_at ? new Date(row.original.expires_at).toLocaleDateString() : '—',
        },
        {
            accessorKey: 'qr_code',
            header: 'QR',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono text-xs">
                    <QrCode className="mr-1 size-3" />
                    {row.original.qr_code.slice(0, 8)}...
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Visitor Preapproval') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/visitor-preapprovals/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Visitor Preapproval') && (
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
            <Head title="Visitor Preapprovals" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Visitor Preapprovals"
                        description="Pre-approve expected visitors before they arrive"
                    />
                    {can('Create Visitor Preapproval') && (
                        <Button asChild size="sm">
                            <Link href="/visitor-preapprovals/create">
                                <Plus className="mr-1 size-4" />
                                New Preapproval
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={preapprovals}
                    searchKey="visitor_name"
                    searchPlaceholder="Search by visitor name..."
                />
            </div>
        </>
    );
}

VisitorPreapprovalIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Visitor Preapprovals', href: '/visitor-preapprovals' },
    ],
};
