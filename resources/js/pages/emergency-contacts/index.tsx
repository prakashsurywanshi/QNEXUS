import { Head, Link, useForm } from '@inertiajs/react';
import { Phone, Plus, Siren } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import { dashboard } from '@/routes';
import { index as emergencyContactsIndex } from '@/routes/emergency-contacts';
import type { ColumnDef } from '@tanstack/react-table';

interface EmergencyContact {
    id: number;
    name: string;
    phone: string;
    category: string;
    is_active: boolean;
}

const categoryColors: Record<string, string> = {
    police: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    fire: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    ambulance: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    hospital: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    gas_leak: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    electrician: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    plumber: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    other: 'bg-muted text-muted-foreground',
};

const categoryLabels: Record<string, string> = {
    police: 'Police',
    fire: 'Fire',
    ambulance: 'Ambulance',
    hospital: 'Hospital',
    gas_leak: 'Gas Leak',
    electrician: 'Electrician',
    plumber: 'Plumber',
    other: 'Other',
};

export default function EmergencyContactsIndex({ contacts }: { contacts: EmergencyContact[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this emergency contact?')) {
            deleteForm(`/emergency-contacts/${id}`);
        }
    };

    const columns: ColumnDef<EmergencyContact>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info) => (
                <span className="flex items-center gap-2 font-medium">
                    <Phone className="size-4 text-muted-foreground" />
                    {info.getValue() as string}
                </span>
            ),
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: (info) => <span className="font-mono">{info.getValue() as string}</span>,
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: (info) => {
                const category = (info.getValue() as string) ?? 'other';
                return (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${categoryColors[category] ?? categoryColors.other}`}>
                        {categoryLabels[category] ?? category.replace('_', ' ')}
                    </span>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: (info) => {
                const active = Boolean(info.getValue());
                return <span className={active ? 'text-green-600' : 'text-muted-foreground'}>{active ? 'Active' : 'Inactive'}</span>;
            },
        },
        {
            id: 'actions',
            header: '',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Link href={`/emergency-contacts/${info.row.original.id}/edit`} className="text-sm text-primary hover:underline">
                        Edit
                    </Link>
                    {can('Delete Emergency Contact') && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(info.row.original.id)} className="text-destructive hover:text-destructive">
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Emergency Contacts" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Emergency Contacts" description="Manage important emergency and service contacts." />
                    {can('Create Emergency Contact') && (
                        <Link href="/emergency-contacts/create">
                            <Button>
                                <Plus className="mr-2 size-4" />
                                New Contact
                            </Button>
                        </Link>
                    )}
                </div>

                <DataTable columns={columns} data={contacts} searchKey="name" exportable exportFilename="emergency-contacts.csv" />
            </div>
        </>
    );
}

EmergencyContactsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Emergency Contacts', href: emergencyContactsIndex() },
    ],
};
