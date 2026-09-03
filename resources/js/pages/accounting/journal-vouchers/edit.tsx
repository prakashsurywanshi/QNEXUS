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

type Account = { id: number; account_code: string; account_name: string };

type Line = { account_id: string; debit: string; credit: string; description: string };

type VoucherData = {
    voucher_number: string;
    date: string;
    description: string;
    total_debit: string;
    total_credit: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    lines: Line[];
};

type VoucherModel = {
    id: number;
    voucher_number: string;
    date: string;
    description: string | null;
    total_debit: number | string;
    total_credit: number | string;
    status: string;
    creator?: { id: number; name: string } | null;
    lines: Array<{
        id: number;
        account_id: number;
        debit: number | string;
        credit: number | string;
        description: string | null;
    }>;
};

export default function EditJournalVoucher({
    voucher,
    accounts,
}: {
    voucher: VoucherModel;
    accounts: Account[];
}) {
    const { data, setData, put, processing, errors } = useForm<VoucherData>({
        voucher_number: voucher.voucher_number,
        date: voucher.date,
        description: voucher.description ?? '',
        total_debit: String(voucher.total_debit ?? ''),
        total_credit: String(voucher.total_credit ?? ''),
        status: voucher.status as VoucherData['status'],
        lines: voucher.lines.map((l) => ({
            account_id: String(l.account_id),
            debit: String(l.debit ?? ''),
            credit: String(l.credit ?? ''),
            description: l.description ?? '',
        })),
    });

    const addLine = () => {
        setData('lines', [
            ...data.lines,
            { account_id: '', debit: '', credit: '', description: '' },
        ]);
    };

    const removeLine = (index: number) => {
        setData(
            'lines',
            data.lines.filter((_, i) => i !== index)
        );
    };

    const updateLine = (index: number, field: string, value: string) => {
        setData(
            'lines',
            data.lines.map((line, i) => (i === index ? { ...line, [field]: value } : line))
        );
    };

    return (
        <>
            <Head title="Edit Journal Voucher" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Journal Voucher"
                    description="Update journal voucher details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/journal-vouchers/${voucher.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="voucher_number">Voucher Number *</Label>
                            <Input
                                id="voucher_number"
                                value={data.voucher_number}
                                onChange={(e) => setData('voucher_number', e.target.value)}
                                required
                            />
                            <InputError message={errors.voucher_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                            />
                            <InputError message={errors.date} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={2}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Lines</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addLine}>
                                <Plus className="mr-1 size-4" />
                                Add Line
                            </Button>
                        </div>

                        {data.lines.map((line, index) => (
                            <div key={index} className="space-y-3 rounded-lg border p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Line {index + 1}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLine(index)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Account</Label>
                                    <Select
                                        value={line.account_id}
                                        onValueChange={(v) => updateLine(index, 'account_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((a) => (
                                                <SelectItem key={a.id} value={String(a.id)}>
                                                    {a.account_code} - {a.account_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Debit</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={line.debit}
                                            onChange={(e) => updateLine(index, 'debit', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Credit</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={line.credit}
                                            onChange={(e) => updateLine(index, 'credit', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Line Description</Label>
                                    <Input
                                        value={line.description}
                                        onChange={(e) => updateLine(index, 'description', e.target.value)}
                                        placeholder="Line description"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="total_debit">Total Debit</Label>
                            <Input
                                id="total_debit"
                                type="number"
                                step="0.01"
                                value={data.total_debit}
                                onChange={(e) => setData('total_debit', e.target.value)}
                            />
                            <InputError message={errors.total_debit} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="total_credit">Total Credit</Label>
                            <Input
                                id="total_credit"
                                type="number"
                                step="0.01"
                                value={data.total_credit}
                                onChange={(e) => setData('total_credit', e.target.value)}
                            />
                            <InputError message={errors.total_credit} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as VoucherData['status'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update Voucher</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditJournalVoucher.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Journal Vouchers', href: '/journal-vouchers' },
        { title: 'Edit', href: '#' },
    ],
};
