import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/polls';

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
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this poll?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Polls" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Polls</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Poll
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {polls.length === 0 && <EmptyState icon={Plus} title="No polls yet" description="Create your first poll to get started." />}
                    {polls.map((p) => (
                        <div key={p.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{p.title}</span>
                                <span className="text-muted-foreground text-sm">{p.status}</span>
                            </div>
                            {p.poll_type && <p className="text-muted-foreground mt-1 text-sm">{p.poll_type} poll</p>}
                            {p.end_date && <p className="text-muted-foreground text-sm">Closes {p.end_date}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(p.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
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