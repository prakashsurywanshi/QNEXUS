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
import { update } from '@/routes/cam-charges';

type CamChargeData = {
    fiscal_year: string;
    total_budget: string;
    total_area: string;
    rate_per_sqft: string;
    status: string;
    notes: string;
};

interface CamChargeProps {
    id: number;
    fiscal_year: string;
    total_budget: string | null;
    total_area: string | null;
    rate_per_sqft: string | null;
    status: string;
    notes: string | null;
}

export default function EditCamCharge({ camCharge }: { camCharge: CamChargeProps }) {
    const { data, setData, put, processing, errors } = useForm<CamChargeData>({
        fiscal_year: camCharge.fiscal_year,
        total_budget: camCharge.total_budget ?? '0',
        total_area: camCharge.total_area ?? '0',
        rate_per_sqft: camCharge.rate_per_sqft ?? '0',
        status: camCharge.status,
        notes: camCharge.notes ?? '',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(camCharge.id).url);
    };

    return (
        <>
            <Head title="Edit CAM Charge" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Edit CAM Charge" description="Update the CAM charge details" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fiscal_year">Fiscal year</Label>
                            <Input id="fiscal_year" name="fiscal_year" value={data.fiscal_year} onChange={(e) => setData('fiscal_year', e.target.value)} required placeholder="e.g. 2026-2027" />
                            <InputError message={errors.fiscal_year} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="total_budget">Total budget</Label>
                            <Input id="total_budget" name="total_budget" type="number" step="0.01" min={0} value={data.total_budget} onChange={(e) => setData('total_budget', e.target.value)} />
                            <InputError message={errors.total_budget} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="total_area">Total area (sqft)</Label>
                            <Input id="total_area" name="total_area" type="number" step="0.01" min={0} value={data.total_area} onChange={(e) => setData('total_area', e.target.value)} />
                            <InputError message={errors.total_area} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="rate_per_sqft">Rate per sqft</Label>
                        <Input id="rate_per_sqft" name="rate_per_sqft" type="number" step="0.0001" min={0} value={data.rate_per_sqft} onChange={(e) => setData('rate_per_sqft', e.target.value)} />
                        <InputError message={errors.rate_per_sqft} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        <InputError message={errors.notes} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update CAM charge</Button>
                    </div>
                </form>
            </div>
        </>
    );
}