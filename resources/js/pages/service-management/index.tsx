import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

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
    return (
        <>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Services</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.length === 0 && (
                        <p className="text-muted-foreground">No service providers yet.</p>
                    )}
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
                        </div>
                    ))}
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[20vh] overflow-hidden rounded-xl border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}
