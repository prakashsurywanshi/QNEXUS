import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type AmenityBookingData = {
    amenity_name: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    guest_count: string;
    notes: string;
};

export default function CreateAmenityBooking() {
    const { data, setData, post, processing, errors } = useForm<AmenityBookingData>({
        amenity_name: '',
        booking_date: '',
        start_time: '',
        end_time: '',
        guest_count: '',
        notes: '',
    });

    return (
        <>
            <Head title="New Amenity Booking" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Amenity Booking"
                    description="Book an amenity for this society"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/amenity-bookings');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="amenity_name">Amenity name</Label>
                        <Input
                            id="amenity_name"
                            name="amenity_name"
                            value={data.amenity_name}
                            onChange={(e) => setData('amenity_name', e.target.value)}
                            required
                            placeholder="e.g. Swimming Pool"
                        />
                        <InputError message={errors.amenity_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="booking_date">Booking date</Label>
                        <Input
                            id="booking_date"
                            name="booking_date"
                            type="date"
                            value={data.booking_date}
                            onChange={(e) => setData('booking_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.booking_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="start_time">Start time</Label>
                        <Input
                            id="start_time"
                            name="start_time"
                            type="time"
                            value={data.start_time}
                            onChange={(e) => setData('start_time', e.target.value)}
                            required
                        />
                        <InputError message={errors.start_time} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="end_time">End time</Label>
                        <Input
                            id="end_time"
                            name="end_time"
                            type="time"
                            value={data.end_time}
                            onChange={(e) => setData('end_time', e.target.value)}
                            required
                        />
                        <InputError message={errors.end_time} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="guest_count">Guest count</Label>
                        <Input
                            id="guest_count"
                            name="guest_count"
                            type="number"
                            value={data.guest_count}
                            onChange={(e) => setData('guest_count', e.target.value)}
                            placeholder="1"
                        />
                        <InputError message={errors.guest_count} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Any additional notes..."
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create booking</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
