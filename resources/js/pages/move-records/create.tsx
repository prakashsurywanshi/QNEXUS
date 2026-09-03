import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
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

type User = { id: number; name: string };
type Apartment = { id: number; apartment_number: string };

type MoveRecordData = {
    user_id: string;
    apartment_id: string;
    move_type: 'in' | 'out';
    move_date: string;
    forwarding_address: string;
    deposit_amount: string;
    deposit_status: 'pending' | 'refunded' | 'forfeited';
    pending_dues: string;
    noc_status: 'pending' | 'approved' | 'rejected';
    noc_issued_by: string;
    noc_date: string;
    notes: string;
};

export default function CreateMoveRecord({ users, apartments }: { users: User[]; apartments: Apartment[] }) {
    const { data, setData, post, processing, errors } = useForm<MoveRecordData>({
        user_id: '',
        apartment_id: '',
        move_type: 'out',
        move_date: '',
        forwarding_address: '',
        deposit_amount: '',
        deposit_status: 'pending',
        pending_dues: '',
        noc_status: 'pending',
        noc_issued_by: '',
        noc_date: '',
        notes: '',
    });

    return (
        <>
            <Head title="New Move Record" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Move Record"
                    description="Record a resident move-in or move-out"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/move-records');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label>Resident *</Label>
                        <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select resident" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.user_id} />
                    </div>

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

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Move Type *</Label>
                            <Select value={data.move_type} onValueChange={(v) => setData('move_type', v as MoveRecordData['move_type'])}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select move type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in">Move In</SelectItem>
                                    <SelectItem value="out">Move Out</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.move_type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="move_date">Move Date *</Label>
                            <Input
                                id="move_date"
                                type="date"
                                value={data.move_date}
                                onChange={(e) => setData('move_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.move_date} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="forwarding_address">Forwarding Address</Label>
                        <Textarea
                            id="forwarding_address"
                            value={data.forwarding_address}
                            onChange={(e) => setData('forwarding_address', e.target.value)}
                            placeholder="New address (for move-outs)"
                            rows={2}
                        />
                        <InputError message={errors.forwarding_address} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="deposit_amount">Deposit Amount</Label>
                            <Input
                                id="deposit_amount"
                                type="number"
                                step="0.01"
                                value={data.deposit_amount}
                                onChange={(e) => setData('deposit_amount', e.target.value)}
                            />
                            <InputError message={errors.deposit_amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Deposit Status</Label>
                            <Select value={data.deposit_status} onValueChange={(v) => setData('deposit_status', v as MoveRecordData['deposit_status'])}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                    <SelectItem value="forfeited">Forfeited</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.deposit_status} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="pending_dues">Pending Dues</Label>
                            <Input
                                id="pending_dues"
                                type="number"
                                step="0.01"
                                value={data.pending_dues}
                                onChange={(e) => setData('pending_dues', e.target.value)}
                            />
                            <InputError message={errors.pending_dues} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>NOC Status *</Label>
                            <Select value={data.noc_status} onValueChange={(v) => setData('noc_status', v as MoveRecordData['noc_status'])}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select NOC status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.noc_status} />
                        </div>

                        <div className="grid gap-2">
                            <Label>NOC Issued By</Label>
                            <Select value={data.noc_issued_by} onValueChange={(v) => setData('noc_issued_by', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.noc_issued_by} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="noc_date">NOC Date</Label>
                        <Input
                            id="noc_date"
                            type="date"
                            value={data.noc_date}
                            onChange={(e) => setData('noc_date', e.target.value)}
                        />
                        <InputError message={errors.noc_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Any additional notes"
                            rows={3}
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Move Record</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateMoveRecord.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Move Records', href: '/move-records' },
        { title: 'New', href: '/move-records/create' },
    ],
};
