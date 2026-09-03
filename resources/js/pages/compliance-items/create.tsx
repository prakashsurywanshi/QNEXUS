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

type User = { id: number; name: string };

type ComplianceItemData = {
    category: string;
    item_name: string;
    description: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    last_completed: string;
    next_due: string;
    assigned_to: string;
};

export default function CreateComplianceItem({ users }: { users: User[] }) {
    const { data, setData, post, processing, errors } = useForm<ComplianceItemData>({
        category: '',
        item_name: '',
        description: '',
        due_date: '',
        status: 'pending',
        last_completed: '',
        next_due: '',
        assigned_to: '',
    });

    return (
        <>
            <Head title="New Compliance Item" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Compliance Item"
                    description="Create a new compliance task"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/compliance-items');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="item_name">Item name *</Label>
                        <Input
                            id="item_name"
                            value={data.item_name}
                            onChange={(e) => setData('item_name', e.target.value)}
                            required
                            placeholder="e.g. Fire Safety Inspection"
                        />
                        <InputError message={errors.item_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category *</Label>
                        <Input
                            id="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            required
                            placeholder="e.g. Safety, Maintenance"
                        />
                        <InputError message={errors.category} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as ComplianceItemData['status'])}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                            />
                            <InputError message={errors.due_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="next_due">Next Due</Label>
                            <Input
                                id="next_due"
                                type="date"
                                value={data.next_due}
                                onChange={(e) => setData('next_due', e.target.value)}
                            />
                            <InputError message={errors.next_due} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_completed">Last Completed</Label>
                        <Input
                            id="last_completed"
                            type="date"
                            value={data.last_completed}
                            onChange={(e) => setData('last_completed', e.target.value)}
                        />
                        <InputError message={errors.last_completed} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Assigned To</Label>
                        <Select value={data.assigned_to} onValueChange={(v) => setData('assigned_to', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select assignee (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.assigned_to} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe the compliance item"
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Compliance Item</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateComplianceItem.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Compliance Items', href: '/compliance-items' },
        { title: 'New', href: '/compliance-items/create' },
    ],
};
