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
import { update } from '@/routes/budgets';

type BudgetData = {
    fiscal_year: string;
    account_id: string;
    budgeted_amount: string;
    actual_amount: string;
};

interface BudgetProps {
    id: number;
    fiscal_year: string;
    account_id: number | string;
    budgeted_amount: number | string;
    actual_amount: number | string;
}

export default function EditBudget({
    budget,
    accounts,
}: {
    budget: BudgetProps;
    accounts: { id: number; account_name: string | null }[];
}) {
    const { data, setData, put, processing, errors } = useForm<BudgetData>({
        fiscal_year: budget.fiscal_year,
        account_id: String(budget.account_id),
        budgeted_amount: String(budget.budgeted_amount),
        actual_amount: String(budget.actual_amount),
    });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        put(update(budget.id).url);
    };

    return (
        <>
            <Head title="Edit Budget" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading variant="small" title="Edit Budget" description="Update the budget details" />
                <form onSubmit={save} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="fiscal_year">Fiscal year</Label>
                        <Input id="fiscal_year" name="fiscal_year" value={data.fiscal_year} onChange={(e) => setData('fiscal_year', e.target.value)} required />
                        <InputError message={errors.fiscal_year} />
                    </div>
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
                        <Label htmlFor="budgeted_amount">Budgeted amount</Label>
                        <Input id="budgeted_amount" name="budgeted_amount" type="number" step="0.01" min={0} value={data.budgeted_amount} onChange={(e) => setData('budgeted_amount', e.target.value)} required />
                        <InputError message={errors.budgeted_amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="actual_amount">Actual amount</Label>
                        <Input id="actual_amount" name="actual_amount" type="number" step="0.01" min={0} value={data.actual_amount} onChange={(e) => setData('actual_amount', e.target.value)} />
                        <InputError message={errors.actual_amount} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update budget</Button>
                    </div>
                </form>
            </div>
        </>
    );
}