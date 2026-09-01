import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/assets';

interface Asset {
    id: number;
    name: string | null;
    location: string | null;
    condition: string | null;
    maintenance_schedule: string | null;
}

export default function AssetsIndex({ assets }: { assets: Asset[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this asset?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Assets" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Assets</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Asset
                        </Link>
                    </Button>
                </div>
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
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(asset.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(asset.id)}>
                                    <Trash2 /> Delete
                                </Button>
                            </div>
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