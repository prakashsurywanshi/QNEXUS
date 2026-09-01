import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/patrol';

interface Checkpoint {
    id: number;
    name: string | null;
    location_description: string | null;
    is_active: boolean;
}

export default function PatrolIndex({ checkpoints }: { checkpoints: Checkpoint[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this checkpoint?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Patrol Checkpoints" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Patrol Checkpoints</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Checkpoint
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {checkpoints.length === 0 && (
                        <p className="text-muted-foreground">No checkpoints yet.</p>
                    )}
                    {checkpoints.map((cp) => (
                        <div key={cp.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{cp.name || `#${cp.id}`}</span>
                                <span className={`text-sm ${cp.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                                    {cp.is_active ? 'active' : 'inactive'}
                                </span>
                            </div>
                            {cp.location_description && <p className="text-muted-foreground mt-1 text-sm">{cp.location_description}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(cp.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(cp.id)}>
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