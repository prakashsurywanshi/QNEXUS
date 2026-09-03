import { useForm } from '@inertiajs/react';
import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Options {
    deviceTypes: string[];
    statuses: string[];
}

type DeviceData = {
    device_name: string;
    device_type: string;
    location: string;
    vendor: string;
    model: string;
    serial_number: string;
    ip_address: string;
    status: string;
    connected: boolean;
    notes: string;
};

const typeLabels: Record<string, string> = {
    cctv: 'CCTV',
    access_control: 'Access Control',
    rfid: 'RFID',
    anpr: 'ANPR',
    boom_barrier: 'Boom Barrier',
    smart_meter: 'Smart Meter',
    elevator: 'Elevator',
    fire_system: 'Fire System',
    hvac: 'HVAC',
    ev_charger: 'EV Charger',
    iot_sensor: 'IoT Sensor',
};

export default function CreateDevice({ deviceTypes, statuses }: Options) {
    const { data, setData, post, processing, errors } = useForm<DeviceData>({
        device_name: '',
        device_type: 'cctv',
        location: '',
        vendor: '',
        model: '',
        serial_number: '',
        ip_address: '',
        status: 'online',
        connected: true,
        notes: '',
    });

    return (
        <>
            <Head title="Register Device" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Register Smart Device"
                    description="Add a connected device to the building integration hub"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Device Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                post('/smart-devices');
                            }}
                            className="space-y-6"
                        >
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="device_name">Device Name *</Label>
                                    <Input
                                        id="device_name"
                                        value={data.device_name}
                                        onChange={(e) => setData('device_name', e.target.value)}
                                        placeholder="e.g. Main Gate CCTV 01"
                                        required
                                    />
                                    <InputError message={errors.device_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Device Type *</Label>
                                    <Select value={data.device_type} onValueChange={(v) => setData('device_type', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {deviceTypes.map((t) => (
                                                <SelectItem key={t} value={t}>
                                                    {typeLabels[t] ?? t}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.device_type} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. Tower A, Lobby"
                                    />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="vendor">Vendor</Label>
                                    <Input
                                        id="vendor"
                                        value={data.vendor}
                                        onChange={(e) => setData('vendor', e.target.value)}
                                        placeholder="e.g. Hikvision"
                                    />
                                    <InputError message={errors.vendor} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Input
                                        id="model"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        placeholder="e.g. DS-2CD2T"
                                    />
                                    <InputError message={errors.model} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="serial_number">Serial Number</Label>
                                    <Input
                                        id="serial_number"
                                        value={data.serial_number}
                                        onChange={(e) => setData('serial_number', e.target.value)}
                                        placeholder="Device serial"
                                    />
                                    <InputError message={errors.serial_number} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="ip_address">IP Address</Label>
                                    <Input
                                        id="ip_address"
                                        value={data.ip_address}
                                        onChange={(e) => setData('ip_address', e.target.value)}
                                        placeholder="e.g. 192.168.1.50"
                                    />
                                    <InputError message={errors.ip_address} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Status *</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Optional"
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="connected"
                                    type="checkbox"
                                    checked={data.connected}
                                    onChange={(e) => setData('connected', e.target.checked)}
                                    className="size-4 rounded border-gray-300"
                                />
                                <Label htmlFor="connected">Currently connected</Label>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Register Device
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/smart-devices">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateDevice.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Smart Building', href: '/smart-devices' },
        { title: 'New', href: '/smart-devices/create' },
    ],
};
