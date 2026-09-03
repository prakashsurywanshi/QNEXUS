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

export default function CreateChartOfAccount({ parentAccounts }: { parentAccounts: ParentAccount[] }) {
    const { data, setData, post, processing, errors } = useForm<AccountData>({
        account_code: '',
        account_name: '',
        account_type: 'asset',
        parent_id: '',
        is_active: true,
    });

    return (
        <>
            <Head title="New Chart of Account" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Chart of Account"
                    description="Create a new account in the chart of accounts"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/chart-of-accounts');
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
                            placeholder="e.g. 1010"
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
                            placeholder="e.g. Cash"
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
                        <Button disabled={processing}>Create Account</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateChartOfAccount.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Chart of Accounts', href: '/chart-of-accounts' },
        { title: 'New', href: '/chart-of-accounts/create' },
    ],
};
