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

type Apartment = { id: number; apartment_number: string };

type PreapprovalData = {
    visitor_name: string;
    visitor_phone: string;
    apartment_id: string;
    expected_arrival: string;
    expires_at: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    entry_type: 'visitor' | 'delivery' | 'cab' | 'maintenance' | 'other';
};

export default function CreateVisitorPreapproval({ apartments }: { apartments: Apartment[] }) {
    const { data, setData, post, processing, errors } = useForm<PreapprovalData>({
        visitor_name: '',
        visitor_phone: '',
        apartment_id: '',
        expected_arrival: '',
        expires_at: '',
        purpose: '',
        status: 'pending',
        entry_type: 'visitor',
    });

    return (
        <>
            <Head title="New Visitor Preapproval" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="New Visitor Preapproval"
                    description="Pre-approve a visitor before they arrive"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/visitor-preapprovals');
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="visitor_name">Visitor name *</Label>
                        <Input
                            id="visitor_name"
                            value={data.visitor_name}
                            onChange={(e) => setData('visitor_name', e.target.value)}
                            required
                            placeholder="Full name"
                        />
                        <InputError message={errors.visitor_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="visitor_phone">Phone number</Label>
                        <Input
                            id="visitor_phone"
                            value={data.visitor_phone}
                            onChange={(e) => setData('visitor_phone', e.target.value)}
                            placeholder="e.g. 98765 43210"
                        />
                        <InputError message={errors.visitor_phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Entry Type</Label>
                        <Select value={data.entry_type} onValueChange={(v) => setData('entry_type', v as PreapprovalData['entry_type'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select entry type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="visitor">Visitor</SelectItem>
                                <SelectItem value="delivery">Delivery</SelectItem>
                                <SelectItem value="cab">Cab</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.entry_type} />
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
                            <Label htmlFor="expected_arrival">Expected Arrival</Label>
                            <Input
                                id="expected_arrival"
                                type="datetime-local"
                                value={data.expected_arrival}
                                onChange={(e) => setData('expected_arrival', e.target.value)}
                            />
                            <InputError message={errors.expected_arrival} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="expires_at">Expires At</Label>
                            <Input
                                id="expires_at"
                                type="datetime-local"
                                value={data.expires_at}
                                onChange={(e) => setData('expires_at', e.target.value)}
                            />
                            <InputError message={errors.expires_at} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Textarea
                            id="purpose"
                            value={data.purpose}
                            onChange={(e) => setData('purpose', e.target.value)}
                            placeholder="e.g. Delivery, Maintenance"
                            rows={2}
                        />
                        <InputError message={errors.purpose} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Status *</Label>
                        <Select value={data.status} onValueChange={(v) => setData('status', v as PreapprovalData['status'])}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Create Preapproval</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateVisitorPreapproval.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Visitor Preapprovals', href: '/visitor-preapprovals' },
        { title: 'New', href: '/visitor-preapprovals/create' },
    ],
};
