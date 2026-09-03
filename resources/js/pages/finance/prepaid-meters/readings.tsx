import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/lib/permissions';
import type { ColumnDef } from '@tanstack/react-table';

interface Reading {
    id: number;
    previous_reading: string;
    current_reading: string;
    units_consumed: string;
    amount: string;
    balance: string;
    reading_source: string;
    reading_date: string | null;
    recorder?: { id: number; name: string } | null;
}

type ReadingData = {
    current_reading: string;
    amount: string;
    balance: string;
    reading_date: string;
};

export default function MeterReadingsIndex({
    meter,
    readings,
}: {
    meter: { id: number; meter_number: string | null; meter_type: string; apartment?: { apartment_number: string } | null };
    readings: Reading[];
}) {
    const { delete: deleteForm } = useForm();
    const { data, setData, post, processing, errors } = useForm<ReadingData>({
        current_reading: '',
        amount: '',
        balance: '',
        reading_date: new Date().toISOString().slice(0, 10),
    });
    const can = useCan();

    const handleDelete = (readingId: number) => {
        if (confirm('Delete this reading?')) {
            deleteForm(`/prepaid-meters/${meter.id}/readings/${readingId}`);
        }
    };

    const columns: ColumnDef<Reading>[] = [
        {
            accessorKey: 'reading_date',
            header: 'Date',
            cell: ({ row }) => (row.original.reading_date ? new Date(row.original.reading_date).toLocaleDateString() : '—'),
        },
        {
            accessorKey: 'previous_reading',
            header: 'Previous',
        },
        {
            accessorKey: 'current_reading',
            header: 'Current',
        },
        {
            accessorKey: 'units_consumed',
            header: 'Units',
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.units_consumed}</Badge>
            ),
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `₹${Number(row.original.amount).toLocaleString()}`,
        },
        {
            accessorKey: 'balance',
            header: 'Balance',
            cell: ({ row }) => `₹${Number(row.original.balance).toLocaleString()}`,
        },
        {
            accessorKey: 'reading_source',
            header: 'Source',
            cell: ({ row }) => <span className="capitalize">{row.original.reading_source}</span>,
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) =>
                can('Create Prepaid Meter') && (
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)}>
                        Delete
                    </Button>
                ),
        },
    ];

    return (
        <>
            <Head title={`Readings — ${meter.meter_number ?? 'Meter'}`} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Heading
                    variant="small"
                    title={`Readings — ${meter.meter_number ?? 'Meter'}`}
                    description={`${meter.meter_type}${meter.apartment ? ` · ${meter.apartment.apartment_number}` : ''}`}
                />

                <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="mb-3 text-sm font-medium">Record a new reading</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post(`/prepaid-meters/${meter.id}/readings`);
                        }}
                        className="grid gap-4 sm:grid-cols-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="current_reading">Current reading *</Label>
                            <Input
                                id="current_reading"
                                type="number"
                                min="0"
                                step="0.0001"
                                value={data.current_reading}
                                onChange={(e) => setData('current_reading', e.target.value)}
                                required
                            />
                            <InputError message={errors.current_reading} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                            />
                            <InputError message={errors.amount} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="balance">Balance (₹)</Label>
                            <Input
                                id="balance"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.balance}
                                onChange={(e) => setData('balance', e.target.value)}
                            />
                            <InputError message={errors.balance} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reading_date">Date *</Label>
                            <Input
                                id="reading_date"
                                type="date"
                                value={data.reading_date}
                                onChange={(e) => setData('reading_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.reading_date} />
                        </div>
                        <div className="sm:col-span-4">
                            <Button disabled={processing} type="submit">
                                Save Reading
                            </Button>
                        </div>
                    </form>
                </div>

                <DataTable
                    columns={columns}
                    data={readings}
                    searchKey="reading_source"
                    searchPlaceholder="Search readings..."
                />
            </div>
        </>
    );
}

MeterReadingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Prepaid Meters', href: '/prepaid-meters' },
        { title: 'Readings', href: '#' },
    ],
};
