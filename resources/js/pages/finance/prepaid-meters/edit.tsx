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

type Apartment = { id: number; apartment_number: string };

type MeterData = {
    apartment_id: string;
    meter_number: string;
    meter_type: string;
    is_active: boolean;
};

export default function EditPrepaidMeter({
    meter,
    apartments,
}: {
    meter: { id: number; apartment_id: number | null; meter_number: string | null; meter_type: string; is_active: boolean };
    apartments: Apartment[];
}) {
    const { data, setData, put, processing, errors } = useForm<MeterData>({
        apartment_id: meter.apartment_id ? String(meter.apartment_id) : '',
        meter_number: meter.meter_number ?? '',
        meter_type: meter.meter_type,
        is_active: meter.is_active,
    });

    return (
        <>
            <Head title="Edit Prepaid Meter" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Prepaid Meter"
                    description="Update meter details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/prepaid-meters/${meter.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="meter_number">Meter number</Label>
                        <Input
                            id="meter_number"
                            value={data.meter_number}
                            onChange={(e) => setData('meter_number', e.target.value)}
                        />
                        <InputError message={errors.meter_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Meter type</Label>
                        <Select value={data.meter_type} onValueChange={(v) => setData('meter_type', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select meter type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electric">Electric</SelectItem>
                                <SelectItem value="water">Water</SelectItem>
                                <SelectItem value="gas">Gas</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.meter_type} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Apartment</Label>
                        <Select value={data.apartment_id} onValueChange={(v) => setData('apartment_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select apartment (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {apartments.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>
                                        {a.apartment_number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.apartment_id} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update Meter</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditPrepaidMeter.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Prepaid Meters', href: '/prepaid-meters' },
        { title: 'Edit', href: '#' },
    ],
};
