import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type WorkerData = {
    name: string;
    phone: string;
    photo: string;
    service_type: string;
    rate_per_visit: string;
    rating: string;
    total_bookings: string;
    is_verified: boolean;
    is_active: boolean;
    notes: string;
};

export default function CreateWorker() {
    const { data, setData, post, processing, errors } = useForm<WorkerData>({
        name: '',
        phone: '',
        photo: '',
        service_type: '',
        rate_per_visit: '',
        rating: '',
        total_bookings: '',
        is_verified: false,
        is_active: true,
        notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/daily-help');
    };

    return (
        <>
            <Head title="Add Worker" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Add Worker"
                    description="Register a new daily help worker for this society"
                />

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="e.g. 98765 43210"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="photo">Photo</Label>
                        <Input
                            id="photo"
                            name="photo"
                            value={data.photo}
                            onChange={(e) => setData('photo', e.target.value)}
                            placeholder="Photo URL"
                        />
                        <InputError message={errors.photo} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="service_type">Service type</Label>
                        <Input
                            id="service_type"
                            name="service_type"
                            value={data.service_type}
                            onChange={(e) => setData('service_type', e.target.value)}
                            required
                            placeholder="e.g. Cook, Maid, Driver"
                        />
                        <InputError message={errors.service_type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rate_per_visit">Rate per visit</Label>
                        <Input
                            id="rate_per_visit"
                            name="rate_per_visit"
                            type="number"
                            step="0.01"
                            value={data.rate_per_visit}
                            onChange={(e) => setData('rate_per_visit', e.target.value)}
                        />
                        <InputError message={errors.rate_per_visit} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                            id="rating"
                            name="rating"
                            type="number"
                            step="0.01"
                            value={data.rating}
                            onChange={(e) => setData('rating', e.target.value)}
                        />
                        <InputError message={errors.rating} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="total_bookings">Total bookings</Label>
                        <Input
                            id="total_bookings"
                            name="total_bookings"
                            type="number"
                            value={data.total_bookings}
                            onChange={(e) => setData('total_bookings', e.target.value)}
                        />
                        <InputError message={errors.total_bookings} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            name="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="is_verified">Verified</Label>
                        <Switch
                            id="is_verified"
                            checked={data.is_verified}
                            onCheckedChange={(checked) => setData('is_verified', checked)}
                        />
                        <InputError message={errors.is_verified} />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="is_active">Available</Label>
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked)}
                        />
                        <InputError message={errors.is_active} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save worker</Button>
                    </div>
                </form>
            </div>
        </>
    );
}