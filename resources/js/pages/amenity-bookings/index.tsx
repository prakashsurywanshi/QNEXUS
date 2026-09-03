import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/empty-state';
import { useCan } from '@/lib/permissions';

interface AmenityBooking {
    id: number;
    amenity_name: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    guest_count: number | null;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    user?: { id: number; name: string } | null;
}

const statusColor: Record<string, string> = {
    pending: 'text-amber-600',
    approved: 'text-green-600',
    rejected: 'text-red-600',
    cancelled: 'text-muted-foreground',
};

export default function AmenityBookingsIndex({ bookings }: { bookings: AmenityBooking[] }) {
    const { delete: deleteForm } = useForm();
    const can = useCan();

    const handleDelete = (id: number) => {
        if (confirm('Delete this booking?')) {
            deleteForm(`/amenity-bookings/${id}`);
        }
    };

    return (
        <>
            <Head title="Amenity Bookings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Amenity Bookings</h1>
                    {can('Create Book Amenity') && (
                        <Button asChild size="sm">
                            <Link href="/amenity-bookings/create">
                                <Plus /> New Booking
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.length === 0 && <EmptyState icon={Plus} title="No bookings yet" description="Book your first amenity to get started." />}
                    {bookings.map((booking) => (
                        <div key={booking.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{booking.amenity_name}</span>
                                <span className={`text-sm ${statusColor[booking.status] ?? 'text-muted-foreground'}`}>{booking.status}</span>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {booking.booking_date} {booking.start_time}–{booking.end_time}
                            </p>
                            {booking.guest_count != null && (
                                <p className="text-muted-foreground text-sm">Guests: {booking.guest_count}</p>
                            )}
                            <div className="mt-3 flex items-center gap-2">
                                {can('Update Book Amenity') && (
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/amenity-bookings/${booking.id}/edit`}>
                                            <Pencil /> Edit
                                        </Link>
                                    </Button>
                                )}
                                {can('Delete Book Amenity') && (
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(booking.id)}>
                                        <Trash2 /> Delete
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}
