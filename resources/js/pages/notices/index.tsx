import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/notices';

interface Notice {
    id: number;
    title: string;
    description: string | null;
}

export default function NoticesIndex({ notices }: { notices: Notice[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this notice?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Notices" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Notices</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Notice
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {notices.length === 0 && <EmptyState icon={Plus} title="No notices yet" description="Publish your first notice to get started." />}
                    {notices.map((n) => (
                        <div key={n.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <span className="font-medium">{n.title}</span>
                            {n.description && <p className="text-muted-foreground mt-1 line-clamp-3 text-sm">{n.description}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(n.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(n.id)}>
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