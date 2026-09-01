import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Society {
    id: number;
    name: string;
    slug: string | null;
    email: string | null;
    phone_number: string | null;
    property_type: string | null;
    is_active: boolean;
}

export default function SocietiesIndex({ societies }: { societies: Society[] }) {
    return (
        <>
            <Head title="Societies" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Societies</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {societies.map((s) => (
                        <div key={s.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{s.name}</span>
                                <span className={s.is_active ? 'text-green-600 text-sm' : 'text-muted-foreground text-sm'}>
                                    {s.is_active ? 'active' : 'inactive'}
                                </span>
                            </div>
                            {s.slug && <p className="text-muted-foreground mt-1 text-sm">{s.slug}</p>}
                            {s.phone_number && <p className="text-muted-foreground text-sm">{s.phone_number}</p>}
                            {s.property_type && <p className="text-muted-foreground text-sm">{s.property_type}</p>}
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
