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

type Vendor = { id: number; name: string };
type PurchaseOrder = { id: number; po_number: string };

type InvoiceData = {
    vendor_id: string;
    purchase_order_id: string;
    invoice_number: string;
    invoice_date: string;
    subtotal: string;
    tax_amount: string;
    total_amount: string;
    paid_amount: string;
    status: 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
    due_date: string;
};

type InvoiceModel = {
    id: number;
    invoice_number: string;
    invoice_date: string;
    subtotal: number | string;
    tax_amount: number | string;
    total_amount: number | string;
    paid_amount: number | string;
    status: string;
    due_date: string | null;
    vendor_id: number;
    purchase_order_id: number | null;
    vendor?: { name: string } | null;
    purchaseOrder?: { po_number: string } | null;
};

export default function EditPurchaseInvoice({
    invoice,
    vendors,
    purchaseOrders,
}: {
    invoice: InvoiceModel;
    vendors: Vendor[];
    purchaseOrders: PurchaseOrder[];
}) {
    const { data, setData, put, processing, errors } = useForm<InvoiceData>({
        vendor_id: String(invoice.vendor_id),
        purchase_order_id: invoice.purchase_order_id ? String(invoice.purchase_order_id) : '',
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        subtotal: String(invoice.subtotal ?? ''),
        tax_amount: String(invoice.tax_amount ?? ''),
        total_amount: String(invoice.total_amount ?? ''),
        paid_amount: String(invoice.paid_amount ?? ''),
        status: invoice.status as InvoiceData['status'],
        due_date: invoice.due_date ?? '',
    });

    return (
        <>
            <Head title="Edit Purchase Invoice" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Purchase Invoice"
                    description="Update purchase invoice details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/purchase-invoices/${invoice.id}`);
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

                    <div className="grid gap-2">
                        <Label>Purchase Order</Label>
                        <Select value={data.purchase_order_id} onValueChange={(v) => setData('purchase_order_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select purchase order (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {purchaseOrders.map((po) => (
                                    <SelectItem key={po.id} value={String(po.id)}>
                                        {po.po_number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.purchase_order_id} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="invoice_number">Invoice Number *</Label>
                            <Input
                                id="invoice_number"
                                value={data.invoice_number}
                                onChange={(e) => setData('invoice_number', e.target.value)}
                                required
                            />
                            <InputError message={errors.invoice_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="invoice_date">Invoice Date *</Label>
                            <Input
                                id="invoice_date"
                                type="date"
                                value={data.invoice_date}
                                onChange={(e) => setData('invoice_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.invoice_date} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="subtotal">Subtotal</Label>
                            <Input
                                id="subtotal"
                                type="number"
                                step="0.01"
                                value={data.subtotal}
                                onChange={(e) => setData('subtotal', e.target.value)}
                            />
                            <InputError message={errors.subtotal} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tax_amount">Tax Amount</Label>
                            <Input
                                id="tax_amount"
                                type="number"
                                step="0.01"
                                value={data.tax_amount}
                                onChange={(e) => setData('tax_amount', e.target.value)}
                            />
                            <InputError message={errors.tax_amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="total_amount">Total Amount</Label>
                            <Input
                                id="total_amount"
                                type="number"
                                step="0.01"
                                value={data.total_amount}
                                onChange={(e) => setData('total_amount', e.target.value)}
                            />
                            <InputError message={errors.total_amount} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="paid_amount">Paid Amount</Label>
                            <Input
                                id="paid_amount"
                                type="number"
                                step="0.01"
                                value={data.paid_amount}
                                onChange={(e) => setData('paid_amount', e.target.value)}
                            />
                            <InputError message={errors.paid_amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                            />
                            <InputError message={errors.due_date} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as InvoiceData['status'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update Invoice</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditPurchaseInvoice.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Purchase Invoices', href: '/purchase-invoices' },
        { title: 'Edit', href: '#' },
    ],
};
