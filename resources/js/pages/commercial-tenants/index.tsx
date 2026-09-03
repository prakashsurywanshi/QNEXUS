import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/commercial-tenants';

interface CommercialTenant {
    id: number;
    company_name: string | null;
    contact_name: string | null;
    email: string | null;
    phone: string | null;
    unit_number: string;
    rent_amount: number | null;
    unit_type: string;
    status: string;
    building: { id: number; name: string } | null;
}

export default function CommercialTenantsIndex({ tenants }: { tenants: CommercialTenant[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this commercial tenant?')) {
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
            <Head title="Commercial Tenants" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Commercial Tenants</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Tenant
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tenants.length === 0 && <EmptyState icon={Plus} title="No tenants yet" description="Add your first commercial tenant to get started." />}
                    {tenants.map((t) => (
                        <div key={t.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{t.company_name ?? t.contact_name ?? t.unit_number}</span>
                                <span className={`text-sm ${color[t.status] ?? 'text-muted-foreground'}`}>{t.status}</span>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm capitalize">{t.unit_type} · {t.unit_number}</p>
                            {t.building && <p className="text-muted-foreground text-sm">{t.building.name}</p>}
                            {t.contact_name && <p className="text-muted-foreground text-sm">{t.contact_name}</p>}
                            {t.email && <p className="text-muted-foreground text-sm">{t.email}</p>}
                            {t.rent_amount != null && <p className="text-muted-foreground text-sm">₹{t.rent_amount} /month</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(t.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>
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