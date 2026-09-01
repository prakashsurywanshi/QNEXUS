import { useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { create } from '@/routes/polls';

type PollForm = {
    title: string;
    description: string;
    poll_type: string;
    start_date: string;
    end_date: string;
    status: string;
    results_visible: boolean;
};

export default function CreatePoll() {
    const { data, setData, processing, errors } = useForm<PollForm>({
        title: '',
        description: '',
        poll_type: 'normal',
        start_date: '',
        end_date: '',
        status: 'draft',
        results_visible: true,
    });
    const [optionsText, setOptionsText] = useState('');

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(create().url, {
            ...data,
            options: optionsText
                .split('\n')
                .map((o) => o.trim())
                .filter(Boolean),
        });
    };

    return (
        <>
            <Head title="Add Poll" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Poll" description="Create a new poll for the society" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required placeholder="e.g. Choose clubhouse opening time" />
                        <InputError message={errors.title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="poll_type">Poll type</Label>
                        <Select value={data.poll_type} onValueChange={(v) => setData('poll_type', v)}>
                            <SelectTrigger id="poll_type" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="secret">Secret</SelectItem>
                                <SelectItem value="election">Election</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.poll_type} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start date</Label>
                            <Input id="start_date" name="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />
                            <InputError message={errors.start_date} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_date">End date</Label>
                            <Input id="end_date" name="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} required />
                            <InputError message={errors.end_date} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="options">Options (one per line)</Label>
                        <Textarea
                            id="options"
                            name="options"
                            rows={4}
                            value={optionsText}
                            onChange={(e) => setOptionsText(e.target.value)}
                            placeholder={'Morning slot\nEvening slot'}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="results_visible"
                            type="checkbox"
                            checked={data.results_visible}
                            onChange={(e) => setData('results_visible', e.target.checked)}
                            className="size-4"
                        />
                        <Label htmlFor="results_visible">Show results after voting</Label>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save poll</Button>
                    </div>
                </form>
            </div>
        </>
    );
}