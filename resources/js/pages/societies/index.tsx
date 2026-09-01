import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/societies';

interface Society {
    id: number;
    name: string;
    slug: string | null;
    email: string | null;
    phone_number: string | null;
    property_type: string | null;
    is_active: boolean;
}

export default function SocietiesIndex({ societies }: { societies: Society[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this society?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Societies" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Societies</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Society
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {societies.length === 0 && (
                        <p className="text-muted-foreground">No societies yet.</p>
                    )}
                    {societies.map((s) => (
                        <div key={s.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{s.name}</span>
                                <span className={s.is_active ? 'text-green-600 text-sm' : 'text-muted-foreground text-sm'}>
                                    {s.is_active ? 'active' : 'inactive'}
                                </span>
                            </div>
                            {s.slug && <p className="text-muted-foreground mt-1 text-sm">{s.slug}</p>}
                            {s.phone_number && <p className="text-muted-foreground text-sm">{s.phone_number}</p>}
                            {s.property_type && <p className="text-muted-foreground text-sm">{s.property_type}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(s.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>
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