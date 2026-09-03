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

type DepositData = {
    bank_name: string;
    fd_number: string;
    amount: string;
    interest_rate: string;
    start_date: string;
    maturity_date: string;
    status: 'active' | 'matured' | 'renewed' | 'losed';
    renewal_action: string;
};

export default function CreateFixedDeposit() {
    const { data, setData, post, processing, errors } = useForm<DepositData>({
        bank_name: '',
        fd_number: '',
        amount: '',
        interest_rate: '',
        start_date: '',
        maturity_date: '',
        status: 'active',
        renewal_action: '',
    });

    return (
        <>
            <Head title="New Fixed Deposit" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Fixed Deposit"
                    description="Record a society fixed deposit"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/fixed-deposits');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="bank_name">Bank name *</Label>
                        <Input
                            id="bank_name"
                            value={data.bank_name}
                            onChange={(e) => setData('bank_name', e.target.value)}
                            required
                            placeholder="e.g. HDFC Bank"
                        />
                        <InputError message={errors.bank_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fd_number">FD number *</Label>
                        <Input
                            id="fd_number"
                            value={data.fd_number}
                            onChange={(e) => setData('fd_number', e.target.value)}
                            required
                            placeholder="e.g. FD-2026-0001"
                        />
                        <InputError message={errors.fd_number} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount (₹) *</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                required
                            />
                            <InputError message={errors.amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="interest_rate">Interest rate (%) *</Label>
                            <Input
                                id="interest_rate"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.interest_rate}
                                onChange={(e) => setData('interest_rate', e.target.value)}
                                required
                            />
                            <InputError message={errors.interest_rate} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start date *</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="maturity_date">Maturity date *</Label>
                            <Input
                                id="maturity_date"
                                type="date"
                                value={data.maturity_date}
                                onChange={(e) => setData('maturity_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.maturity_date} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as DepositData['status'])}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="matured">Matured</SelectItem>
                                <SelectItem value="renewed">Renewed</SelectItem>
                                <SelectItem value="losed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="renewal_action">Renewal action</Label>
                        <Input
                            id="renewal_action"
                            value={data.renewal_action}
                            onChange={(e) => setData('renewal_action', e.target.value)}
                            placeholder="e.g. Auto-renew, Withdraw"
                        />
                        <InputError message={errors.renewal_action} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Fixed Deposit</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateFixedDeposit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Fixed Deposits', href: '/fixed-deposits' },
        { title: 'New', href: '/fixed-deposits/create' },
    ],
};
