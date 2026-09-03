import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface FamilyMember {
    id: number;
    name: string;
    relationship: string | null;
    phone: string | null;
    document_type: string | null;
    user: { id: number; name: string } | null;
}

export default function FamilyMemberIndex({ familyMembers }: { familyMembers: FamilyMember[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this family member?')) {
            deleteForm(`/family-members/${id}`);
        }
    };

    const columns: ColumnDef<FamilyMember>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'relationship',
            header: 'Relationship',
            cell: ({ row }) => row.original.relationship ?? '—',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => row.original.phone ?? '—',
        },
        {
            accessorKey: 'document_type',
            header: 'Document',
            cell: ({ row }) =>
                row.original.document_type ? (
                    <Badge variant="outline">{row.original.document_type}</Badge>
                ) : (
                    '—'
                ),
        },
        {
            id: 'resident',
            header: 'Resident',
            cell: ({ row }) => row.original.user?.name ?? '—',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Family Member') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/family-members/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Family Member') && (
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
            <Head title="Family Members" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Family Members"
                        description="Manage residents' family member profiles"
                    />
                    {can('Create Family Member') && (
                        <Button asChild size="sm">
                            <Link href="/family-members/create">
                                <Plus className="mr-1 size-4" />
                                Add Member
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={familyMembers}
                    searchKey="name"
                    searchPlaceholder="Search by name..."
                />
            </div>
        </>
    );
}

FamilyMemberIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Family Members', href: '/family-members' },
    ],
};
