import { Head, useForm } from '@inertiajs/react';
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
import { dashboard } from '@/routes';

interface Amc {
    id: number;
    reference_no: string | null;
    service_name: string | null;
    start_date: string | null;
    end_date: string | null;
    cost: string | number | null;
    frequency: string;
    status: string;
    notes: string | null;
    asset_id: number | null;
    vendor_id: number | null;
}

interface Asset {
    id: number;
    name: string;
}

interface Vendor {
    id: number;
    name: string;
}

export default function EditAmc({ amc, assets, vendors }: { amc: Amc; assets: Asset[]; vendors: Vendor[] }) {
    const { data, setData, put, processing, errors } = useForm({
        asset_id: amc.asset_id ? String(amc.asset_id) : '',
        vendor_id: amc.vendor_id ? String(amc.vendor_id) : '',
        reference_no: amc.reference_no ?? '',
        service_name: amc.service_name ?? '',
        start_date: amc.start_date ?? '',
        end_date: amc.end_date ?? '',
        cost: amc.cost === null ? '' : String(amc.cost),
        frequency: amc.frequency,
        status: amc.status,
        notes: amc.notes ?? '',
    });

    return (
        <>
            <Head title={`Edit AMC #${amc.id}`} />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title={`AMC #AMC-${amc.id}`} description="Edit AMC details" />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/amc/${amc.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="service_name">Service Name</Label>
                            <Input id="service_name" value={data.service_name} onChange={(e) => setData('service_name', e.target.value)} />
                            <InputError message={errors.service_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reference_no">Reference No.</Label>
                            <Input id="reference_no" value={data.reference_no} onChange={(e) => setData('reference_no', e.target.value)} />
                            <InputError message={errors.reference_no} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Asset</Label>
                            <Select value={data.asset_id} onValueChange={(v) => setData('asset_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select asset (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assets.map((a) => (
                                        <SelectItem key={a.id} value={String(a.id)}>
                                            {a.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.asset_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Vendor</Label>
                            <Select value={data.vendor_id} onValueChange={(v) => setData('vendor_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select vendor (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendors.map((v) => (
                                        <SelectItem key={v.id} value={String(v.id)}>
                                            {v.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.vendor_id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                            <InputError message={errors.end_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cost">Cost (₹)</Label>
                            <Input id="cost" type="number" min="0" step="0.01" value={data.cost} onChange={(e) => setData('cost', e.target.value)} />
                            <InputError message={errors.cost} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Frequency</Label>
                            <Select value={data.frequency} onValueChange={(v) => setData('frequency', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="one_time">One Time</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="half_yearly">Half Yearly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.frequency} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditAmc.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'AMC', href: '/amc' },
        { title: 'Edit', href: '#' },
    ],
};
