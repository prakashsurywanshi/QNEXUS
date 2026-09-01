import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

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
                    {apartments.length === 0 && (
                        <p className="text-muted-foreground">No apartments in this society yet.</p>
                    )}
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
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[20vh] overflow-hidden rounded-xl border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}
