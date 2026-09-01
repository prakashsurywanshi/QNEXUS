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
import { create } from '@/routes/visitors';

type VisitorData = {
    visitor_name: string;
    phone_number: string;
    address: string;
    purpose_of_visit: string;
    date_of_visit: string;
    in_time: string;
    out_time: string;
    status: 'pending' | 'allowed' | 'not_allowed';
};

export default function CreateVisitor() {
    const { data, setData, post, processing, errors } = useForm<VisitorData>({
        visitor_name: '',
        phone_number: '',
        address: '',
        purpose_of_visit: '',
        date_of_visit: '',
        in_time: '',
        out_time: '',
        status: 'pending',
    });

    return (
        <>
            <Head title="Add Visitor" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Add Visitor"
                    description="Log a new visitor for this society"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(create().url);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="visitor_name">Visitor name</Label>
                        <Input
                            id="visitor_name"
                            name="visitor_name"
                            value={data.visitor_name}
                            onChange={(e) => setData('visitor_name', e.target.value)}
                            required
                            placeholder="Full name"
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
                            placeholder="e.g. 98765 43210"
                        />
                        <InputError message={errors.phone_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purpose_of_visit">Purpose of visit</Label>
                        <Input
                            id="purpose_of_visit"
                            name="purpose_of_visit"
                            value={data.purpose_of_visit}
                            onChange={(e) => setData('purpose_of_visit', e.target.value)}
                            placeholder="e.g. Meeting resident"
                        />
                        <InputError message={errors.purpose_of_visit} />
                    </div>

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

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
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
                                <SelectItem value="not_allowed">Not allowed</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save visitor</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
