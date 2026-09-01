import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface ServiceType {
    id: number;
    name: string | null;
}

export default function ServiceTypesIndex({ serviceTypes }: { serviceTypes: ServiceType[] }) {
    return (
        <>
            <Head title="Service Types" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Service Types</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {serviceTypes.length === 0 && (
                        <p className="text-muted-foreground">No service types yet.</p>
                    )}
                    {serviceTypes.map((type) => (
                        <div key={type.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <span className="font-medium">{type.name || `#${type.id}`}</span>
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
