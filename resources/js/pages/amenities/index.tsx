import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { create, destroy, edit } from '@/routes/amenities';

interface Amenity {
    id: number;
    amenities_name: string;
    status: 'available' | 'not_available';
    booking_status: boolean;
    multiple_booking_status: boolean;
    start_time: string | null;
    end_time: string | null;
    number_of_person: number | null;
}

export default function AmenitiesIndex({ amenities }: { amenities: Amenity[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this amenity?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Amenities" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Amenities</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Amenity
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {amenities.length === 0 && (
                        <p className="text-muted-foreground">No amenities in this society yet.</p>
                    )}
                    {amenities.map((amenity) => (
                        <div
                            key={amenity.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{amenity.amenities_name}</span>
                                <span
                                    className={
                                        amenity.status === 'available'
                                            ? 'text-green-600 text-sm'
                                            : 'text-muted-foreground text-sm'
                                    }
                                >
                                    {amenity.status}
                                </span>
                            </div>
                            {amenity.start_time && amenity.end_time && (
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {amenity.start_time} - {amenity.end_time}
                                </p>
                            )}
                            {amenity.number_of_person != null && (
                                <p className="text-muted-foreground text-sm">
                                    {amenity.number_of_person} persons
                                </p>
                            )}
                            <div className="mt-3 flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={edit(amenity.id).url}>
                                        <Pencil /> Edit
                                    </Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(amenity.id)}>
                                    <Trash2 /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[20vh] overflow-hidden rounded-xl border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}