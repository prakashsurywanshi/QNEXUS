import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/notices';

type NoticeData = {
    title: string;
    description: string;
};

export default function EditNotice({ notice }: { notice: { id: number } & NoticeData }) {
    const { data, setData, put, processing, errors } = useForm<NoticeData>({
        title: notice.title,
        description: notice.description ?? '',
    });

    return (
        <>
            <Head title="Edit Notice" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Notice"
                    description="Update the notice details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(update(notice.id).url);
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
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update notice</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
