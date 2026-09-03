import { Head, Link, useForm } from '@inertiajs/react';
import { FileText, Folder, Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCan } from '@/lib/permissions';
import { dashboard } from '@/routes';
import { index as documentsIndex } from '@/routes/documents';
import type { ColumnDef } from '@tanstack/react-table';

interface Folder {
    id: number;
    name: string;
}

interface Document {
    id: number;
    name: string;
    category: string | null;
    file_path: string | null;
    folder?: Folder | null;
}

export default function DocumentsIndex({ documents, folders }: { documents: Document[]; folders: Folder[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this document?')) {
            deleteForm(`/documents/${id}`);
        }
    };

    const columns: ColumnDef<Document>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: (info) => (
                <span className="flex items-center gap-2 font-medium">
                    <FileText className="size-4 text-muted-foreground" />
                    {info.getValue() as string}
                </span>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: (info) => {
                const category = (info.getValue() as string) ?? 'Other';
                return <span className="capitalize">{category}</span>;
            },
        },
        {
            accessorKey: 'folder',
            header: 'Folder',
            cell: (info) => (info.getValue() as Document['folder'])?.name ?? '—',
        },
        {
            accessorKey: 'file_path',
            header: 'File',
            cell: (info) => {
                const path = info.getValue() as string | null;
                return path ? (
                    <a href={`/storage/${path}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        View
                    </a>
                ) : (
                    '—'
                );
            },
        },
        {
            id: 'actions',
            header: '',
            cell: (info) => (
                <div className="flex items-center gap-2">
                    <Link href={`/documents/${info.row.original.id}/edit`} className="text-sm text-primary hover:underline">
                        Edit
                    </Link>
                    {can('Delete Documents') && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(info.row.original.id)} className="text-destructive hover:text-destructive">
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Documents" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Documents" description="Manage property, society, vendor and commercial documents." />
                    {can('Create Documents') && (
                        <Link href="/documents/create">
                            <Button>
                                <Plus className="mr-2 size-4" />
                                New Document
                            </Button>
                        </Link>
                    )}
                </div>

                {folders.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Folder className="size-4" />
                            Folders:
                        </span>
                        {folders.map((f) => (
                            <span key={f.id} className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                                {f.name}
                            </span>
                        ))}
                    </div>
                )}

                <DataTable columns={columns} data={documents} searchKey="name" exportable exportFilename="documents.csv" />
            </div>
        </>
    );
}

DocumentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Documents', href: documentsIndex() },
    ],
};
