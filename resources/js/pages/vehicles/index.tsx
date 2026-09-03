import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Vehicle {
    id: number;
    vehicle_number: string;
    vehicle_type: string;
    make: string | null;
    model: string | null;
    color: string | null;
    sticker_number: string | null;
    is_primary: boolean;
    apartment: { id: number; apartment_number: string } | null;
    owner: { id: number; name: string } | null;
    parkingSlot: { parking_code: string } | null;
}

const typeLabels: Record<string, string> = {
    two_wheeler: '2 Wheeler',
    four_wheeler: '4 Wheeler',
    commercial: 'Commercial',
};

export default function VehicleIndex({ vehicles }: { vehicles: Vehicle[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this vehicle?')) {
            deleteForm(`/vehicles/${id}`);
        }
    };

    const columns: ColumnDef<Vehicle>[] = [
        {
            accessorKey: 'vehicle_number',
            header: 'Vehicle No.',
        },
        {
            accessorKey: 'vehicle_type',
            header: 'Type',
            cell: ({ row }) => typeLabels[row.original.vehicle_type] ?? row.original.vehicle_type,
        },
        {
            accessorKey: 'make',
            header: 'Make / Model',
            cell: ({ row }) => [row.original.make, row.original.model].filter(Boolean).join(' ') || '—',
        },
        {
            id: 'apartment',
            header: 'Apartment',
            cell: ({ row }) => row.original.apartment?.apartment_number ?? '—',
        },
        {
            id: 'owner',
            header: 'Owner',
            cell: ({ row }) => row.original.owner?.name ?? '—',
        },
        {
            id: 'parking',
            header: 'Parking',
            cell: ({ row }) => row.original.parkingSlot?.parking_code ?? '—',
        },
        {
            accessorKey: 'is_primary',
            header: 'Primary',
            cell: ({ row }) =>
                row.original.is_primary ? <Badge variant="outline">Primary</Badge> : '—',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Vehicle') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/vehicles/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Vehicle') && (
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
            <Head title="Vehicles" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Vehicles"
                        description="Manage resident vehicles and parking allocation"
                    />
                    {can('Create Vehicle') && (
                        <Button asChild size="sm">
                            <Link href="/vehicles/create">
                                <Plus className="mr-1 size-4" />
                                Register Vehicle
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={vehicles}
                    searchKey="vehicle_number"
                    searchPlaceholder="Search by vehicle number..."
                />
            </div>
        </>
    );
}

VehicleIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Vehicles', href: '/vehicles' },
    ],
};
