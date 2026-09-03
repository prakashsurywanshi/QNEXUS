import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { useCan } from '@/lib/permissions';

interface Worker {
    id: number;
    name: string;
    phone: string | null;
    service_type: string | null;
    rate_per_visit: string | null;
    rating: string | null;
    is_verified: boolean;
    is_active: boolean;
    bookings_count?: number;
}

export default function DailyHelpIndex({ workers }: { workers: Worker[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this worker?')) {
            deleteForm(`/daily-help/${id}`);
        }
    };

    return (
        <>
            <Head title="Daily Help" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Daily Help</h1>
                    {can('Create Daily Help') && (
                        <Button asChild size="sm">
                            <Link href="/daily-help/create">
                                <Plus /> New Worker
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workers.length === 0 && <EmptyState icon={Plus} title="No workers yet" description="Add your first worker to get started." />}
                    {workers.map((worker) => (
                        <div key={worker.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{worker.name}</span>
                                <span className={`text-sm ${worker.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                    {worker.is_active ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                            {worker.phone && <p className="text-muted-foreground mt-1 text-sm">{worker.phone}</p>}
                            {worker.service_type && <p className="text-muted-foreground text-sm">{worker.service_type}</p>}
                            <p className="text-muted-foreground text-sm">
                                Rate: {worker.rate_per_visit ?? '-'} | Bookings: {worker.bookings_count ?? 0}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                {can('Update Daily Help') && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/daily-help/${worker.id}/edit`}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                            )}
                            {can('Delete Daily Help') && (
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(worker.id)}>
                                    <Trash2 /> Delete
                                </Button>
                            )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}