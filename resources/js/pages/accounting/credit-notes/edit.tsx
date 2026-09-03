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

type CreditNoteModel = {
    id: number;
    credit_number: string;
    amount: number | string;
    reason: string | null;
    applied_to_invoice: string | null;
    status: string;
    apartment_id: number | null;
    apartment?: { apartment_number: string } | null;
    creator?: { name: string } | null;
};

export default function EditCreditNote({
    creditNote,
    apartments,
}: {
    creditNote: CreditNoteModel;
    apartments: Apartment[];
}) {
    const { data, setData, put, processing, errors } = useForm<CreditNoteData>({
        credit_number: creditNote.credit_number,
        amount: String(creditNote.amount ?? ''),
        reason: creditNote.reason ?? '',
        applied_to_invoice: creditNote.applied_to_invoice ?? '',
        status: creditNote.status as CreditNoteData['status'],
        apartment_id: creditNote.apartment_id ? String(creditNote.apartment_id) : '',
    });

    return (
        <>
            <Head title="Edit Credit Note" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Credit Note"
                    description="Update credit note details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/credit-notes/${creditNote.id}`);
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
                        />
                        <InputError message={errors.reason} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="applied_to_invoice">Applied To Invoice</Label>
                        <Input
                            id="applied_to_invoice"
                            value={data.applied_to_invoice}
                            onChange={(e) => setData('applied_to_invoice', e.target.value)}
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
                        <Button disabled={processing}>Update Credit Note</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditCreditNote.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Credit Notes', href: '/credit-notes' },
        { title: 'Edit', href: '#' },
    ],
};
