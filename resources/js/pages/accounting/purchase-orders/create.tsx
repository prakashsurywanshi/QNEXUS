import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
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

type Item = {
    item_name: string;
    description: string;
    quantity: string;
    unit: string;
    unit_price: string;
};

type PurchaseOrderData = {
    vendor_id: string;
    po_number: string;
    po_date: string;
    total_amount: string;
    tax_amount: string;
    grand_total: string;
    status: 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
    notes: string;
    items: Item[];
};

export default function CreatePurchaseOrder({ vendors }: { vendors: Vendor[] }) {
    const { data, setData, post, processing, errors } = useForm<PurchaseOrderData>({
        vendor_id: '',
        po_number: '',
        po_date: '',
        total_amount: '',
        tax_amount: '',
        grand_total: '',
        status: 'draft',
        notes: '',
        items: [{ item_name: '', description: '', quantity: '', unit: '', unit_price: '' }],
    });

    const addItem = () => {
        setData('items', [...data.items, { item_name: '', description: '', quantity: '', unit: '', unit_price: '' }]);
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: string) => {
        setData('items', data.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

    return (
        <>
            <Head title="New Purchase Order" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Purchase Order"
                    description="Create a new purchase order"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/purchase-orders');
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
                            <Label htmlFor="po_number">PO Number *</Label>
                            <Input
                                id="po_number"
                                value={data.po_number}
                                onChange={(e) => setData('po_number', e.target.value)}
                                required
                                placeholder="e.g. PO-0001"
                            />
                            <InputError message={errors.po_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="po_date">PO Date *</Label>
                            <Input
                                id="po_date"
                                type="date"
                                value={data.po_date}
                                onChange={(e) => setData('po_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.po_date} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Items</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="mr-1 size-4" />
                                Add Item
                            </Button>
                        </div>

                        {data.items.map((item, index) => (
                            <div key={index} className="space-y-3 rounded-lg border p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Item {index + 1}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Item Name *</Label>
                                    <Input
                                        value={item.item_name}
                                        onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                                        placeholder="Item name"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        placeholder="Item description"
                                    />
                                </div>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Unit</Label>
                                        <Input
                                            value={item.unit}
                                            onChange={(e) => updateItem(index, 'unit', e.target.value)}
                                            placeholder="e.g. pcs"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Unit Price</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.unit_price}
                                            onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="total_amount">Total Amount</Label>
                            <Input
                                id="total_amount"
                                type="number"
                                step="0.01"
                                value={data.total_amount}
                                onChange={(e) => setData('total_amount', e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.total_amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tax_amount">Tax Amount</Label>
                            <Input
                                id="tax_amount"
                                type="number"
                                step="0.01"
                                value={data.tax_amount}
                                onChange={(e) => setData('tax_amount', e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.tax_amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="grand_total">Grand Total</Label>
                            <Input
                                id="grand_total"
                                type="number"
                                step="0.01"
                                value={data.grand_total}
                                onChange={(e) => setData('grand_total', e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.grand_total} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as PurchaseOrderData['status'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="ordered">Ordered</SelectItem>
                                <SelectItem value="partially_received">Partially Received</SelectItem>
                                <SelectItem value="received">Received</SelectItem>
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
                            placeholder="Order notes"
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Purchase Order</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreatePurchaseOrder.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Purchase Orders', href: '/purchase-orders' },
        { title: 'New', href: '/purchase-orders/create' },
    ],
};
