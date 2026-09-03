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

type ParkingData = {
    parking_code: string;
    status: 'available' | 'not_available';
};

export default function EditParking({
    parking,
}: {
    parking: { id: number } & ParkingData;
}) {
    const { data, setData, put, processing, errors } = useForm<ParkingData>({
        parking_code: parking.parking_code,
        status: parking.status,
    });

    return (
        <>
            <Head title="Edit Parking" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Parking"
                    description="Update the parking slot"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/parking/${parking.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="parking_code">Parking code</Label>
                        <Input
                            id="parking_code"
                            name="parking_code"
                            value={data.parking_code}
                            onChange={(e) => setData('parking_code', e.target.value)}
                            required
                        />
                        <InputError message={errors.parking_code} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v as ParkingData['status'])}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="not_available">Not available</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update parking</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
