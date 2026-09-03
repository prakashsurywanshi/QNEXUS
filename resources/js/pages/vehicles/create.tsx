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

type User = { id: number; name: string };
type Apartment = { id: number; apartment_number: string };
type ParkingSlot = { id: number; parking_code: string; status: string };

type VehicleData = {
    apartment_management_id: string;
    owner_user_id: string;
    vehicle_number: string;
    vehicle_type: 'two_wheeler' | 'four_wheeler' | 'commercial';
    make: string;
    model: string;
    color: string;
    sticker_number: string;
    parking_management_id: string;
    is_primary: boolean;
};

export default function CreateVehicle({
    users,
    apartments,
    parkingSlots,
}: {
    users: User[];
    apartments: Apartment[];
    parkingSlots: ParkingSlot[];
}) {
    const { data, setData, post, processing, errors } = useForm<VehicleData>({
        apartment_management_id: '',
        owner_user_id: '',
        vehicle_number: '',
        vehicle_type: 'four_wheeler',
        make: '',
        model: '',
        color: '',
        sticker_number: '',
        parking_management_id: '',
        is_primary: false,
    });

    return (
        <>
            <Head title="Register Vehicle" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Register Vehicle"
                    description="Register a new vehicle and allocate parking"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/vehicles');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Apartment</Label>
                            <Select
                                value={data.apartment_management_id || undefined}
                                onValueChange={(v) => setData('apartment_management_id', v)}
                            >
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
                            <InputError message={errors.apartment_management_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Owner</Label>
                            <Select
                                value={data.owner_user_id || undefined}
                                onValueChange={(v) => setData('owner_user_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select owner (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.owner_user_id} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="vehicle_number">Vehicle Number *</Label>
                            <Input
                                id="vehicle_number"
                                value={data.vehicle_number}
                                onChange={(e) => setData('vehicle_number', e.target.value)}
                                required
                                placeholder="e.g. MH 12 AB 1234"
                            />
                            <InputError message={errors.vehicle_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Vehicle Type *</Label>
                            <Select
                                value={data.vehicle_type}
                                onValueChange={(v) => setData('vehicle_type', v as VehicleData['vehicle_type'])}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="two_wheeler">2 Wheeler</SelectItem>
                                    <SelectItem value="four_wheeler">4 Wheeler</SelectItem>
                                    <SelectItem value="commercial">Commercial</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.vehicle_type} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="make">Make</Label>
                            <Input
                                id="make"
                                value={data.make}
                                onChange={(e) => setData('make', e.target.value)}
                                placeholder="e.g. Maruti, Honda"
                            />
                            <InputError message={errors.make} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                value={data.model}
                                onChange={(e) => setData('model', e.target.value)}
                                placeholder="e.g. Swift"
                            />
                            <InputError message={errors.model} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                                id="color"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                placeholder="e.g. Red"
                            />
                            <InputError message={errors.color} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="sticker_number">Sticker Number</Label>
                            <Input
                                id="sticker_number"
                                value={data.sticker_number}
                                onChange={(e) => setData('sticker_number', e.target.value)}
                                placeholder="Society parking sticker"
                            />
                            <InputError message={errors.sticker_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Parking Slot</Label>
                            <Select
                                value={data.parking_management_id || undefined}
                                onValueChange={(v) => setData('parking_management_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parking slot (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {parkingSlots.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.parking_code} — {p.status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.parking_management_id} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_primary"
                            type="checkbox"
                            checked={data.is_primary}
                            onChange={(e) => setData('is_primary', e.target.checked)}
                            className="size-4 rounded border-gray-300"
                        />
                        <Label htmlFor="is_primary">Primary vehicle</Label>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Register Vehicle</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateVehicle.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Vehicles', href: '/vehicles' },
        { title: 'New', href: '/vehicles/create' },
    ],
};
