import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { create, destroy, edit } from '@/routes/vendors';

interface Vendor {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    category: string | null;
    status: 'active' | 'inactive';
}

export default function VendorsIndex({ vendors }: { vendors: Vendor[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this vendor?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Vendors" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Vendors</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Vendor
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vendors.length === 0 && <EmptyState icon={Plus} title="No vendors yet" description="Add your first vendor to get started." />}
                    {vendors.map((v) => (
                        <div key={v.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{v.name}</span>
                                <span className={v.status === 'active' ? 'text-green-600 text-sm' : 'text-muted-foreground text-sm'}>
                                    {v.status}
                                </span>
                            </div>
                            {v.category && <p className="text-muted-foreground mt-1 text-sm">{v.category}</p>}
                            {v.contact_person && <p className="text-muted-foreground text-sm">{v.contact_person}</p>}
                            {v.phone && <p className="text-muted-foreground text-sm">{v.phone}</p>}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(v.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(v.id)}>
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