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
import { update } from '@/routes/invoices';

type InvoiceData = {
    lease_agreement_id: string;
    invoice_number: string;
    billing_period: string;
    rent_amount: string;
    cam_charges: string;
    other_charges: string;
    tax_amount: string;
    paid_amount: string;
    status: string;
    due_date: string;
};

interface InvoiceProps {
    id: number;
    lease_agreement_id: number | string;
    invoice_number: string;
    billing_period: string;
    rent_amount: number | string;
    cam_charges: number | string;
    other_charges: number | string;
    tax_amount: number | string;
    paid_amount: number | string;
    status: string;
    due_date: string | null;
}

export default function EditInvoice({
    invoice,
    leaseAgreements,
}: {
    invoice: InvoiceProps;
    leaseAgreements: { id: number; lease_number: string | null }[];
}) {
    const { data, setData, put, processing, errors } = useForm<InvoiceData>({
        lease_agreement_id: String(invoice.lease_agreement_id),
        invoice_number: invoice.invoice_number,
        billing_period: invoice.billing_period,
        rent_amount: String(invoice.rent_amount),
        cam_charges: String(invoice.cam_charges),
        other_charges: String(invoice.other_charges),
        tax_amount: String(invoice.tax_amount),
        paid_amount: String(invoice.paid_amount),
        status: invoice.status,
        due_date: invoice.due_date ?? '',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(invoice.id).url);
    };

    return (
        <>
            <Head title="Edit Invoice" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Edit Invoice" description="Update the invoice details" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="lease_agreement_id">Lease agreement</Label>
                        <Select value={data.lease_agreement_id} onValueChange={(v) => setData('lease_agreement_id', v)}>
                            <SelectTrigger id="lease_agreement_id" className="w-full">
                                <SelectValue placeholder="Select lease" />
                            </SelectTrigger>
                            <SelectContent>
                                {leaseAgreements.map((l) => (
                                    <SelectItem key={l.id} value={String(l.id)}>{l.lease_number || `#${l.id}`}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.lease_agreement_id} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="invoice_number">Invoice number</Label>
                            <Input id="invoice_number" name="invoice_number" value={data.invoice_number} onChange={(e) => setData('invoice_number', e.target.value)} required />
                            <InputError message={errors.invoice_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="billing_period">Billing period</Label>
                            <Input id="billing_period" name="billing_period" value={data.billing_period} onChange={(e) => setData('billing_period', e.target.value)} required />
                            <InputError message={errors.billing_period} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rent_amount">Rent amount</Label>
                            <Input id="rent_amount" name="rent_amount" type="number" step="0.01" min={0} value={data.rent_amount} onChange={(e) => setData('rent_amount', e.target.value)} />
                            <InputError message={errors.rent_amount} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cam_charges">CAM charges</Label>
                            <Input id="cam_charges" name="cam_charges" type="number" step="0.01" min={0} value={data.cam_charges} onChange={(e) => setData('cam_charges', e.target.value)} />
                            <InputError message={errors.cam_charges} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="other_charges">Other charges</Label>
                            <Input id="other_charges" name="other_charges" type="number" step="0.01" min={0} value={data.other_charges} onChange={(e) => setData('other_charges', e.target.value)} />
                            <InputError message={errors.other_charges} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tax_amount">Tax amount</Label>
                            <Input id="tax_amount" name="tax_amount" type="number" step="0.01" min={0} value={data.tax_amount} onChange={(e) => setData('tax_amount', e.target.value)} />
                            <InputError message={errors.tax_amount} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="paid_amount">Paid amount</Label>
                            <Input id="paid_amount" name="paid_amount" type="number" step="0.01" min={0} value={data.paid_amount} onChange={(e) => setData('paid_amount', e.target.value)} />
                            <InputError message={errors.paid_amount} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Due date</Label>
                            <Input id="due_date" name="due_date" type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} required />
                            <InputError message={errors.due_date} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="partial">Partial</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update invoice</Button>
                    </div>
                </form>
            </div>
        </>
    );
}