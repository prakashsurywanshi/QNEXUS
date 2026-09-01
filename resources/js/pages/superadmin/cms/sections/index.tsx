import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/superadmin';
import { create, destroy, edit, index as sectionsIndex } from '@/routes/superadmin/cms/sections';

type CmsSection = {
    id: number;
    name: string;
    slug: string;
    section_type: string;
    status: string;
    sort_order: number;
};

export default function CmsSectionsIndex({ sections }: { sections: CmsSection[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this section?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Landing Sections" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Landing Sections</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Section
                        </Link>
                    </Button>
                </div>

                {sections.length === 0 ? (
                    <p className="text-muted-foreground">No sections created yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-2 font-medium">Name</th>
                                    <th className="pb-2 font-medium">Type</th>
                                    <th className="pb-2 font-medium">Status</th>
                                    <th className="pb-2 font-medium">Order</th>
                                    <th className="pb-2 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.map((section) => (
                                    <tr key={section.id} className="border-b">
                                        <td className="py-2 font-medium">{section.name}</td>
                                        <td className="py-2 capitalize text-muted-foreground">
                                            {section.section_type}
                                        </td>
                                        <td className="py-2">
                                            <span
                                                className={
                                                    section.status === 'published'
                                                        ? 'text-green-600'
                                                        : 'text-muted-foreground'
                                                }
                                            >
                                                {section.status}
                                            </span>
                                        </td>
                                        <td className="py-2">{section.sort_order}</td>
                                        <td className="py-2">
                                            <div className="flex items-center gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={edit(section.id).url}>
                                                        <Pencil /> Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(section.id)}
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

CmsSectionsIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: dashboard() },
        { title: 'Landing Sections', href: sectionsIndex() },
    ],
};