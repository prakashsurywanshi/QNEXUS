import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
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
import { update } from '@/routes/events';

type EventData = {
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
    recurrence_pattern: string;
    status: string;
};

interface EventProps {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    is_recurring: boolean;
    recurrence_pattern: string | null;
    status: string;
}

export default function EditEvent({ event }: { event: EventProps }) {
    const { data, setData, put, processing, errors } = useForm<EventData>({
        title: event.title,
        description: event.description ?? '',
        location: event.location ?? '',
        start_date: event.start_date ?? '',
        end_date: event.end_date ?? '',
        start_time: event.start_time ? String(event.start_time).slice(0, 5) : '',
        end_time: event.end_time ? String(event.end_time).slice(0, 5) : '',
        is_recurring: Boolean(event.is_recurring),
        recurrence_pattern: event.recurrence_pattern ?? '',
        status: event.status,
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(event.id).url);
    };

    return (
        <>
            <Head title="Edit Event" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Edit Event" description="Update the event details" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                        <InputError message={errors.title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" rows={4} value={data.description} onChange={(e) => setData('description', e.target.value)} required />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={data.location} onChange={(e) => setData('location', e.target.value)} required />
                        <InputError message={errors.location} />
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start_time">Start time</Label>
                            <Input id="start_time" name="start_time" type="time" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} required />
                            <InputError message={errors.start_time} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_time">End time</Label>
                            <Input id="end_time" name="end_time" type="time" value={data.end_time} onChange={(e) => setData('end_time', e.target.value)} required />
                            <InputError message={errors.end_time} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="is_recurring"
                            type="checkbox"
                            checked={data.is_recurring}
                            onChange={(e) => setData('is_recurring', e.target.checked)}
                            className="size-4"
                        />
                        <Label htmlFor="is_recurring">Recurring event</Label>
                    </div>
                    {data.is_recurring && (
                        <div className="grid gap-2">
                            <Label htmlFor="recurrence_pattern">Recurrence pattern</Label>
                            <Input id="recurrence_pattern" name="recurrence_pattern" value={data.recurrence_pattern} onChange={(e) => setData('recurrence_pattern', e.target.value)} />
                            <InputError message={errors.recurrence_pattern} />
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update event</Button>
                    </div>
                </form>
            </div>
        </>
    );
}