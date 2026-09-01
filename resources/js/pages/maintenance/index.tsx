import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Maintenance {
    id: number;
    cost_type: 'fixedValue' | 'unitType';
    unit_name: string | null;
    set_value: number | null;
}

export default function MaintenanceIndex({ maintenance }: { maintenance: Maintenance[] }) {
    return (
        <>
            <Head title="Maintenance" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Maintenance</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {maintenance.length === 0 && (
                        <p className="text-muted-foreground">No maintenance charges yet.</p>
                    )}
                    {maintenance.map((item) => (
                        <div key={item.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{item.cost_type}</span>
                            </div>
                            {item.unit_name && <p className="text-muted-foreground mt-1 text-sm">{item.unit_name}</p>}
                            {item.set_value != null && <p className="text-muted-foreground text-sm">₹{item.set_value}</p>}
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
