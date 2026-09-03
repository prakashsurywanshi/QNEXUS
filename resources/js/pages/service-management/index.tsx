import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/service-management';

interface Service {
    id: number;
    service_type_id: number;
    company_name: string | null;
    contact_person_name: string | null;
    phone_number: string | null;
    price: number;
    status: 'available' | 'not_available';
    payment_frequency: string | null;
}

export default function ServiceManagementIndex({ services }: { services: Service[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this service?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Services</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Service
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.length === 0 && <EmptyState icon={Plus} title="No services yet" description="Add your first service to get started." />}
                    {services.map((service) => (
                        <div key={service.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{service.company_name || `#${service.id}`}</span>
                                <span className={service.status === 'available' ? 'text-green-600 text-sm' : 'text-muted-foreground text-sm'}>
                                    {service.status}
                                </span>
                            </div>
                            {service.contact_person_name && <p className="text-muted-foreground mt-1 text-sm">{service.contact_person_name}</p>}
                            {service.phone_number && <p className="text-muted-foreground text-sm">{service.phone_number}</p>}
                            <p className="text-muted-foreground text-sm">
                                ₹{service.price} / {service.payment_frequency}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(service.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
                                    <Trash2 /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}