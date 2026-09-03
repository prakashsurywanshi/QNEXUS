import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type TypeData = {
    name: string;
    description: string;
};

export default function EditVisitorType({ type }: { type: { id: number } & TypeData }) {
    const { data, setData, put, processing, errors } = useForm<TypeData>({
        name: type.name,
        description: type.description ?? '',
    });

    return (
        <>
            <Head title="Edit Visitor Type" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Visitor Type"
                    description="Update visitor category"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/visitor-types/${type.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update Type</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditVisitorType.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Visitor Types', href: '/visitor-types' },
        { title: 'Edit', href: '#' },
    ],
};
