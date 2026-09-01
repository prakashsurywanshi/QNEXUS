import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/gatepasses';

interface Gatepass {
    id: number;
    item_description: string;
    quantity: number;
    gatepass_type: 'in' | 'out';
    vehicle_number: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export default function GatepassesIndex({ gatepasses }: { gatepasses: Gatepass[] }) {
    const { delete: deleteForm } = useForm();
    const color: Record<string, string> = {
        pending: 'text-amber-600',
        approved: 'text-green-600',
        rejected: 'text-red-600',
        completed: 'text-blue-600',
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this gatepass?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Gatepasses" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Gatepasses</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Gatepass
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {gatepasses.length === 0 && (
                        <p className="text-muted-foreground">No gatepasses yet.</p>
                    )}
                    {gatepasses.map((gp) => (
                        <div key={gp.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{gp.item_description}</span>
                                <span className={`text-sm ${color[gp.status] ?? 'text-muted-foreground'}`}>{gp.status}</span>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Qty {gp.quantity} · {gp.gatepass_type}
                            </p>
                            {gp.vehicle_number && <p className="text-muted-foreground text-sm">{gp.vehicle_number}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(gp.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(gp.id)}>
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