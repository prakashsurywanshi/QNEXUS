import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type SosAlertData = {
    alert_type: string;
    message: string;
    latitude: string;
    longitude: string;
};

export default function CreateSosAlert() {
    const { data, setData, post, processing, errors } = useForm<SosAlertData>({
        alert_type: '',
        message: '',
        latitude: '',
        longitude: '',
    });

    return (
        <>
            <Head title="New SOS Alert" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New SOS Alert"
                    description="Raise a new SOS alert"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/sos-alerts');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="alert_type">Alert type</Label>
                        <Input
                            id="alert_type"
                            name="alert_type"
                            value={data.alert_type}
                            onChange={(e) => setData('alert_type', e.target.value)}
                            required
                            placeholder="e.g. Medical, Fire, Security"
                        />
                        <InputError message={errors.alert_type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Describe the situation"
                        />
                        <InputError message={errors.message} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                            id="latitude"
                            name="latitude"
                            type="number"
                            step="any"
                            value={data.latitude}
                            onChange={(e) => setData('latitude', e.target.value)}
                            placeholder="e.g. 19.0760"
                        />
                        <InputError message={errors.latitude} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                            id="longitude"
                            name="longitude"
                            type="number"
                            step="any"
                            value={data.longitude}
                            onChange={(e) => setData('longitude', e.target.value)}
                            placeholder="e.g. 72.8777"
                        />
                        <InputError message={errors.longitude} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Raise Alert</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
