import { Head, useForm } from '@inertiajs/react';
import { FileUp } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

interface Document {
    id: number;
    name: string;
    category: string | null;
    folder_id: number | null;
}

interface Folder {
    id: number;
    name: string;
}

export default function EditDocument({ document, folders, categories }: { document: Document; folders: Folder[]; categories: string[] }) {
    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        category: string;
        folder_id: string;
        file: File | null;
    }>({
        name: document.name,
        category: document.category ?? '',
        folder_id: document.folder_id ? String(document.folder_id) : '',
        file: null,
    });

    return (
        <>
            <Head title={`Edit ${document.name}`} />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title={`Edit ${document.name}`} description="Update document details" />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/documents/${document.id}`);
                    }}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Document Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Folder</Label>
                            <Select value={data.folder_id} onValueChange={(v) => setData('folder_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select folder (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {folders.map((f) => (
                                        <SelectItem key={f.id} value={String(f.id)}>
                                            {f.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.folder_id} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="file">Replace File (optional)</Label>
                        <div className="flex items-center gap-3 rounded-lg border border-dashed p-4">
                            <FileUp className="size-5 text-muted-foreground" />
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <InputError message={errors.file} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditDocument.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Documents', href: '/documents' },
        { title: 'Edit', href: '#' },
    ],
};
