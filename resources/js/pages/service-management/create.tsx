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
import { create } from '@/routes/service-management';

type ServiceData = {
    service_type_id: string;
    company_name: string;
    contact_person_name: string;
    phone_number: string;
    website_link: string;
    price: string;
    payment_frequency: string;
    status: 'available' | 'not_available';
    daily_help: boolean;
};

export default function CreateService({
    serviceTypes,
}: {
    serviceTypes: { id: number; name: string | null }[];
}) {
    const { data, setData, post, processing, errors } = useForm<ServiceData>({
        service_type_id: '',
        company_name: '',
        contact_person_name: '',
        phone_number: '',
        website_link: '',
        price: '',
        payment_frequency: 'per_visit',
        status: 'available',
        daily_help: false,
    });

    return (
        <>
            <Head title="Add Service" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Add Service"
                    description="Register a new service provider for this society"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post(create().url);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="service_type_id">Service type</Label>
                        <Select
                            value={data.service_type_id}
                            onValueChange={(v) => setData('service_type_id', v)}
                        >
                            <SelectTrigger id="service_type_id" className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {serviceTypes.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)}>
                                        {t.name || `#${t.id}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.service_type_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="company_name">Company name</Label>
                        <Input
                            id="company_name"
                            name="company_name"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            placeholder="e.g. Spark Electric Co."
                        />
                        <InputError message={errors.company_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="contact_person_name">Contact person</Label>
                        <Input
                            id="contact_person_name"
                            name="contact_person_name"
                            value={data.contact_person_name}
                            onChange={(e) => setData('contact_person_name', e.target.value)}
                        />
                        <InputError message={errors.contact_person_name} />
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

                    <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                        <InputError message={errors.price} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="payment_frequency">Payment frequency</Label>
                        <Select
                            value={data.payment_frequency}
                            onValueChange={(v) => setData('payment_frequency', v)}
                        >
                            <SelectTrigger id="payment_frequency" className="w-full">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="per_visit">Per visit</SelectItem>
                                <SelectItem value="per_hour">Per hour</SelectItem>
                                <SelectItem value="per_day">Per day</SelectItem>
                                <SelectItem value="per_week">Per week</SelectItem>
                                <SelectItem value="per_month">Per month</SelectItem>
                                <SelectItem value="per_year">Per year</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.payment_frequency} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v as ServiceData['status'])}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="not_available">Not available</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save service</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
