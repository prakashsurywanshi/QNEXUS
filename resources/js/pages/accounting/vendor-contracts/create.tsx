import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

type Vendor = { id: number; name: string };

type ContractData = {
    vendor_id: string;
    contract_number: string;
    title: string;
    description: string;
    contract_value: string;
    start_date: string;
    end_date: string;
    status: 'draft' | 'active' | 'expired' | 'terminated';
    payment_terms: string;
    auto_renew: boolean;
};

export default function CreateVendorContract({ vendors }: { vendors: Vendor[] }) {
    const { data, setData, post, processing, errors } = useForm<ContractData>({
        vendor_id: '',
        contract_number: '',
        title: '',
        description: '',
        contract_value: '',
        start_date: '',
        end_date: '',
        status: 'draft',
        payment_terms: '',
        auto_renew: false,
    });

    return (
        <>
            <Head title="New Vendor Contract" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Vendor Contract"
                    description="Create a new vendor contract"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/vendor-contracts');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label>Vendor *</Label>
                        <Select value={data.vendor_id} onValueChange={(v) => setData('vendor_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
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

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="contract_number">Contract Number *</Label>
                            <Input
                                id="contract_number"
                                value={data.contract_number}
                                onChange={(e) => setData('contract_number', e.target.value)}
                                required
                                placeholder="e.g. CON-0001"
                            />
                            <InputError message={errors.contract_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                placeholder="Contract title"
                            />
                            <InputError message={errors.title} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            placeholder="Contract description"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="contract_value">Contract Value</Label>
                            <Input
                                id="contract_value"
                                type="number"
                                step="0.01"
                                value={data.contract_value}
                                onChange={(e) => setData('contract_value', e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.contract_value} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start Date *</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                            <InputError message={errors.end_date} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as ContractData['status'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="terminated">Terminated</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="payment_terms">Payment Terms</Label>
                        <Textarea
                            id="payment_terms"
                            value={data.payment_terms}
                            onChange={(e) => setData('payment_terms', e.target.value)}
                            rows={2}
                            placeholder="Payment terms"
                        />
                        <InputError message={errors.payment_terms} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="auto_renew"
                            checked={data.auto_renew}
                            onCheckedChange={(v) => setData('auto_renew', v === true)}
                        />
                        <Label htmlFor="auto_renew">Auto Renew</Label>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Contract</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateVendorContract.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Vendor Contracts', href: '/vendor-contracts' },
        { title: 'New', href: '/vendor-contracts/create' },
    ],
};
