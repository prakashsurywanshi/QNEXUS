import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/members';

interface Member {
    id: number;
    name: string;
    email: string;
}

export default function MembersIndex({ members }: { members: Member[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Remove this member from the society?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Members</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Member
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {members.length === 0 && <EmptyState icon={Plus} title="No members yet" description="Add your first member to get started." />}
                    {members.map((m) => (
                        <div key={m.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <span className="font-medium">{m.name}</span>
                            {m.email && <p className="text-muted-foreground mt-1 text-sm">{m.email}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(m.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(m.id)}>
                                    <Trash2 /> Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}