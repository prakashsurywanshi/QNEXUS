import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/visitors';

interface Visitor {
    id: number;
    visitor_name: string;
    phone_number: string | null;
    purpose_of_visit: string | null;
    date_of_visit: string | null;
    in_time: string | null;
    out_time: string | null;
    status: 'pending' | 'allowed' | 'not_allowed';
}

export default function VisitorsIndex({ visitors }: { visitors: Visitor[] }) {
    const { delete: deleteForm } = useForm();
    const color: Record<string, string> = {
        pending: 'text-amber-600',
        allowed: 'text-green-600',
        not_allowed: 'text-red-600',
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this visitor?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Visitors" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Visitors</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Visitor
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {visitors.length === 0 && <EmptyState icon={Plus} title="No visitors yet" description="Add your first visitor to get started." />}
                    {visitors.map((visitor) => (
                        <div key={visitor.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{visitor.visitor_name}</span>
                                <span className={`text-sm ${color[visitor.status] ?? 'text-muted-foreground'}`}>{visitor.status}</span>
                            </div>
                            {visitor.phone_number && <p className="text-muted-foreground mt-1 text-sm">{visitor.phone_number}</p>}
                            {visitor.purpose_of_visit && <p className="text-muted-foreground text-sm">{visitor.purpose_of_visit}</p>}
                            <p className="text-muted-foreground text-sm">
                                {visitor.date_of_visit || '-'} {visitor.in_time || ''}–{visitor.out_time || ''}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(visitor.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(visitor.id)}>
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