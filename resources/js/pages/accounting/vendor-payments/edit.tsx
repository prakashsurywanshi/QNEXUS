import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Vendor = { id: number; name: string };

type PaymentData = {
    vendor_id: string;
    amount: string;
    payment_date: string;
    payment_method: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'cheque';
    transaction_id: string;
    tds_amount: string;
    net_amount: string;
    invoice_number: string;
    status: 'pending' | 'completed' | 'cancelled';
    notes: string;
};

type PaymentModel = {
    id: number;
    amount: number | string;
    payment_date: string;
    payment_method: string;
    transaction_id: string | null;
    tds_amount: number | string | null;
    net_amount: number | string;
    invoice_number: string | null;
    status: string;
    notes: string | null;
    vendor_id: number;
    vendor?: { name: string } | null;
};

export default function EditVendorPayment({
    payment,
    vendors,
}: {
    payment: PaymentModel;
    vendors: Vendor[];
}) {
    const { data, setData, put, processing, errors } = useForm<PaymentData>({
        vendor_id: String(payment.vendor_id),
        amount: String(payment.amount ?? ''),
        payment_date: payment.payment_date,
        payment_method: payment.payment_method as PaymentData['payment_method'],
        transaction_id: payment.transaction_id ?? '',
        tds_amount: payment.tds_amount != null ? String(payment.tds_amount) : '',
        net_amount: String(payment.net_amount ?? ''),
        invoice_number: payment.invoice_number ?? '',
        status: payment.status as PaymentData['status'],
        notes: payment.notes ?? '',
    });

    return (
        <>
            <Head title="Edit Vendor Payment" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Vendor Payment"
                    description="Update vendor payment details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/vendor-payments/${payment.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label>Vendor *</Label>
                        <Select value={data.vendor_id} onValueChange={(v) => setData('vendor_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                {vendors.map((v) => (
                                    <SelectItem key={v.id} value={String(v.id)}>
                                        {v.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.vendor_id} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                required
                            />
                            <InputError message={errors.amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="payment_date">Payment Date *</Label>
                            <Input
                                id="payment_date"
                                type="date"
                                value={data.payment_date}
                                onChange={(e) => setData('payment_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.payment_date} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Payment Method *</Label>
                        <Select value={data.payment_method} onValueChange={(v) => setData('payment_method', v as PaymentData['payment_method'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.payment_method} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="transaction_id">Transaction ID</Label>
                        <Input
                            id="transaction_id"
                            value={data.transaction_id}
                            onChange={(e) => setData('transaction_id', e.target.value)}
                        />
                        <InputError message={errors.transaction_id} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="tds_amount">TDS Amount</Label>
                            <Input
                                id="tds_amount"
                                type="number"
                                step="0.01"
                                value={data.tds_amount}
                                onChange={(e) => setData('tds_amount', e.target.value)}
                            />
                            <InputError message={errors.tds_amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="net_amount">Net Amount</Label>
                            <Input
                                id="net_amount"
                                type="number"
                                step="0.01"
                                value={data.net_amount}
                                onChange={(e) => setData('net_amount', e.target.value)}
                            />
                            <InputError message={errors.net_amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="invoice_number">Invoice Number</Label>
                            <Input
                                id="invoice_number"
                                value={data.invoice_number}
                                onChange={(e) => setData('invoice_number', e.target.value)}
                            />
                            <InputError message={errors.invoice_number} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as PaymentData['status'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update Payment</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditVendorPayment.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Vendor Payments', href: '/vendor-payments' },
        { title: 'Edit', href: '#' },
    ],
};
