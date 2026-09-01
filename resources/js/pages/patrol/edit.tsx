import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update } from '@/routes/patrol';

type CheckpointData = {
    name: string;
    location_description: string;
    latitude: string;
    longitude: string;
    sort_order: string;
    is_active: boolean;
};

interface CheckpointProps {
    id: number;
    name: string | null;
    location_description: string | null;
    latitude: number | string | null;
    longitude: number | string | null;
    sort_order: number | string | null;
    is_active: boolean;
}

export default function EditCheckpoint({ checkpoint }: { checkpoint: CheckpointProps }) {
    const { data, setData, put, processing, errors } = useForm<CheckpointData>({
        name: checkpoint.name ?? '',
        location_description: checkpoint.location_description ?? '',
        latitude: checkpoint.latitude === null || checkpoint.latitude === undefined ? '' : String(checkpoint.latitude),
        longitude: checkpoint.longitude === null || checkpoint.longitude === undefined ? '' : String(checkpoint.longitude),
        sort_order: checkpoint.sort_order === null || checkpoint.sort_order === undefined ? '0' : String(checkpoint.sort_order),
        is_active: Boolean(checkpoint.is_active),
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(checkpoint.id).url);
    };

    return (
        <>
            <Head title="Edit Checkpoint" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Edit Checkpoint" description="Update the patrol checkpoint" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="location_description">Location description</Label>
                        <Input id="location_description" name="location_description" value={data.location_description} onChange={(e) => setData('location_description', e.target.value)} />
                        <InputError message={errors.location_description} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input id="latitude" name="latitude" type="number" step="any" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} />
                            <InputError message={errors.latitude} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input id="longitude" name="longitude" type="number" step="any" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} />
                            <InputError message={errors.longitude} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Sort order</Label>
                        <Input id="sort_order" name="sort_order" type="number" min={0} value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
                        <InputError message={errors.sort_order} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="size-4"
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update checkpoint</Button>
                    </div>
                </form>
            </div>
        </>
    );
}