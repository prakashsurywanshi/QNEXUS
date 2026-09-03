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
import { Textarea } from '@/components/ui/textarea';

interface AmenityBooking {
    id: number;
    amenity_name: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    guest_count: number | null;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    notes: string | null;
}

const statuses = ['pending', 'approved', 'rejected', 'cancelled'] as const;

export default function EditAmenityBooking({ booking }: { booking: AmenityBooking }) {
    const { data, setData, put, processing, errors } = useForm<{
        amenity_name: string;
        booking_date: string;
        start_time: string;
        end_time: string;
        guest_count: string;
        notes: string;
        status: AmenityBooking['status'];
    }>({
        amenity_name: booking.amenity_name,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        guest_count: booking.guest_count != null ? String(booking.guest_count) : '',
        notes: booking.notes ?? '',
        status: booking.status,
    });

    return (
        <>
            <Head title={`Edit Booking #${booking.id}`} />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title={`Edit Booking #${booking.id}`} />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/amenity-bookings/${booking.id}`);
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

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v as AmenityBooking['status'])}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status} className="capitalize">
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save changes</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
