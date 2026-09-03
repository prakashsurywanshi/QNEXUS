import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes/superadmin';
import { index as gatewaysIndex, update } from '@/routes/superadmin/gateways';

type Gateway = {
    id?: number;
    razorpay_type: string;
    razorpay_status: boolean;
    stripe_type: string;
    stripe_status: boolean;
    flutterwave_type: string;
    flutterwave_status: boolean;
};

type GatewayForm = {
    razorpay_type: string;
    razorpay_status: boolean;
    stripe_type: string;
    stripe_status: boolean;
    flutterwave_type: string;
    flutterwave_status: boolean;
};

export default function GatewaysIndex({ gateway }: { gateway: Gateway }) {
    const { data, setData, put, processing, errors } = useForm<GatewayForm>({
        razorpay_type: gateway.razorpay_type ?? 'test',
        razorpay_status: Boolean(gateway.razorpay_status),
        stripe_type: gateway.stripe_type ?? 'test',
        stripe_status: Boolean(gateway.stripe_status),
        flutterwave_type: gateway.flutterwave_type ?? 'test',
        flutterwave_status: Boolean(gateway.flutterwave_status),
    });

    const save = (e: { preventDefault(): void }) => {
        e.preventDefault();
        put(update().url);
    };

    return (
        <>
            <Head title="Gateways" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading title="Payment Gateways" description="Configure platform-level payment gateway credentials and toggles." />

                <Card>
                    <CardHeader>
                        <CardTitle>Gateway settings</CardTitle>
                        <CardDescription>Enable providers and choose test/live mode.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={save} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-3 rounded-lg border p-4">
                                    <h3 className="font-medium">Razorpay</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="razorpay_status"
                                            type="checkbox"
                                            checked={data.razorpay_status}
                                            onChange={(e) => setData('razorpay_status', e.target.checked)}
                                            className="size-4"
                                        />
                                        <Label htmlFor="razorpay_status">Enabled</Label>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Mode</Label>
                                        <Select value={data.razorpay_type} onValueChange={(v) => setData('razorpay_type', v)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="test">Test</SelectItem>
                                                <SelectItem value="live">Live</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-lg border p-4">
                                    <h3 className="font-medium">Stripe</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="stripe_status"
                                            type="checkbox"
                                            checked={data.stripe_status}
                                            onChange={(e) => setData('stripe_status', e.target.checked)}
                                            className="size-4"
                                        />
                                        <Label htmlFor="stripe_status">Enabled</Label>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Mode</Label>
                                        <Select value={data.stripe_type} onValueChange={(v) => setData('stripe_type', v)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="test">Test</SelectItem>
                                                <SelectItem value="live">Live</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-lg border p-4">
                                    <h3 className="font-medium">Flutterwave</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="flutterwave_status"
                                            type="checkbox"
                                            checked={data.flutterwave_status}
                                            onChange={(e) => setData('flutterwave_status', e.target.checked)}
                                            className="size-4"
                                        />
                                        <Label htmlFor="flutterwave_status">Enabled</Label>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Mode</Label>
                                        <Select value={data.flutterwave_type} onValueChange={(v) => setData('flutterwave_type', v)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="test">Test</SelectItem>
                                                <SelectItem value="live">Live</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {errors.razorpay_type && <InputError message={errors.razorpay_type} />}

                            <Button disabled={processing}>Save gateway settings</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

GatewaysIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: dashboard() },
        { title: 'Gateways', href: gatewaysIndex() },
    ],
};