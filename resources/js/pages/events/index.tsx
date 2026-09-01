import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/events';

interface EventItem {
    id: number;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    start_time: string | null;
    location: string | null;
    status: string;
}

export default function EventsIndex({ events }: { events: EventItem[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this event?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Events" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Events</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Event
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {events.length === 0 && (
                        <p className="text-muted-foreground">No events scheduled yet.</p>
                    )}
                    {events.map((e) => (
                        <div key={e.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{e.title}</span>
                                <span className="text-muted-foreground text-sm">{e.status}</span>
                            </div>
                            {e.location && <p className="text-muted-foreground mt-1 text-sm">{e.location}</p>}
                            <p className="text-muted-foreground text-sm">
                                {e.start_date || '-'} {e.start_time || ''}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(e.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id)}>
                                    <Trash2 /> Delete
                                </Button>
                            </div>
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