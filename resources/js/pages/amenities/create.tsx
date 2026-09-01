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
import { create } from '@/routes/amenities';

type AmenityData = {
    amenities_name: string;
    status: 'available' | 'not_available';
    booking_status: boolean;
    start_time: string;
    end_time: string;
    slot_time: string;
    multiple_booking_status: boolean;
    number_of_person: string;
};

export default function CreateAmenity() {
    const { data, setData, post, processing, errors } = useForm<AmenityData>({
        amenities_name: '',
        status: 'available',
        booking_status: false,
        start_time: '',
        end_time: '',
        slot_time: '',
        multiple_booking_status: false,
        number_of_person: '',
    });

    return (
        <>
            <Head title="Add Amenity" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Add Amenity"
                    description="Create a new bookable amenity for this society"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(create().url);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="amenities_name">Amenity name</Label>
                        <Input
                            id="amenities_name"
                            name="amenities_name"
                            value={data.amenities_name}
                            onChange={(e) => setData('amenities_name', e.target.value)}
                            required
                            placeholder="e.g. Swimming Pool"
                        />
                        <InputError message={errors.amenities_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v as AmenityData['status'])}
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

                    <div className="grid gap-2">
                        <Label htmlFor="slot_time">Slot time (minutes)</Label>
                        <Input
                            id="slot_time"
                            name="slot_time"
                            type="number"
                            value={data.slot_time}
                            onChange={(e) => setData('slot_time', e.target.value)}
                            placeholder="e.g. 60"
                        />
                        <InputError message={errors.slot_time} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="number_of_person">Number of persons</Label>
                        <Input
                            id="number_of_person"
                            name="number_of_person"
                            type="number"
                            value={data.number_of_person}
                            onChange={(e) => setData('number_of_person', e.target.value)}
                            placeholder="e.g. 10"
                        />
                        <InputError message={errors.number_of_person} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save amenity</Button>
                    </div>
                </form>
            </div>
        </>
    );
}