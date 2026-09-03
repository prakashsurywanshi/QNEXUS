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
import { update } from '@/routes/visitors';

type Apartment = { id: number; apartment_number: string };
type VisitorType = { id: number; name: string };

type VisitorData = {
    visitor_name: string;
    phone_number: string;
    address: string;
    purpose_of_visit: string;
    date_of_visit: string;
    in_time: string;
    out_time: string;
    status: 'pending' | 'allowed' | 'not_allowed' | 'checked_in' | 'checked_out';
    apartment_id: string;
    visitor_type_id: string;
    visitor_photo: File | null;
    id_proof_type: string;
    id_proof_number: string;
};

export default function EditVisitor({
    visitor,
    apartments,
    visitorTypes,
}: {
    visitor: { id: number; visitor_photo: string | null } & VisitorData;
    apartments: Apartment[];
    visitorTypes: VisitorType[];
}) {
    const { data, setData, put, processing, errors } = useForm<VisitorData>({
        visitor_name: visitor.visitor_name,
        phone_number: visitor.phone_number ?? '',
        address: visitor.address ?? '',
        purpose_of_visit: visitor.purpose_of_visit ?? '',
        date_of_visit: visitor.date_of_visit ?? '',
        in_time: visitor.in_time ?? '',
        out_time: visitor.out_time ?? '',
        status: visitor.status,
        apartment_id: visitor.apartment_id ? String(visitor.apartment_id) : '',
        visitor_type_id: visitor.visitor_type_id ? String(visitor.visitor_type_id) : '',
        visitor_photo: null,
        id_proof_type: visitor.id_proof_type ?? '',
        id_proof_number: visitor.id_proof_number ?? '',
    });

    return (
        <>
            <Head title="Edit Visitor" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Visitor"
                    description="Update the visitor record"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(update(visitor.id).url);
                    }}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="visitor_name">Visitor name *</Label>
                        <Input
                            id="visitor_name"
                            name="visitor_name"
                            value={data.visitor_name}
                            onChange={(e) => setData('visitor_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.visitor_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone_number">Phone number</Label>
                        <Input
                            id="phone_number"
                            name="phone_number"
                            value={data.phone_number}
                            onChange={(e) => setData('phone_number', e.target.value)}
                        />
                        <InputError message={errors.phone_number} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
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
                            <Label>Visitor Type</Label>
                            <Select value={data.visitor_type_id} onValueChange={(v) => setData('visitor_type_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visitorTypes.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.visitor_type_id} />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="id_proof_type">ID Proof Type</Label>
                            <Select value={data.id_proof_type} onValueChange={(v) => setData('id_proof_type', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select ID type (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                                    <SelectItem value="pan">PAN Card</SelectItem>
                                    <SelectItem value="driving_license">Driving License</SelectItem>
                                    <SelectItem value="voter_id">Voter ID</SelectItem>
                                    <SelectItem value="passport">Passport</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.id_proof_type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="id_proof_number">ID Proof Number</Label>
                            <Input
                                id="id_proof_number"
                                name="id_proof_number"
                                value={data.id_proof_number}
                                onChange={(e) => setData('id_proof_number', e.target.value)}
                            />
                            <InputError message={errors.id_proof_number} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="visitor_photo">Visitor Photo</Label>
                        {visitor.visitor_photo && (
                            <div className="mb-2">
                                <img
                                    src={`/storage/${visitor.visitor_photo}`}
                                    alt="Current photo"
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-3 rounded-lg border border-dashed p-4">
                            <Input
                                id="visitor_photo"
                                name="visitor_photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('visitor_photo', e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <InputError message={errors.visitor_photo} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purpose_of_visit">Purpose of visit</Label>
                        <Textarea
                            id="purpose_of_visit"
                            name="purpose_of_visit"
                            value={data.purpose_of_visit}
                            onChange={(e) => setData('purpose_of_visit', e.target.value)}
                            rows={2}
                        />
                        <InputError message={errors.purpose_of_visit} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="date_of_visit">Date of visit</Label>
                            <Input
                                id="date_of_visit"
                                name="date_of_visit"
                                type="date"
                                value={data.date_of_visit}
                                onChange={(e) => setData('date_of_visit', e.target.value)}
                            />
                            <InputError message={errors.date_of_visit} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="in_time">In time</Label>
                            <Input
                                id="in_time"
                                name="in_time"
                                type="time"
                                value={data.in_time}
                                onChange={(e) => setData('in_time', e.target.value)}
                            />
                            <InputError message={errors.in_time} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="out_time">Out time</Label>
                            <Input
                                id="out_time"
                                name="out_time"
                                type="time"
                                value={data.out_time}
                                onChange={(e) => setData('out_time', e.target.value)}
                            />
                            <InputError message={errors.out_time} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v as VisitorData['status'])}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="allowed">Allowed</SelectItem>
                                <SelectItem value="not_allowed">Not Allowed</SelectItem>
                                <SelectItem value="checked_in">Checked In</SelectItem>
                                <SelectItem value="checked_out">Checked Out</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update Visitor</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditVisitor.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Visitors', href: '/visitors' },
        { title: 'Edit', href: '#' },
    ],
};
