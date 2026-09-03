import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
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

type StaffData = {
    name: string;
    phone: string;
    email: string;
    designation: string;
    shift: 'morning' | 'evening' | 'night' | 'general';
    photo: string;
    date_joined: string;
    is_active: boolean;
};

export default function EditStaff({ staff }: { staff: { id: number } & StaffData }) {
    const { data, setData, put, processing, errors } = useForm<StaffData>({
        name: staff.name,
        phone: staff.phone ?? '',
        email: staff.email ?? '',
        designation: staff.designation,
        shift: staff.shift,
        photo: staff.photo ?? '',
        date_joined: staff.date_joined ?? '',
        is_active: staff.is_active,
    });

    return (
        <>
            <Head title="Edit Staff" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Staff"
                    description="Update staff member details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/staff/${staff.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="e.g. Ramesh Kumar"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Designation *</Label>
                            <Select
                                value={data.designation || undefined}
                                onValueChange={(v) => setData('designation', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select designation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Security Guard">Security Guard</SelectItem>
                                    <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                                    <SelectItem value="Gardener">Gardener</SelectItem>
                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                    <SelectItem value="Garbage Collector">Garbage Collector</SelectItem>
                                    <SelectItem value="DTH Technician">DTH Technician</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.designation} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="e.g. +91 9876543210"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="staff@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label>Shift *</Label>
                            <Select
                                value={data.shift}
                                onValueChange={(v) => setData('shift', v as StaffData['shift'])}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="morning">Morning</SelectItem>
                                    <SelectItem value="evening">Evening</SelectItem>
                                    <SelectItem value="night">Night</SelectItem>
                                    <SelectItem value="general">General</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.shift} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date_joined">Date Joined</Label>
                            <Input
                                id="date_joined"
                                type="date"
                                value={data.date_joined}
                                onChange={(e) => setData('date_joined', e.target.value)}
                            />
                            <InputError message={errors.date_joined} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="photo">Photo URL</Label>
                            <Input
                                id="photo"
                                value={data.photo}
                                onChange={(e) => setData('photo', e.target.value)}
                                placeholder="https://..."
                            />
                            <InputError message={errors.photo} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="size-4 rounded border-gray-300"
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save Changes</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditStaff.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Staff', href: '/staff' },
        { title: 'Edit', href: '/staff' },
    ],
};
