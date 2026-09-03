import { Head } from '@inertiajs/react';
import EmptyState from '@/components/empty-state';
import { Plus } from 'lucide-react';

interface Apartment {
    id: number;
    apartment_type: string;
    maintenance_value: string | null;
}

export default function ApartmentsIndex({ apartments }: { apartments: Apartment[] }) {
    return (
        <>
            <Head title="Apartments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Apartments</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {apartments.length === 0 && <EmptyState icon={Plus} title="No apartments yet" description="Add your first apartment to get started." />}
                    {apartments.map((apartment) => (
                        <div
                            key={apartment.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">#{apartment.id}</span>
                                <span className="text-muted-foreground text-sm">
                                    {apartment.apartment_type}
                                </span>
                            </div>
                            {apartment.maintenance_value && (
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Maintenance {apartment.maintenance_value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}
