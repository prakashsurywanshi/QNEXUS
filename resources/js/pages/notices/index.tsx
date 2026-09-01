import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Notice {
    id: number;
    title: string;
    description: string | null;
}

export default function NoticesIndex({ notices }: { notices: Notice[] }) {
    return (
        <>
            <Head title="Notices" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Notices</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {notices.length === 0 && (
                        <p className="text-muted-foreground">No notices published yet.</p>
                    )}
                    {notices.map((n) => (
                        <div key={n.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <span className="font-medium">{n.title}</span>
                            {n.description && <p className="text-muted-foreground mt-1 line-clamp-3 text-sm">{n.description}</p>}
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
