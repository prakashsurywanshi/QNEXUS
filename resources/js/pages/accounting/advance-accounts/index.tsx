import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface AdvanceAccount {
    id: number;
    balance: number;
    apartment?: { apartment_number: string } | null;
}

export default function AdvanceAccountIndex({ accounts }: { accounts: AdvanceAccount[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this advance account?')) {
            deleteForm(`/advance-accounts/${id}`);
        }
    };

    const columns: ColumnDef<AdvanceAccount>[] = [
        {
            id: 'apartment',
            header: 'Apartment',
            cell: ({ row }) => row.original.apartment?.apartment_number ?? '—',
        },
        {
            accessorKey: 'balance',
            header: 'Balance',
            cell: ({ row }) => Number(row.original.balance).toLocaleString(),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Advance Account') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/advance-accounts/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Advance Account') && (
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
            <Head title="Advance Accounts" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Advance Accounts"
                        description="Manage apartment advance payment accounts"
                    />
                    {can('Create Advance Account') && (
                        <Button asChild size="sm">
                            <Link href="/advance-accounts/create">
                                <Plus className="mr-1 size-4" />
                                New Advance Account
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={accounts}
                    searchKey="apartment"
                    searchPlaceholder="Search by apartment..."
                />
            </div>
        </>
    );
}

AdvanceAccountIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Advance Accounts', href: '/advance-accounts' },
    ],
};
