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

type Apartment = { id: number; apartment_number: string };

type CreditNoteData = {
    credit_number: string;
    amount: string;
    reason: string;
    applied_to_invoice: string;
    status: 'pending' | 'applied' | 'cancelled';
    apartment_id: string;
};

export default function CreateCreditNote({ apartments }: { apartments: Apartment[] }) {
    const { data, setData, post, processing, errors } = useForm<CreditNoteData>({
        credit_number: '',
        amount: '',
        reason: '',
        applied_to_invoice: '',
        status: 'pending',
        apartment_id: '',
    });

    return (
        <>
            <Head title="New Credit Note" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Credit Note"
                    description="Create a new credit note"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/credit-notes');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="credit_number">Credit Number *</Label>
                            <Input
                                id="credit_number"
                                value={data.credit_number}
                                onChange={(e) => setData('credit_number', e.target.value)}
                                required
                                placeholder="e.g. CN-0001"
                            />
                            <InputError message={errors.credit_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                required
                                placeholder="0.00"
                            />
                            <InputError message={errors.amount} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Apartment</Label>
                        <Select value={data.apartment_id} onValueChange={(v) => setData('apartment_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select apartment (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {apartments.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>
                                        {a.apartment_number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.apartment_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                            id="reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            rows={3}
                            placeholder="Reason for credit note"
                        />
                        <InputError message={errors.reason} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="applied_to_invoice">Applied To Invoice</Label>
                        <Input
                            id="applied_to_invoice"
                            value={data.applied_to_invoice}
                            onChange={(e) => setData('applied_to_invoice', e.target.value)}
                            placeholder="Invoice number"
                        />
                        <InputError message={errors.applied_to_invoice} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as CreditNoteData['status'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Credit Note</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateCreditNote.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Credit Notes', href: '/credit-notes' },
        { title: 'New', href: '/credit-notes/create' },
    ],
};
