import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Staff {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    designation: string;
    shift: string;
    date_joined: string | null;
    is_active: boolean;
    clock_logs_count: number;
}

const shiftLabels: Record<string, string> = {
    morning: 'Morning',
    evening: 'Evening',
    night: 'Night',
    general: 'General',
};

export default function StaffIndex({ staff }: { staff: Staff[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this staff member?')) {
            deleteForm(`/staff/${id}`);
        }
    };

    const columns: ColumnDef<Staff>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'designation',
            header: 'Designation',
        },
        {
            accessorKey: 'shift',
            header: 'Shift',
            cell: ({ row }) => shiftLabels[row.original.shift] ?? row.original.shift,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => row.original.phone ?? '—',
        },
        {
            accessorKey: 'clock_logs_count',
            header: 'Check-ins',
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) =>
                row.original.is_active ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                ) : (
                    <Badge variant="outline">Inactive</Badge>
                ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={`/staff/${row.original.id}/attendance`}>Attendance</Link>
                    </Button>
                    {can('Create Staff') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/staff/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Staff') && (
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
            <Head title="Staff Management" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Staff Management"
                        description="Manage society staff (security, housekeeping, maintenance, upkeep)"
                    />
                    {can('Create Staff') && (
                        <Button asChild size="sm">
                            <Link href="/staff/create">
                                <Plus className="mr-1 size-4" />
                                Add Staff
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={staff}
                    searchKey="name"
                    searchPlaceholder="Search by staff name..."
                />
            </div>
        </>
    );
}

StaffIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Staff', href: '/staff' },
    ],
};
