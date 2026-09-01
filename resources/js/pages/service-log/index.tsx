import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Clock {
    id: number;
    service_management_id: number;
    clock_in_date: string | null;
    clock_in_time: string | null;
    clock_out_date: string | null;
    clock_out_time: string | null;
    duration_minutes: number | null;
    status: 'clock_in' | 'clock_out';
}

export default function ServiceLogIndex({ clocks }: { clocks: Clock[] }) {
    return (
        <>
            <Head title="Service Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Service Logs</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clocks.length === 0 && (
                        <p className="text-muted-foreground">No clock-ins yet.</p>
                    )}
                    {clocks.map((clock) => (
                        <div key={clock.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Service #{clock.service_management_id}</span>
                                <span className={clock.status === 'clock_in' ? 'text-green-600 text-sm' : 'text-muted-foreground text-sm'}>
                                    {clock.status}
                                </span>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {clock.clock_in_date || '-'} {clock.clock_in_time || ''} → {clock.clock_out_date || '-'} {clock.clock_out_time || ''}
                            </p>
                            {clock.duration_minutes != null && (
                                <p className="text-muted-foreground text-sm">{clock.duration_minutes} min</p>
                            )}
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
