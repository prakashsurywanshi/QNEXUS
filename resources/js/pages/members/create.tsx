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
import { create } from '@/routes/members';

type MemberData = {
    name: string;
    email: string;
    password: string;
    role_id: string;
};

export default function CreateMember({
    roles,
}: {
    roles: { id: number; name: string | null }[];
}) {
    const { data, setData, post, processing, errors } = useForm<MemberData>({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Member" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Member" description="Create a user account and add them to this society" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required autoComplete="new-password" />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role_id">Role</Label>
                        <Select value={data.role_id} onValueChange={(v) => setData('role_id', v)}>
                            <SelectTrigger id="role_id" className="w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r.id} value={String(r.id)}>{r.name || `#${r.id}`}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role_id} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save member</Button>
                    </div>
                </form>
            </div>
        </>
    );
}