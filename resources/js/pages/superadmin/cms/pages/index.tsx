import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/superadmin';
import { create, destroy, edit, index as pagesIndex } from '@/routes/superadmin/cms/pages';

type CmsPage = {
    id: number;
    title: string;
    slug: string;
    status: string;
    sort_order: number;
};

export default function CmsPagesIndex({ pages }: { pages: CmsPage[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this page?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="CMS Pages" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">CMS Pages</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Page
                        </Link>
                    </Button>
                </div>

                {pages.length === 0 ? (
                    <p className="text-muted-foreground">No pages created yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-2 font-medium">Title</th>
                                    <th className="pb-2 font-medium">Slug</th>
                                    <th className="pb-2 font-medium">Status</th>
                                    <th className="pb-2 font-medium">Order</th>
                                    <th className="pb-2 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((page) => (
                                    <tr key={page.id} className="border-b">
                                        <td className="py-2 font-medium">{page.title}</td>
                                        <td className="py-2 text-muted-foreground">/{page.slug}</td>
                                        <td className="py-2">
                                            <span
                                                className={
                                                    page.status === 'published'
                                                        ? 'text-green-600'
                                                        : 'text-muted-foreground'
                                                }
                                            >
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="py-2">{page.sort_order}</td>
                                        <td className="py-2">
                                            <div className="flex items-center gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={edit(page.id).url}>
                                                        <Pencil /> Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(page.id)}
                                                >
                                                    <Trash2 /> Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

CmsPagesIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: dashboard() },
        { title: 'CMS Pages', href: pagesIndex() },
    ],
};