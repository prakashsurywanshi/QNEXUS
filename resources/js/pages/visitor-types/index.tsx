import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface VisitorType {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
}

export default function VisitorTypeIndex({ types }: { types: VisitorType[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this visitor type?')) {
            deleteForm(`/visitor-types/${id}`);
        }
    };

    const columns: ColumnDef<VisitorType>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => row.original.description ?? '—',
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Visitor Preapproval') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/visitor-types/${row.original.id}/edit`}>Edit</Link>
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
            <Head title="Visitor Types" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Visitor Types"
                        description="Manage visitor categories (delivery, maintenance, guest, etc.)"
                    />
                    {can('Create Visitor Preapproval') && (
                        <Button asChild size="sm">
                            <Link href="/visitor-types/create">
                                <Plus className="mr-1 size-4" />
                                New Type
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={types}
                    searchKey="name"
                    searchPlaceholder="Search types..."
                />
            </div>
        </>
    );
}

VisitorTypeIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Visitor Types', href: '/visitor-types' },
    ],
};
