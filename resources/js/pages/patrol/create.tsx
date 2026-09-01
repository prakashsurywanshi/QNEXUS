import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { create } from '@/routes/patrol';

type CheckpointData = {
    name: string;
    location_description: string;
    latitude: string;
    longitude: string;
    sort_order: string;
    is_active: boolean;
};

export default function CreateCheckpoint() {
    const { data, setData, post, processing, errors } = useForm<CheckpointData>({
        name: '',
        location_description: '',
        latitude: '',
        longitude: '',
        sort_order: '0',
        is_active: true,
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Checkpoint" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Checkpoint" description="Register a new patrol checkpoint" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required placeholder="e.g. Main Gate" />
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
                        <Button disabled={processing}>Save checkpoint</Button>
                    </div>
                </form>
            </div>
        </>
    );
}