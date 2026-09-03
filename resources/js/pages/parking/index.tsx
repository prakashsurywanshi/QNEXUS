import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { useCan } from '@/lib/permissions';

interface Parking {
    id: number;
    parking_code: string;
    status: 'available' | 'not_available';
}

export default function ParkingIndex({ parkings }: { parkings: Parking[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();
    const color: Record<string, string> = {
        available: 'text-green-600',
        not_available: 'text-red-600',
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this parking?')) {
            deleteForm(`/parking/${id}`);
        }
    };

    return (
        <>
            <Head title="Parking" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Parking</h1>
                    {can('Create Parking') && (
                        <Button asChild size="sm">
                            <Link href="/parking/create">
                                <Plus /> New Parking
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {parkings.length === 0 && <EmptyState icon={Plus} title="No parking slots yet" description="Add your first parking slot to get started." />}
                    {parkings.map((parking) => (
                        <div key={parking.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{parking.parking_code}</span>
                                <span className={`text-sm ${color[parking.status] ?? 'text-muted-foreground'}`}>{parking.status.replace('_', ' ')}</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                {can('Update Parking') && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/parking/${parking.id}/edit`}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                            )}
                            {can('Delete Parking') && (
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(parking.id)}>
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
