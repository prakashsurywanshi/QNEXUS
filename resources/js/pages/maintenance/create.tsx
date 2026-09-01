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
import { create } from '@/routes/maintenance';

type MaintenanceData = {
    cost_type: string;
    unit_name: string;
    set_value: string;
};

export default function CreateMaintenance() {
    const { data, setData, post, processing, errors } = useForm<MaintenanceData>({
        cost_type: 'fixedValue',
        unit_name: '',
        set_value: '',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Maintenance Charge" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Maintenance Charge" description="Define a maintenance cost type" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="cost_type">Cost type</Label>
                        <Select value={data.cost_type} onValueChange={(v) => setData('cost_type', v)}>
                            <SelectTrigger id="cost_type" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixedValue">Fixed value</SelectItem>
                                <SelectItem value="unitType">Unit type</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.cost_type} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="unit_name">Unit name</Label>
                        <Input id="unit_name" name="unit_name" value={data.unit_name} onChange={(e) => setData('unit_name', e.target.value)} placeholder="e.g. per sq ft" />
                        <InputError message={errors.unit_name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="set_value">Set value</Label>
                        <Input id="set_value" name="set_value" type="number" step="0.01" min={0} value={data.set_value} onChange={(e) => setData('set_value', e.target.value)} />
                        <InputError message={errors.set_value} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save</Button>
                    </div>
                </form>
            </div>
        </>
    );
}