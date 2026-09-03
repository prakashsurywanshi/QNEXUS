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

type Apartment = { id: number; apartment_number: string };

type AdvanceAccountData = {
    apartment_id: string;
    balance: string;
};

type AdvanceAccountModel = {
    id: number;
    balance: number | string;
    apartment_id: number | null;
    apartment?: { apartment_number: string } | null;
};

export default function EditAdvanceAccount({
    account,
    apartments,
}: {
    account: AdvanceAccountModel;
    apartments: Apartment[];
}) {
    const { data, setData, put, processing, errors } = useForm<AdvanceAccountData>({
        apartment_id: account.apartment_id ? String(account.apartment_id) : '',
        balance: String(account.balance ?? ''),
    });

    return (
        <>
            <Head title="Edit Advance Account" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Advance Account"
                    description="Update advance account details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(`/advance-accounts/${account.id}`);
                    }}
                    className="space-y-6"
                >
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
                        <Label htmlFor="balance">Balance *</Label>
                        <Input
                            id="balance"
                            type="number"
                            step="0.01"
                            value={data.balance}
                            onChange={(e) => setData('balance', e.target.value)}
                            required
                        />
                        <InputError message={errors.balance} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update Advance Account</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditAdvanceAccount.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Advance Accounts', href: '/advance-accounts' },
        { title: 'Edit', href: '#' },
    ],
};
