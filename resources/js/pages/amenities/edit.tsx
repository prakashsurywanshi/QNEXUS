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
import { update } from '@/routes/amenities';

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

export default function EditAmenity({ amenity }: { amenity: { id: number } & AmenityData }) {
    const { data, setData, put, processing, errors } = useForm<AmenityData>({
        amenities_name: amenity.amenities_name,
        status: amenity.status,
        booking_status: amenity.booking_status,
        start_time: amenity.start_time ?? '',
        end_time: amenity.end_time ?? '',
        slot_time: amenity.slot_time ?? '',
        multiple_booking_status: amenity.multiple_booking_status,
        number_of_person: amenity.number_of_person ?? '',
    });

    return (
        <>
            <Head title="Edit Amenity" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Amenity"
                    description="Update this amenity for the society"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(update(amenity.id).url);
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
                        <Button disabled={processing}>Update amenity</Button>
                    </div>
                </form>
            </div>
        </>
    );
}