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

type User = { id: number; name: string };

type MemberData = {
    user_id: string;
    name: string;
    relationship: string;
    phone: string;
    document_type: string;
    document: string;
};

export default function CreateFamilyMember({ users }: { users: User[] }) {
    const { data, setData, post, processing, errors } = useForm<MemberData>({
        user_id: '',
        name: '',
        relationship: '',
        phone: '',
        document_type: '',
        document: '',
    });

    return (
        <>
            <Head title="Add Family Member" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Add Family Member"
                    description="Add a member to a resident's family profile"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/family-members');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label>Resident *</Label>
                        <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select resident" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.user_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="e.g. Priya Sharma"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <Input
                                id="relationship"
                                value={data.relationship}
                                onChange={(e) => setData('relationship', e.target.value)}
                                placeholder="e.g. Spouse, Parent, Child"
                            />
                            <InputError message={errors.relationship} />
                        </div>

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
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="document_type">Document Type</Label>
                            <Input
                                id="document_type"
                                value={data.document_type}
                                onChange={(e) => setData('document_type', e.target.value)}
                                placeholder="e.g. Aadhaar, Passport"
                            />
                            <InputError message={errors.document_type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="document">Document Number</Label>
                            <Input
                                id="document"
                                value={data.document}
                                onChange={(e) => setData('document', e.target.value)}
                                placeholder="Document ID"
                            />
                            <InputError message={errors.document} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Add Member</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateFamilyMember.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Family Members', href: '/family-members' },
        { title: 'New', href: '/family-members/create' },
    ],
};
