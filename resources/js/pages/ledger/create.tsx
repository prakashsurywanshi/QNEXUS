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
import { create } from '@/routes/ledger';

type EntryData = {
    account_id: string;
    date: string;
    description: string;
    debit: string;
    credit: string;
};

export default function CreateEntry({
    accounts,
}: {
    accounts: { id: number; account_name: string | null }[];
}) {
    const { data, setData, post, processing, errors } = useForm<EntryData>({
        account_id: '',
        date: '',
        description: '',
        debit: '0',
        credit: '0',
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        post(create().url);
    };

    return (
        <>
            <Head title="Add Ledger Entry" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Add Ledger Entry" description="Record a general ledger entry" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="account_id">Account</Label>
                        <Select value={data.account_id} onValueChange={(v) => setData('account_id', v)}>
                            <SelectTrigger id="account_id" className="w-full">
                                <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>{a.account_name || `#${a.id}`}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.account_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                        <InputError message={errors.date} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} required />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="debit">Debit</Label>
                            <Input id="debit" name="debit" type="number" step="0.01" min={0} value={data.debit} onChange={(e) => setData('debit', e.target.value)} />
                            <InputError message={errors.debit} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="credit">Credit</Label>
                            <Input id="credit" name="credit" type="number" step="0.01" min={0} value={data.credit} onChange={(e) => setData('credit', e.target.value)} />
                            <InputError message={errors.credit} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save entry</Button>
                    </div>
                </form>
            </div>
        </>
    );
}