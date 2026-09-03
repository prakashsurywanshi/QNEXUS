import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Meter {
    id: number;
    meter_number: string | null;
    meter_type: string;
    apartment: { id: number; apartment_number: string } | null;
}

interface Topup {
    id: number;
    amount: number;
    token: string | null;
    payment_method: string;
    topup_date: string;
    recorder: { id: number; name: string } | null;
    notes: string | null;
}

const methodLabels: Record<string, string> = {
    cash: 'Cash',
    upi: 'UPI',
    card: 'Card',
};

const rupee = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

export default function MeterTopups({ meter, topups }: { meter: Meter; topups: Topup[] }) {
    const can = useCan();
    const [token, setToken] = useState('');
    const { data, setData, post, delete: deleteForm, processing, errors, reset } =
        useForm<{ amount: string; token: string; payment_method: string; topup_date: string; notes: string }>({
            amount: '',
            token: '',
            payment_method: 'cash',
            topup_date: new Date().toISOString().slice(0, 10),
            notes: '',
        });

    const generateToken = () => {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        let t = '';
        for (let i = 0; i < 12; i++) t += chars[Math.floor(Math.random() * chars.length)];
        setToken(t);
        setData('token', t);
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this topup record?')) {
            deleteForm(`/energy/${meter.id}/topups/${id}`, {
                onSuccess: () => reset(),
            });
        }
    };

    const columns: ColumnDef<Topup>[] = [
        {
            accessorKey: 'topup_date',
            header: 'Date',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => <span className="font-semibold">{rupee(row.original.amount)}</span>,
        },
        {
            accessorKey: 'payment_method',
            header: 'Method',
            cell: ({ row }) => methodLabels[row.original.payment_method] ?? row.original.payment_method,
        },
        {
            accessorKey: 'token',
            header: 'Token',
            cell: ({ row }) => row.original.token ?? '—',
        },
        {
            id: 'recorder',
            header: 'Recorded By',
            cell: ({ row }) => row.original.recorder?.name ?? '—',
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(row.original.id)}
                    disabled={!can('Top Up Meter')}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Meter Topups" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Heading
                    variant="small"
                    title={`Topups — ${meter.meter_number ?? 'Meter #' + meter.id}`}
                    description={meter.apartment ? `Apartment ${meter.apartment.apartment_number} · ${meter.meter_type}` : meter.meter_type}
                />

                {can('Top Up Meter') && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Record Recharge / eTopUp</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    post(`/energy/${meter.id}/topups`);
                                }}
                                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount (₹) *</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="e.g. 1000"
                                        required
                                    />
                                    <InputError message={errors.amount} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="payment_method">Payment Method *</Label>
                                    <Select
                                        value={data.payment_method}
                                        onValueChange={(v) => setData('payment_method', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="upi">UPI</SelectItem>
                                            <SelectItem value="card">Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.payment_method} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="topup_date">Topup Date *</Label>
                                    <Input
                                        id="topup_date"
                                        type="date"
                                        value={data.topup_date}
                                        onChange={(e) => setData('topup_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.topup_date} />
                                </div>

                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="token">Recharge Token</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="token"
                                            value={data.token || token}
                                            onChange={(e) => setData('token', e.target.value)}
                                            placeholder="Vendor token (optional)"
                                        />
                                        <Button type="button" variant="outline" onClick={generateToken}>
                                            Generate
                                        </Button>
                                    </div>
                                    <InputError message={errors.token} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Optional"
                                    />
                                    <InputError message={errors.notes} />
                                </div>

                                <div className="flex items-end">
                                    <Button type="submit" disabled={processing}>
                                        Record Topup
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Recharge History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {topups.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No recharges recorded yet.
                            </p>
                        ) : (
                            <DataTable columns={columns} data={topups} searchKey="token" searchPlaceholder="Search by token..." />
                        )}
                    </CardContent>
                </Card>

                <div className="flex">
                    <Button asChild variant="outline" size="sm">
                        <a href="/energy">Back to Energy</a>
                    </Button>
                </div>
            </div>
        </>
    );
}

MeterTopups.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Energy', href: '/energy' },
        { title: 'Topups', href: '/energy' },
    ],
};
