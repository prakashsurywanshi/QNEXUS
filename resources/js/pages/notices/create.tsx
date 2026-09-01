import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { create } from '@/routes/notices';

type NoticeData = {
    title: string;
    description: string;
};

export default function CreateNotice() {
    const { data, setData, post, processing, errors } = useForm<NoticeData>({
        title: '',
        description: '',
    });

    return (
        <>
            <Head title="Add Notice" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Add Notice"
                    description="Publish a notice to the society"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(create().url);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            placeholder="e.g. Water supply maintenance"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={5}
                            placeholder="Details of the notice"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Publish notice</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
