import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/lease-agreements';

interface LeaseAgreement {
    id: number;
    lease_number: string;
    start_date: string | null;
    end_date: string | null;
    monthly_rent: number | null;
    status: string;
    commercial_tenant: { id: number; company_name: string | null; unit_number: string } | null;
    user: { id: number; name: string } | null;
}

export default function LeaseAgreementsIndex({ leases }: { leases: LeaseAgreement[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this lease agreement?')) {
            deleteForm(destroy(id).url);
        }
    };

    const color: Record<string, string> = {
        draft: 'text-muted-foreground',
        active: 'text-green-600',
        expired: 'text-amber-600',
        terminated: 'text-red-600',
    };

    return (
        <>
            <Head title="Lease Agreements" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Lease Agreements</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Lease
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {leases.length === 0 && <EmptyState icon={Plus} title="No lease agreements yet" description="Create your first lease to get started." />}
                    {leases.map((l) => (
                        <div key={l.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{l.lease_number}</span>
                                <span className={`text-sm ${color[l.status] ?? 'text-muted-foreground'}`}>{l.status}</span>
                            </div>
                            {l.commercial_tenant && (
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {l.commercial_tenant.company_name ?? l.commercial_tenant.unit_number}
                                </p>
                            )}
                            {l.user && <p className="text-muted-foreground text-sm">{l.user.name}</p>}
                            {l.start_date && l.end_date && (
                                <p className="text-muted-foreground text-sm">
                                    {l.start_date.slice(0, 10)} → {l.end_date.slice(0, 10)}
                                </p>
                            )}
                            {l.monthly_rent != null && <p className="text-muted-foreground text-sm">₹{l.monthly_rent} /month</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(l.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(l.id)}>
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