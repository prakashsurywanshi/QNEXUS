import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/cam-charges';

interface CamCharge {
    id: number;
    fiscal_year: string;
    total_budget: number | null;
    total_area: number | null;
    rate_per_sqft: number | null;
    status: string;
    notes: string | null;
}

export default function CamChargesIndex({ camCharges }: { camCharges: CamCharge[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this CAM charge?')) {
            deleteForm(destroy(id).url);
        }
    };

    const color: Record<string, string> = {
        draft: 'text-muted-foreground',
        active: 'text-green-600',
        closed: 'text-muted-foreground',
    };

    return (
        <>
            <Head title="CAM Charges" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">CAM Charges</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add CAM Charge
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {camCharges.length === 0 && <EmptyState icon={Plus} title="No CAM charges yet" description="Add your first CAM charge to get started." />}
                    {camCharges.map((c) => (
                        <div key={c.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{c.fiscal_year}</span>
                                <span className={`text-sm ${color[c.status] ?? 'text-muted-foreground'}`}>{c.status}</span>
                            </div>
                            {c.total_budget != null && <p className="text-muted-foreground mt-1 text-sm">Budget: ₹{c.total_budget}</p>}
                            {c.total_area != null && <p className="text-muted-foreground text-sm">Area: {c.total_area} sqft</p>}
                            {c.rate_per_sqft != null && <p className="text-muted-foreground text-sm">₹{c.rate_per_sqft} /sqft</p>}
                            {c.notes && <p className="text-muted-foreground text-sm">{c.notes}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(c.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>
                                    <Trash2 /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}