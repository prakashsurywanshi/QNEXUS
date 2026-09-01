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
import { create } from '@/routes/gatepasses';

type GatepassData = {
    apartment_id: string;
    item_description: string;
    quantity: string;
    gatepass_type: string;
    vehicle_number: string;
    driver_name: string;
    driver_phone: string;
    status: string;
};

export default function CreateGatepass({
    apartments,
}: {
    apartments: { id: number; apartment_number: string | null }[];
}) {
    const { data, setData, post, processing, errors } = useForm<GatepassData>({
        apartment_id: '',
        item_description: '',
        quantity: '1',
        gatepass_type: 'out',
        vehicle_number: '',
        driver_name: '',
        driver_phone: '',
        status: 'pending',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Gatepass" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Gatepass" description="Create a new gate entry/exit pass" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="item_description">Item description</Label>
                        <Input id="item_description" name="item_description" value={data.item_description} onChange={(e) => setData('item_description', e.target.value)} required placeholder="e.g. Home appliances delivery" />
                        <InputError message={errors.item_description} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gatepass_type">Type</Label>
                        <Select value={data.gatepass_type} onValueChange={(v) => setData('gatepass_type', v)}>
                            <SelectTrigger id="gatepass_type" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="in">In</SelectItem>
                                <SelectItem value="out">Out</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.gatepass_type} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="apartment_id">Apartment</Label>
                        <Select value={data.apartment_id} onValueChange={(v) => setData('apartment_id', v)}>
                            <SelectTrigger id="apartment_id" className="w-full"><SelectValue placeholder="Select apartment" /></SelectTrigger>
                            <SelectContent>
                                {apartments.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>{a.apartment_number || `#${a.id}`}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.apartment_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" name="quantity" type="number" min={1} value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} />
                        <InputError message={errors.quantity} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="vehicle_number">Vehicle number</Label>
                        <Input id="vehicle_number" name="vehicle_number" value={data.vehicle_number} onChange={(e) => setData('vehicle_number', e.target.value)} />
                        <InputError message={errors.vehicle_number} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="driver_name">Driver name</Label>
                        <Input id="driver_name" name="driver_name" value={data.driver_name} onChange={(e) => setData('driver_name', e.target.value)} />
                        <InputError message={errors.driver_name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="driver_phone">Driver phone</Label>
                        <Input id="driver_phone" name="driver_phone" value={data.driver_phone} onChange={(e) => setData('driver_phone', e.target.value)} />
                        <InputError message={errors.driver_phone} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save gatepass</Button>
                    </div>
                </form>
            </div>
        </>
    );
}