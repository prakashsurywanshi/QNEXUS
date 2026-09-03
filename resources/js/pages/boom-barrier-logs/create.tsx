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

type User = { id: number; name: string };

type LogData = {
    gate_name: string;
    vehicle_number: string;
    direction: 'in' | 'out';
    barrier_type: 'vehicle' | 'pedestrian';
    trigger_method: 'manual' | 'remote' | 'auto_number_plate' | 'qr_code' | 'rfid';
    triggered_by: string;
    is_visitor: boolean;
    visitor_preapproval_id: string;
    opened_at: string;
    closed_at: string;
};

export default function CreateBoomBarrierLog({ users }: { users: User[] }) {
    const { data, setData, post, processing, errors } = useForm<LogData>({
        gate_name: '',
        vehicle_number: '',
        direction: 'in',
        barrier_type: 'vehicle',
        trigger_method: 'manual',
        triggered_by: '',
        is_visitor: false,
        visitor_preapproval_id: '',
        opened_at: '',
        closed_at: '',
    });

    return (
        <>
            <Head title="New Boom Barrier Log" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Boom Barrier Log"
                    description="Record a boom barrier event"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/boom-barrier-logs');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="gate_name">Gate Name *</Label>
                        <Input
                            id="gate_name"
                            value={data.gate_name}
                            onChange={(e) => setData('gate_name', e.target.value)}
                            required
                            placeholder="e.g. Main Gate"
                        />
                        <InputError message={errors.gate_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="vehicle_number">Vehicle Number</Label>
                        <Input
                            id="vehicle_number"
                            value={data.vehicle_number}
                            onChange={(e) => setData('vehicle_number', e.target.value)}
                            placeholder="e.g. MH12AB1234"
                        />
                        <InputError message={errors.vehicle_number} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label>Direction *</Label>
                            <Select value={data.direction} onValueChange={(v) => setData('direction', v as LogData['direction'])}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in">In</SelectItem>
                                    <SelectItem value="out">Out</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.direction} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Barrier Type *</Label>
                            <Select value={data.barrier_type} onValueChange={(v) => setData('barrier_type', v as LogData['barrier_type'])}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vehicle">Vehicle</SelectItem>
                                    <SelectItem value="pedestrian">Pedestrian</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.barrier_type} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Trigger Method *</Label>
                            <Select value={data.trigger_method} onValueChange={(v) => setData('trigger_method', v as LogData['trigger_method'])}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manual">Manual</SelectItem>
                                    <SelectItem value="remote">Remote</SelectItem>
                                    <SelectItem value="auto_number_plate">Auto Number Plate</SelectItem>
                                    <SelectItem value="qr_code">QR Code</SelectItem>
                                    <SelectItem value="rfid">RFID</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.trigger_method} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Triggered By</Label>
                        <Select value={data.triggered_by} onValueChange={(v) => setData('triggered_by', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.triggered_by} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_visitor"
                            type="checkbox"
                            checked={data.is_visitor}
                            onChange={(e) => setData('is_visitor', e.target.checked)}
                            className="size-4 rounded border-gray-300"
                        />
                        <Label htmlFor="is_visitor">Visitor Entry</Label>
                    </div>

                    {data.is_visitor && (
                        <div className="grid gap-2">
                            <Label htmlFor="visitor_preapproval_id">Visitor Pre-approval ID</Label>
                            <Input
                                id="visitor_preapproval_id"
                                type="number"
                                value={data.visitor_preapproval_id}
                                onChange={(e) => setData('visitor_preapproval_id', e.target.value)}
                            />
                            <InputError message={errors.visitor_preapproval_id} />
                        </div>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="opened_at">Opened At *</Label>
                            <Input
                                id="opened_at"
                                type="datetime-local"
                                value={data.opened_at}
                                onChange={(e) => setData('opened_at', e.target.value)}
                                required
                            />
                            <InputError message={errors.opened_at} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="closed_at">Closed At</Label>
                            <Input
                                id="closed_at"
                                type="datetime-local"
                                value={data.closed_at}
                                onChange={(e) => setData('closed_at', e.target.value)}
                            />
                            <InputError message={errors.closed_at} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Log Entry</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateBoomBarrierLog.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Boom Barrier Logs', href: '/boom-barrier-logs' },
        { title: 'New', href: '/boom-barrier-logs/create' },
    ],
};
