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
import { create } from '@/routes/lease-agreements';

type LeaseData = {
    commercial_tenant_id: string;
    user_id: string;
    lease_number: string;
    start_date: string;
    end_date: string;
    monthly_rent: string;
    security_deposit: string;
    cam_charges: string;
    rent_escalation_type: string;
    escalation_value: string;
    escalation_frequency_months: string;
    status: string;
    notes: string;
};

interface Option {
    id: number;
    name?: string | null;
    company_name?: string | null;
    unit_number?: string | null;
}

export default function CreateLeaseAgreement({
    commercialTenants,
    users,
}: {
    commercialTenants: Option[];
    users: Option[];
}) {
    const { data, setData, post, processing, errors } = useForm<LeaseData>({
        commercial_tenant_id: '',
        user_id: '',
        lease_number: '',
        start_date: '',
        end_date: '',
        monthly_rent: '0',
        security_deposit: '0',
        cam_charges: '0',
        rent_escalation_type: 'fixed',
        escalation_value: '0',
        escalation_frequency_months: '12',
        status: 'draft',
        notes: '',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Lease Agreement" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Lease Agreement" description="Create a new lease agreement" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="commercial_tenant_id">Commercial tenant</Label>
                            <Select value={data.commercial_tenant_id} onValueChange={(v) => setData('commercial_tenant_id', v)}>
                                <SelectTrigger id="commercial_tenant_id" className="w-full"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                                <SelectContent>
                                    {commercialTenants.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                            {t.company_name ?? t.unit_number ?? `#${t.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.commercial_tenant_id} />
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
                            <Label htmlFor="lease_number">Lease number</Label>
                            <Input id="lease_number" name="lease_number" value={data.lease_number} onChange={(e) => setData('lease_number', e.target.value)} required />
                            <InputError message={errors.lease_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="terminated">Terminated</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
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
                            <Label htmlFor="monthly_rent">Monthly rent</Label>
                            <Input id="monthly_rent" name="monthly_rent" type="number" step="0.01" min={0} value={data.monthly_rent} onChange={(e) => setData('monthly_rent', e.target.value)} required />
                            <InputError message={errors.monthly_rent} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="security_deposit">Security deposit</Label>
                            <Input id="security_deposit" name="security_deposit" type="number" step="0.01" min={0} value={data.security_deposit} onChange={(e) => setData('security_deposit', e.target.value)} />
                            <InputError message={errors.security_deposit} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cam_charges">CAM charges</Label>
                            <Input id="cam_charges" name="cam_charges" type="number" step="0.01" min={0} value={data.cam_charges} onChange={(e) => setData('cam_charges', e.target.value)} />
                            <InputError message={errors.cam_charges} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rent_escalation_type">Escalation type</Label>
                            <Select value={data.rent_escalation_type} onValueChange={(v) => setData('rent_escalation_type', v)}>
                                <SelectTrigger id="rent_escalation_type" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.rent_escalation_type} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="escalation_value">Escalation value</Label>
                            <Input id="escalation_value" name="escalation_value" type="number" step="0.01" min={0} value={data.escalation_value} onChange={(e) => setData('escalation_value', e.target.value)} />
                            <InputError message={errors.escalation_value} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="escalation_frequency_months">Escalation frequency (months)</Label>
                            <Input id="escalation_frequency_months" name="escalation_frequency_months" type="number" min={1} value={data.escalation_frequency_months} onChange={(e) => setData('escalation_frequency_months', e.target.value)} />
                            <InputError message={errors.escalation_frequency_months} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        <InputError message={errors.notes} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save lease</Button>
                    </div>
                </form>
            </div>
        </>
    );
}