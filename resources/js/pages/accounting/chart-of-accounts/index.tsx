import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Account {
    id: number;
    account_code: string;
    account_name: string;
    account_type: string;
    parent_id: number | null;
    is_active: boolean;
    parent?: { id: number; account_name: string } | null;
}

const typeColors: Record<string, string> = {
    asset: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    liability: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    equity: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    income: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    expense: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function ChartOfAccountIndex({ accounts }: { accounts: Account[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this account?')) {
            deleteForm(`/chart-of-accounts/${id}`);
        }
    };

    const columns: ColumnDef<Account>[] = [
        {
            accessorKey: 'account_code',
            header: 'Code',
        },
        {
            accessorKey: 'account_name',
            header: 'Account Name',
        },
        {
            accessorKey: 'account_type',
            header: 'Type',
            cell: ({ row }) => (
                <Badge variant="outline" className={typeColors[row.original.account_type] ?? ''}>
                    {row.original.account_type}
                </Badge>
            ),
        },
        {
            id: 'parent',
            header: 'Parent',
            cell: ({ row }) => row.original.parent?.account_name ?? '—',
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) =>
                row.original.is_active ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Inactive
                    </Badge>
                ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Chart of Account') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/chart-of-accounts/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Chart of Account') && (
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
            <Head title="Chart of Accounts" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Chart of Accounts"
                        description="Manage your accounting chart of accounts"
                    />
                    {can('Create Chart of Account') && (
                        <Button asChild size="sm">
                            <Link href="/chart-of-accounts/create">
                                <Plus className="mr-1 size-4" />
                                New Account
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={accounts}
                    searchKey="account_name"
                    searchPlaceholder="Search by account name..."
                />
            </div>
        </>
    );
}

ChartOfAccountIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Chart of Accounts', href: '/chart-of-accounts' },
    ],
};
