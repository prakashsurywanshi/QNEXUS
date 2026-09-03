import { Head } from '@inertiajs/react';
import EmptyState from '@/components/empty-state';
import { Plus } from 'lucide-react';

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
                    {serviceTypes.length === 0 && <EmptyState icon={Plus} title="No service types yet" description="Add your first service type to get started." />}
                    {serviceTypes.map((type) => (
                        <div key={type.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <span className="font-medium">{type.name || `#${type.id}`}</span>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}
