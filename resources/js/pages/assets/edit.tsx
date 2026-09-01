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
import { update } from '@/routes/assets';

type AssetData = {
    name: string;
    category_id: string;
    location: string;
    condition: string;
    purchase_date: string;
    maintenance_schedule: string;
};

interface AssetProps {
    id: number;
    name: string | null;
    category_id: number | string | null;
    location: string | null;
    condition: string | null;
    purchase_date: string | null;
    maintenance_schedule: string | null;
}

export default function EditAsset({
    asset,
    categories,
}: {
    asset: AssetProps;
    categories: { id: number; name: string | null }[];
}) {
    const { data, setData, put, processing, errors } = useForm<AssetData>({
        name: asset.name ?? '',
        category_id: asset.category_id === null || asset.category_id === undefined ? '' : String(asset.category_id),
        location: asset.location ?? '',
        condition: asset.condition ?? '',
        purchase_date: asset.purchase_date ?? '',
        maintenance_schedule: asset.maintenance_schedule ?? '',
    });

    return (
        <>
            <Head title="Edit Asset" />

            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Edit Asset"
                    description="Update the asset details"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(update(asset.id).url);
                    }}
                    className="space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Category</Label>
                        <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                            <SelectTrigger id="category_id" className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name || `#${c.id}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                        />
                        <InputError message={errors.location} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="condition">Condition</Label>
                        <Input
                            id="condition"
                            name="condition"
                            value={data.condition}
                            onChange={(e) => setData('condition', e.target.value)}
                        />
                        <InputError message={errors.condition} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purchase_date">Purchase date</Label>
                        <Input
                            id="purchase_date"
                            name="purchase_date"
                            type="date"
                            value={data.purchase_date}
                            onChange={(e) => setData('purchase_date', e.target.value)}
                        />
                        <InputError message={errors.purchase_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="maintenance_schedule">Maintenance schedule</Label>
                        <Select
                            value={data.maintenance_schedule}
                            onValueChange={(v) => setData('maintenance_schedule', v)}
                        >
                            <SelectTrigger id="maintenance_schedule" className="w-full">
                                <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="half-year">Half-year</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.maintenance_schedule} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update asset</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
