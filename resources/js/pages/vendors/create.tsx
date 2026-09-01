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
import { create } from '@/routes/vendors';

type VendorData = {
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    category: string;
    address: string;
    status: string;
};

export default function CreateVendor() {
    const { data, setData, post, processing, errors } = useForm<VendorData>({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        category: '',
        address: '',
        status: 'active',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Vendor" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Vendor" description="Register a new vendor" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="e.g. ACME Supplies" />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_person">Contact person</Label>
                            <Input id="contact_person" name="contact_person" value={data.contact_person} onChange={(e) => setData('contact_person', e.target.value)} />
                            <InputError message={errors.contact_person} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                            <InputError message={errors.category} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" name="address" rows={3} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        <InputError message={errors.address} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save vendor</Button>
                    </div>
                </form>
            </div>
        </>
    );
}