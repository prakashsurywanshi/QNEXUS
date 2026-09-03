import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Log {
    id: number;
    date: string;
    check_in_time: string | null;
    check_out_time: string | null;
    duration_minutes: number | null;
    status: 'checked_in' | 'checked_out';
    recorded_by?: { id: number; name: string } | null;
}

type ClockInData = {
    date: string;
};

function formatDateTime(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleString();
}

function formatDuration(minutes: number | null): string {
    if (minutes === null || minutes === undefined) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function CheckoutButton({ staffId, logId }: { staffId: number; logId: number }) {
    const { put, processing } = useForm();
    const handleCheckout = () => {
        if (confirm('Check out this staff member?')) {
            put(`/staff/${staffId}/attendance/${logId}`);
        }
    };

    return (
        <Button variant="ghost" size="sm" disabled={processing} onClick={handleCheckout}>
            Check Out
        </Button>
    );
}

export default function StaffAttendance({
    staff,
    logs,
}: {
    staff: { id: number; name: string; designation: string; shift: string };
    logs: Log[];
}) {
    const { delete: deleteForm } = useForm();
    const { data, setData, post, processing, errors } = useForm<ClockInData>({
        date: new Date().toISOString().slice(0, 10),
    });
    const can = useCan();

    const handleDelete = (logId: number) => {
        if (confirm('Delete this clock log?')) {
            deleteForm(`/staff/${staff.id}/attendance/${logId}`);
        }
    };

    const columns: ColumnDef<Log>[] = [
        {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => (row.original.date ? new Date(row.original.date).toLocaleDateString() : '—'),
        },
        {
            accessorKey: 'check_in_time',
            header: 'Check-in',
            cell: ({ row }) => formatDateTime(row.original.check_in_time),
        },
        {
            accessorKey: 'check_out_time',
            header: 'Check-out',
            cell: ({ row }) => formatDateTime(row.original.check_out_time),
        },
        {
            accessorKey: 'duration_minutes',
            header: 'Duration',
            cell: ({ row }) => formatDuration(row.original.duration_minutes),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) =>
                row.original.status === 'checked_in' ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Checked In</Badge>
                ) : (
                    <Badge variant="outline">Checked Out</Badge>
                ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {row.original.status === 'checked_in' && can('Create Staff') && (
                        <CheckoutButton staffId={staff.id} logId={row.original.id} />
                    )}
                    {can('Create Staff') && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title={`Attendance — ${staff.name}`} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Heading
                    variant="small"
                    title={`Attendance — ${staff.name}`}
                    description={`${staff.designation} · Shift: ${staff.shift}`}
                />

                <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="mb-3 text-sm font-medium">Clock in staff member</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post(`/staff/${staff.id}/attendance`);
                        }}
                        className="flex flex-wrap items-end gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                            />
                            <InputError message={errors.date} />
                        </div>
                        <Button disabled={processing} type="submit">
                            Clock In
                        </Button>
                    </form>
                </div>

                <DataTable
                    columns={columns}
                    data={logs}
                    searchKey="date"
                    searchPlaceholder="Search attendance..."
                />
            </div>
        </>
    );
}

StaffAttendance.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Staff', href: '/staff' },
        { title: 'Attendance', href: '#' },
    ],
};
