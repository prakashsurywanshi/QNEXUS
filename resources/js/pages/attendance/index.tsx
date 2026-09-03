import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useCan } from '@/lib/permissions';

interface Record {
    id: number;
    worker_name: string;
    worker_phone: string | null;
    worker_type: string | null;
    status: 'checked_in' | 'checked_out';
    check_in_time: string | null;
    check_out_time: string | null;
    notes: string | null;
    duration: number | null;
}

export default function AttendanceIndex({ records }: { records: Record[] }) {
    const { post, processing } = useForm<{ worker_name: string }>({
        worker_name: 'Walk-in Worker',
    });
    const can = useCan();

    const handleCheckIn = () => {
        post('/attendance');
    };

    const handleCheckOut = (id: number) => {
        router.put(`/attendance/${id}`);
    };

    const handleDelete = (id: number) => {
        router.delete(`/attendance/${id}`);
    };

    return (
        <>
            <Head title="Attendance" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Attendance</h1>
                    {can('Create Worker Checkins') && (
                        <Button onClick={handleCheckIn} disabled={processing}>
                            Check In
                        </Button>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {records.length === 0 && (
                        <p className="text-muted-foreground">No attendance records yet.</p>
                    )}
                    {records.map((record) => (
                        <div key={record.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{record.worker_name}</span>
                                <span className={record.status === 'checked_in' ? 'text-green-600 text-sm' : 'text-muted-foreground text-sm'}>
                                    {record.status === 'checked_in' ? 'checked in' : 'checked out'}
                                </span>
                            </div>
                            {record.worker_phone && (
                                <p className="text-muted-foreground mt-1 text-sm">{record.worker_phone}</p>
                            )}
                            {record.worker_type && (
                                <p className="text-muted-foreground mt-1 text-sm">{record.worker_type}</p>
                            )}
                            <p className="text-muted-foreground mt-1 text-sm">
                                {record.check_in_time || '-'} → {record.check_out_time || '-'}
                            </p>
                            {record.duration != null && (
                                <p className="text-muted-foreground text-sm">{record.duration} min</p>
                            )}
                            {record.notes && (
                                <p className="text-muted-foreground mt-1 text-sm">{record.notes}</p>
                            )}
                            <div className="mt-3 flex gap-2">
                                {record.status === 'checked_in' && can('Update Worker Checkins') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCheckOut(record.id)}
                                    >
                                        Check Out
                                    </Button>
                                )}
                                {can('Delete Worker Checkins') && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(record.id)}
                                    >
                                        Delete
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
