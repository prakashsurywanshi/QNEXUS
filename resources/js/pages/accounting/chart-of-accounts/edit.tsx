import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type ParentAccount = { id: number; account_name: string };

type AccountData = {
    account_code: string;
    account_name: string;
    account_type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
    parent_id: string;
    is_active: boolean;
};

export default function EditChartOfAccount({
    account,
    parentAccounts,
}: {
    account: { id: number; account_code: string; account_name: string; account_type: string; parent_id: number | null; is_active: boolean };
    parentAccounts: ParentAccount[];
}) {
    const { data, setData, put, processing, errors } = useForm<AccountData>({
        account_code: account.account_code,
        account_name: account.account_name,
        account_type: account.account_type as AccountData['account_type'],
        parent_id: account.parent_id ? String(account.parent_id) : '',
        is_active: account.is_active,
    });

    return (
        <>
            <Head title="Edit Chart of Account" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Chart of Account"
                    description="Update account details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/chart-of-accounts/${account.id}`);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="account_code">Account Code *</Label>
                        <Input
                            id="account_code"
                            value={data.account_code}
                            onChange={(e) => setData('account_code', e.target.value)}
                            required
                        />
                        <InputError message={errors.account_code} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="account_name">Account Name *</Label>
                        <Input
                            id="account_name"
                            value={data.account_name}
                            onChange={(e) => setData('account_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.account_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Account Type *</Label>
                        <Select value={data.account_type} onValueChange={(v) => setData('account_type', v as AccountData['account_type'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asset">Asset</SelectItem>
                                <SelectItem value="liability">Liability</SelectItem>
                                <SelectItem value="equity">Equity</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.account_type} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Parent Account</Label>
                        <Select value={data.parent_id} onValueChange={(v) => setData('parent_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent account (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {parentAccounts.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.account_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.parent_id} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(v) => setData('is_active', v === true)}
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update Account</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditChartOfAccount.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Chart of Accounts', href: '/chart-of-accounts' },
        { title: 'Edit', href: '#' },
    ],
};
