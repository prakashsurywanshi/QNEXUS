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
import { Plus, Trash2 } from 'lucide-react';

type User = { id: number; name: string };

type MinuteEntry = {
    agenda_item: string;
    discussion: string;
    decision: string;
    assigned_to: string;
    due_date: string;
    status: string;
};

type AttendeeEntry = {
    user_id: string;
    attendance_status: string;
};

type MeetingData = {
    title: string;
    description: string;
    meeting_date: string;
    meeting_time: string;
    location: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    minutes: MinuteEntry[];
    attendees: AttendeeEntry[];
};

const emptyMinute: MinuteEntry = {
    agenda_item: '',
    discussion: '',
    decision: '',
    assigned_to: '',
    due_date: '',
    status: 'pending',
};

const emptyAttendee: AttendeeEntry = {
    user_id: '',
    attendance_status: 'present',
};

export default function CreateMeeting({ users }: { users: User[] }) {
    const { data, setData, post, processing, errors } = useForm<MeetingData>({
        title: '',
        description: '',
        meeting_date: '',
        meeting_time: '',
        location: '',
        status: 'scheduled',
        minutes: [],
        attendees: [],
    });

    const addMinute = () => setData('minutes', [...data.minutes, { ...emptyMinute }]);
    const removeMinute = (i: number) => setData('minutes', data.minutes.filter((_, idx) => idx !== i));
    const updateMinute = (i: number, field: keyof MinuteEntry, value: string) => {
        const updated = [...data.minutes];
        updated[i] = { ...updated[i], [field]: value };
        setData('minutes', updated);
    };

    const addAttendee = () => setData('attendees', [...data.attendees, { ...emptyAttendee }]);
    const removeAttendee = (i: number) => setData('attendees', data.attendees.filter((_, idx) => idx !== i));
    const updateAttendee = (i: number, field: keyof AttendeeEntry, value: string) => {
        const updated = [...data.attendees];
        updated[i] = { ...updated[i], [field]: value };
        setData('attendees', updated);
    };

    return (
        <>
            <Head title="New Meeting" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Meeting"
                    description="Schedule a new meeting"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/meetings');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                            placeholder="e.g. Monthly Maintenance Review"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="meeting_date">Date *</Label>
                            <Input
                                id="meeting_date"
                                type="date"
                                value={data.meeting_date}
                                onChange={(e) => setData('meeting_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.meeting_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meeting_time">Time *</Label>
                            <Input
                                id="meeting_time"
                                type="time"
                                value={data.meeting_time}
                                onChange={(e) => setData('meeting_time', e.target.value)}
                                required
                            />
                            <InputError message={errors.meeting_time} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Location</Label>
                        <Input
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            placeholder="e.g. Community Hall"
                        />
                        <InputError message={errors.location} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as MeetingData['status'])}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Meeting agenda or description"
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Minutes */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Meeting Minutes</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addMinute}>
                                <Plus className="mr-1 size-4" />
                                Add Minute
                            </Button>
                        </div>
                        {data.minutes.map((minute, i) => (
                            <div key={i} className="rounded-lg border p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Minute {i + 1}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeMinute(i)}>
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Agenda Item *</Label>
                                    <Input
                                        value={minute.agenda_item}
                                        onChange={(e) => updateMinute(i, 'agenda_item', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Discussion</Label>
                                    <Textarea
                                        value={minute.discussion}
                                        onChange={(e) => updateMinute(i, 'discussion', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Decision</Label>
                                    <Input
                                        value={minute.decision}
                                        onChange={(e) => updateMinute(i, 'decision', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label>Assigned To</Label>
                                        <Select value={minute.assigned_to} onValueChange={(v) => updateMinute(i, 'assigned_to', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((u) => (
                                                    <SelectItem key={u.id} value={String(u.id)}>
                                                        {u.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Due Date</Label>
                                        <Input
                                            type="date"
                                            value={minute.due_date}
                                            onChange={(e) => updateMinute(i, 'due_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Status</Label>
                                        <Select value={minute.status} onValueChange={(v) => updateMinute(i, 'status', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Attendees */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Attendees</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addAttendee}>
                                <Plus className="mr-1 size-4" />
                                Add Attendee
                            </Button>
                        </div>
                        {data.attendees.map((attendee, i) => (
                            <div key={i} className="flex items-end gap-3 rounded-lg border p-4">
                                <div className="flex-1 grid gap-2">
                                    <Label>User *</Label>
                                    <Select value={attendee.user_id} onValueChange={(v) => updateAttendee(i, 'user_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)}>
                                                    {u.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-40 grid gap-2">
                                    <Label>Status</Label>
                                    <Select value={attendee.attendance_status} onValueChange={(v) => updateAttendee(i, 'attendance_status', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="present">Present</SelectItem>
                                            <SelectItem value="absent">Absent</SelectItem>
                                            <SelectItem value="apology">Apology</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeAttendee(i)}>
                                    <Trash2 className="size-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Meeting</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateMeeting.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Meetings', href: '/meetings' },
        { title: 'New', href: '/meetings/create' },
    ],
};
