import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface Member {
    id: number;
    name: string;
    email: string;
}

export default function MembersIndex({ members }: { members: Member[] }) {
    return (
        <>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">Members</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {members.length === 0 && (
                        <p className="text-muted-foreground">No members yet.</p>
                    )}
                    {members.map((m) => (
                        <div key={m.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <span className="font-medium">{m.name}</span>
                            {m.email && <p className="text-muted-foreground mt-1 text-sm">{m.email}</p>}
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
