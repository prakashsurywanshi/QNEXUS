import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Checkpoint {
    id: number;
    name: string | null;
    location: string | null;
}

export default function PatrolIndex({ checkpoints }: { checkpoints: Checkpoint[] }) {
    return (
        <>
            <Head title="Patrol Checkpoints" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Patrol Checkpoints</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {checkpoints.length === 0 && (
                        <p className="text-muted-foreground">No checkpoints yet.</p>
                    )}
                    {checkpoints.map((cp) => (
                        <div key={cp.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <span className="font-medium">{cp.name || `#${cp.id}`}</span>
                            {cp.location && <p className="text-muted-foreground mt-1 text-sm">{cp.location}</p>}
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
