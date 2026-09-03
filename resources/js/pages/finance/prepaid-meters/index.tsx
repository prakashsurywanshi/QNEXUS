import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Gauge } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Meter {
    id: number;
    meter_number: string | null;
    meter_type: string;
    is_active: boolean;
    apartment?: { id: number; apartment_number: string } | null;
    readings?: unknown[];
}

export default function PrepaidMeterIndex({ meters }: { meters: Meter[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this meter?')) {
            deleteForm(`/prepaid-meters/${id}`);
        }
    };

    const columns: ColumnDef<Meter>[] = [
        {
            accessorKey: 'meter_number',
            header: 'Meter Number',
            cell: ({ row }) => row.original.meter_number ?? '—',
        },
        {
            accessorKey: 'meter_type',
            header: 'Type',
            cell: ({ row }) => <span className="capitalize">{row.original.meter_type}</span>,
        },
        {
            id: 'apartment',
            header: 'Apartment',
            cell: ({ row }) => row.original.apartment?.apartment_number ?? '—',
        },
        {
            id: 'readings_count',
            header: 'Readings',
            cell: ({ row }) => row.original.readings?.length ?? 0,
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
                    <Badge variant="outline">Inactive</Badge>
                ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Show Prepaid Meter') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/prepaid-meters/${row.original.id}/readings`}>
                                <Gauge className="mr-1 size-3" />
                                Readings
                            </Link>
                        </Button>
                    )}
                    {can('Create Prepaid Meter') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/prepaid-meters/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Prepaid Meter') && (
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
            <Head title="Prepaid Meters" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Prepaid Meters"
                        description="Manage utility meters and their readings"
                    />
                    {can('Create Prepaid Meter') && (
                        <Button asChild size="sm">
                            <Link href="/prepaid-meters/create">
                                <Plus className="mr-1 size-4" />
                                New Meter
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={meters}
                    searchKey="meter_number"
                    searchPlaceholder="Search by meter number..."
                />
            </div>
        </>
    );
}

PrepaidMeterIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Prepaid Meters', href: '/prepaid-meters' },
    ],
};
