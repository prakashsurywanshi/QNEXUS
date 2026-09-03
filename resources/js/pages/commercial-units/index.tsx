import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/commercial-units';

interface CommercialUnit {
    id: number;
    unit_number: string;
    floor: string | null;
    area_sqft: string | null;
    unit_type: string;
    status: string;
    monthly_rent: number | null;
    building: { id: number; name: string } | null;
    commercial_tenant: { id: number; company_name: string | null; unit_number: string } | null;
}

export default function CommercialUnitsIndex({ units }: { units: CommercialUnit[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this commercial unit?')) {
            deleteForm(destroy(id).url);
        }
    };

    const color: Record<string, string> = {
        vacant: 'text-muted-foreground',
        occupied: 'text-green-600',
        under_maintenance: 'text-amber-600',
    };

    return (
        <>
            <Head title="Commercial Units" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Commercial Units</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Unit
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {units.length === 0 && <EmptyState icon={Plus} title="No commercial units yet" description="Add your first unit to get started." />}
                    {units.map((u) => (
                        <div key={u.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{u.unit_number}</span>
                                <span className={`text-sm ${color[u.status] ?? 'text-muted-foreground'}`}>{u.status}</span>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm capitalize">{u.unit_type}</p>
                            {u.building && <p className="text-muted-foreground text-sm">{u.building.name}</p>}
                            {u.floor && <p className="text-muted-foreground text-sm">Floor {u.floor}</p>}
                            {u.area_sqft != null && <p className="text-muted-foreground text-sm">{u.area_sqft} sqft</p>}
                            {u.monthly_rent != null && <p className="text-muted-foreground text-sm">₹{u.monthly_rent} /month</p>}
                            {u.commercial_tenant && (
                                <p className="text-muted-foreground text-sm">
                                    Tenant: {u.commercial_tenant.company_name ?? u.commercial_tenant.unit_number}
                                </p>
                            )}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(u.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(u.id)}>
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