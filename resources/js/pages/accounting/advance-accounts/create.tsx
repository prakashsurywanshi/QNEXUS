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

export default function CreateAdvanceAccount({ apartments }: { apartments: Apartment[] }) {
    const { data, setData, post, processing, errors } = useForm<AdvanceAccountData>({
        apartment_id: '',
        balance: '',
    });

    return (
        <>
            <Head title="New Advance Account" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Advance Account"
                    description="Create a new advance payment account"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/advance-accounts');
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
                            placeholder="0.00"
                        />
                        <InputError message={errors.balance} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Advance Account</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateAdvanceAccount.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Advance Accounts', href: '/advance-accounts' },
        { title: 'New', href: '/advance-accounts/create' },
    ],
};
