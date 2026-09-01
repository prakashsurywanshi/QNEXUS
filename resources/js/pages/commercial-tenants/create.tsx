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
import { create } from '@/routes/commercial-tenants';

type TenantData = {
    building_id: string;
    user_id: string;
    company_name: string;
    contact_name: string;
    email: string;
    phone: string;
    unit_number: string;
    unit_area: string;
    rent_amount: string;
    security_deposit: string;
    unit_type: string;
    status: string;
};

interface Option {
    id: number;
    name?: string | null;
}

export default function CreateCommercialTenant({
    buildings,
    users,
}: {
    buildings: Option[];
    users: Option[];
}) {
    const { data, setData, post, processing, errors } = useForm<TenantData>({
        building_id: '',
        user_id: '',
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        unit_number: '',
        unit_area: '0',
        rent_amount: '0',
        security_deposit: '0',
        unit_type: 'office',
        status: 'vacant',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Commercial Tenant" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Commercial Tenant" description="Create a new commercial tenant" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company_name">Company name</Label>
                            <Input id="company_name" name="company_name" value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} />
                            <InputError message={errors.company_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contact_name">Contact name</Label>
                            <Input id="contact_name" name="contact_name" value={data.contact_name} onChange={(e) => setData('contact_name', e.target.value)} />
                            <InputError message={errors.contact_name} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="building_id">Building</Label>
                            <Select value={data.building_id} onValueChange={(v) => setData('building_id', v)}>
                                <SelectTrigger id="building_id" className="w-full"><SelectValue placeholder="Select building" /></SelectTrigger>
                                <SelectContent>
                                    {buildings.map((b) => (
                                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.building_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="user_id">Linked user</Label>
                            <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                                <SelectTrigger id="user_id" className="w-full"><SelectValue placeholder="No linked user" /></SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.user_id} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="unit_number">Unit number</Label>
                            <Input id="unit_number" name="unit_number" value={data.unit_number} onChange={(e) => setData('unit_number', e.target.value)} required />
                            <InputError message={errors.unit_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="unit_area">Unit area (sqft)</Label>
                            <Input id="unit_area" name="unit_area" type="number" step="0.01" min={0} value={data.unit_area} onChange={(e) => setData('unit_area', e.target.value)} />
                            <InputError message={errors.unit_area} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rent_amount">Rent amount</Label>
                            <Input id="rent_amount" name="rent_amount" type="number" step="0.01" min={0} value={data.rent_amount} onChange={(e) => setData('rent_amount', e.target.value)} />
                            <InputError message={errors.rent_amount} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="security_deposit">Security deposit</Label>
                            <Input id="security_deposit" name="security_deposit" type="number" step="0.01" min={0} value={data.security_deposit} onChange={(e) => setData('security_deposit', e.target.value)} />
                            <InputError message={errors.security_deposit} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="unit_type">Unit type</Label>
                            <Select value={data.unit_type} onValueChange={(v) => setData('unit_type', v)}>
                                <SelectTrigger id="unit_type" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="office">Office</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="warehouse">Warehouse</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.unit_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vacant">Vacant</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="under_maintenance">Under maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save tenant</Button>
                    </div>
                </form>
            </div>
        </>
    );
}