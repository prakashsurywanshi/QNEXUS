import { Head } from '@inertiajs/react';
import EmptyState from '@/components/empty-state';
import { Plus } from 'lucide-react';

interface Tower {
    id: number;
    tower_name: string;
    floors: { id: number; floor_name: string }[];
}

export default function TowersIndex({ towers }: { towers: Tower[] }) {
    return (
        <>
            <Head title="Towers" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Towers</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {towers.length === 0 && <EmptyState icon={Plus} title="No towers yet" description="Add your first tower to get started." />}
                    {towers.map((tower) => (
                        <div
                            key={tower.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4"
                        >
                            <h2 className="font-medium">{tower.tower_name}</h2>
                            <p className="text-muted-foreground text-sm">
                                {tower.floors.length} floors
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}
