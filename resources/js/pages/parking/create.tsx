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

export default function CreateParking() {
    const { data, setData, post, processing, errors } = useForm<ParkingData>({
        parking_code: '',
        status: 'not_available',
    });

    return (
        <>
            <Head title="Add Parking" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Add Parking"
                    description="Add a new parking slot for this society"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/parking');
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
                            placeholder="e.g. P-001"
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
                        <Button disabled={processing}>Save parking</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
