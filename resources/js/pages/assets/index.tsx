import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Asset {
    id: number;
    name: string | null;
    location: string | null;
    condition: string | null;
    maintenance_schedule: string | null;
}

export default function AssetsIndex({ assets }: { assets: Asset[] }) {
    return (
        <>
            <Head title="Assets" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Assets</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {assets.length === 0 && (
                        <p className="text-muted-foreground">No assets in this society yet.</p>
                    )}
                    {assets.map((asset) => (
                        <div key={asset.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{asset.name || `#${asset.id}`}</span>
                                {asset.condition && <span className="text-muted-foreground text-sm">{asset.condition}</span>}
                            </div>
                            {asset.location && <p className="text-muted-foreground mt-1 text-sm">{asset.location}</p>}
                            {asset.maintenance_schedule && <p className="text-muted-foreground text-sm">Maint: {asset.maintenance_schedule}</p>}
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
