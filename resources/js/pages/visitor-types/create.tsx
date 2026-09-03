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

export default function CreateVisitorType() {
    const { data, setData, post, processing, errors } = useForm<TypeData>({
        name: '',
        description: '',
    });

    return (
        <>
            <Head title="New Visitor Type" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Visitor Type"
                    description="Add a new visitor category"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/visitor-types');
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
                            placeholder="e.g. Delivery, Maintenance, Guest"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Brief description of this visitor type"
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Type</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateVisitorType.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Visitor Types', href: '/visitor-types' },
        { title: 'New', href: '/visitor-types/create' },
    ],
};
