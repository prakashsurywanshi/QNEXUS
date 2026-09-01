import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/maintenance';

interface Maintenance {
    id: number;
    cost_type: 'fixedValue' | 'unitType';
    unit_name: string | null;
    set_value: number | null;
}

export default function MaintenanceIndex({ maintenance }: { maintenance: Maintenance[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this maintenance charge?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Maintenance" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Maintenance</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Charge
                        </Link>
                    </Button>
                </div>
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
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(item.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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