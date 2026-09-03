import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Pet {
    id: number;
    name: string;
    species: string;
    breed: string | null;
    color: string | null;
    weight: number | null;
    vaccination_status: string;
    last_vaccination_date: string | null;
    next_vaccination_date: string | null;
    is_neutered: boolean;
    microchip_id: string | null;
    user: { id: number; name: string } | null;
    apartment: { apartment_number: string } | null;
}

const vaccinationColors: Record<string, string> = {
    up_to_date: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    unknown: 'bg-muted text-muted-foreground',
};

export default function PetIndex({ pets }: { pets: Pet[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this pet?')) {
            deleteForm(`/pets/${id}`);
        }
    };

    const columns: ColumnDef<Pet>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'species',
            header: 'Species',
        },
        {
            accessorKey: 'breed',
            header: 'Breed',
            cell: ({ row }) => row.original.breed ?? '—',
        },
        {
            accessorKey: 'vaccination_status',
            header: 'Vaccination',
            cell: ({ row }) => (
                <Badge variant="outline" className={vaccinationColors[row.original.vaccination_status] ?? ''}>
                    {row.original.vaccination_status}
                </Badge>
            ),
        },
        {
            id: 'owner',
            header: 'Owner',
            cell: ({ row }) => row.original.user?.name ?? '—',
        },
        {
            id: 'apartment',
            header: 'Apartment',
            cell: ({ row }) => row.original.apartment?.apartment_number ?? '—',
        },
        {
            accessorKey: 'is_neutered',
            header: 'Neutered',
            cell: ({ row }) => row.original.is_neutered ? 'Yes' : 'No',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {can('Create Pet') && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/pets/${row.original.id}/edit`}>Edit</Link>
                        </Button>
                    )}
                    {can('Create Pet') && (
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
            <Head title="Pets" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Pets"
                        description="Manage registered pets"
                    />
                    {can('Create Pet') && (
                        <Button asChild size="sm">
                            <Link href="/pets/create">
                                <Plus className="mr-1 size-4" />
                                Register Pet
                            </Link>
                        </Button>
                    )}
                </div>

                <DataTable
                    columns={columns}
                    data={pets}
                    searchKey="name"
                    searchPlaceholder="Search by pet name..."
                />
            </div>
        </>
    );
}

PetIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Pets', href: '/pets' },
    ],
};
