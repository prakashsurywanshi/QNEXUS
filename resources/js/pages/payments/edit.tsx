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
import { update } from '@/routes/payments';

type PaymentData = {
    maintenance_apartment_id: string;
    payment_method: string;
    amount: string;
    balance: string;
    transaction_id: string;
};

interface MaintenanceApartment {
    id: number;
    apartment: { id: number; apartment_number: string | null } | null;
}

interface PaymentProps {
    id: number;
    maintenance_apartment_id: number | string;
    payment_method: string;
    amount: number | string;
    balance: number | string | null;
    transaction_id: string | null;
}

export default function EditPayment({
    payment,
    maintenanceApartments,
}: {
    payment: PaymentProps;
    maintenanceApartments: MaintenanceApartment[];
}) {
    const { data, setData, put, processing, errors } = useForm<PaymentData>({
        maintenance_apartment_id: String(payment.maintenance_apartment_id),
        payment_method: payment.payment_method,
        amount: String(payment.amount),
        balance: payment.balance === null || payment.balance === undefined ? '0' : String(payment.balance),
        transaction_id: payment.transaction_id ?? '',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(payment.id).url);
    };

    return (
        <>
            <Head title="Edit Payment" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Edit Payment" description="Update the payment details" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="maintenance_apartment_id">Maintenance allocation</Label>
                        <Select value={data.maintenance_apartment_id} onValueChange={(v) => setData('maintenance_apartment_id', v)}>
                            <SelectTrigger id="maintenance_apartment_id" className="w-full">
                                <SelectValue placeholder="Select allocation" />
                            </SelectTrigger>
                            <SelectContent>
                                {maintenanceApartments.map((ma) => (
                                    <SelectItem key={ma.id} value={String(ma.id)}>
                                        {ma.apartment?.apartment_number ? `Apartment ${ma.apartment.apartment_number}` : `Allocation #${ma.id}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.maintenance_apartment_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="payment_method">Payment method</Label>
                        <Select value={data.payment_method} onValueChange={(v) => setData('payment_method', v)}>
                            <SelectTrigger id="payment_method" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="due">Due</SelectItem>
                                <SelectItem value="stripe">Stripe</SelectItem>
                                <SelectItem value="razorpay">Razorpay</SelectItem>
                                <SelectItem value="flutterwave">Flutterwave</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.payment_method} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" name="amount" type="number" step="0.01" min={0} value={data.amount} onChange={(e) => setData('amount', e.target.value)} required />
                        <InputError message={errors.amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="balance">Balance</Label>
                        <Input id="balance" name="balance" type="number" step="0.01" min={0} value={data.balance} onChange={(e) => setData('balance', e.target.value)} />
                        <InputError message={errors.balance} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="transaction_id">Transaction id</Label>
                        <Input id="transaction_id" name="transaction_id" value={data.transaction_id} onChange={(e) => setData('transaction_id', e.target.value)} />
                        <InputError message={errors.transaction_id} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update payment</Button>
                    </div>
                </form>
            </div>
        </>
    );
}