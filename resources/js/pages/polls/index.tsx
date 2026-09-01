import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Poll {
    id: number;
    title: string;
    description: string | null;
    poll_type: string;
    start_date: string | null;
    end_date: string | null;
    status: string;
}

export default function PollsIndex({ polls }: { polls: Poll[] }) {
    return (
        <>
            <Head title="Polls" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Polls</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {polls.length === 0 && (
                        <p className="text-muted-foreground">No polls yet.</p>
                    )}
                    {polls.map((p) => (
                        <div key={p.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{p.title}</span>
                                <span className="text-muted-foreground text-sm">{p.status}</span>
                            </div>
                            {p.poll_type && <p className="text-muted-foreground mt-1 text-sm">{p.poll_type} poll</p>}
                            {p.end_date && <p className="text-muted-foreground text-sm">Closes {p.end_date}</p>}
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
