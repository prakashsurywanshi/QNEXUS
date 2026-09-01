import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index, update } from '@/routes/superadmin/packages';

type Module = { id: number; name: string };
type Currency = { id: number; currency_name: string; currency_code: string; currency_symbol: string };
type PackageType = { name: string; value: string };

type PackageData = {
    package_name: string;
    description: string;
    currency_id: string;
    monthly_price: string;
    annual_price: string;
    package_type: string;
    is_recommended: boolean;
    is_private: boolean;
    is_free: boolean;
    trial_days: string;
    module_ids: number[];
};

type Package = Omit<PackageData, 'currency_id'> & {
    id: number;
    modules: Module[];
    currency_id: number;
    currency: Currency | null;
};

export default function PackageEdit({
    package: pkg,
    currencies,
    modules,
    packageTypes,
}: {
    package: Package;
    currencies: Currency[];
    modules: Module[];
    packageTypes: PackageType[];
}) {
    const { data, setData, put, processing, errors } = useForm<PackageData>({
        package_name: pkg.package_name,
        description: pkg.description ?? '',
        currency_id: pkg.currency_id.toString(),
        monthly_price: pkg.monthly_price ?? '',
        annual_price: pkg.annual_price ?? '',
        package_type: pkg.package_type,
        is_recommended: pkg.is_recommended,
        is_private: pkg.is_private,
        is_free: pkg.is_free,
        trial_days: pkg.trial_days ?? '',
        module_ids: pkg.modules?.map((m) => m.id) ?? [],
    });

    const toggleModule = (id: number) => {
        setData(
            'module_ids',
            data.module_ids.includes(id)
                ? data.module_ids.filter((m) => m !== id)
                : [...data.module_ids, id],
        );
    };

    return (
        <>
            <Head title="Edit Package" />
            <div className="mx-auto flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Edit Package" description={pkg.package_name} />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(update(pkg.id).url);
                    }}
                    className="max-w-2xl space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="package_name">Package name</Label>
                        <Input
                            id="package_name"
                            name="package_name"
                            value={data.package_name}
                            onChange={(e) => setData('package_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.package_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="currency_id">Currency</Label>
                            <Select
                                value={data.currency_id}
                                onValueChange={(v) => setData('currency_id', v)}
                            >
                                <SelectTrigger id="currency_id" className="w-full">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map((currency) => (
                                        <SelectItem
                                            key={currency.id}
                                            value={currency.id.toString()}
                                        >
                                            {currency.currency_name} ({currency.currency_code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.currency_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="package_type">Package type</Label>
                            <Select
                                value={data.package_type}
                                onValueChange={(v) => setData('package_type', v)}
                            >
                                <SelectTrigger id="package_type" className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {packageTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.package_type} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="monthly_price">Monthly price</Label>
                            <Input
                                id="monthly_price"
                                name="monthly_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.monthly_price}
                                onChange={(e) => setData('monthly_price', e.target.value)}
                            />
                            <InputError message={errors.monthly_price} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="annual_price">Annual price</Label>
                            <Input
                                id="annual_price"
                                name="annual_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.annual_price}
                                onChange={(e) => setData('annual_price', e.target.value)}
                            />
                            <InputError message={errors.annual_price} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="trial_days">Trial days</Label>
                            <Input
                                id="trial_days"
                                name="trial_days"
                                type="number"
                                min="0"
                                value={data.trial_days}
                                onChange={(e) => setData('trial_days', e.target.value)}
                            />
                            <InputError message={errors.trial_days} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Options</Label>
                            <div className="flex h-9 flex-col justify-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_recommended"
                                        checked={data.is_recommended}
                                        onCheckedChange={(c) =>
                                            setData('is_recommended', c === true)
                                        }
                                    />
                                    <Label htmlFor="is_recommended">Recommended</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_private"
                                checked={data.is_private}
                                onCheckedChange={(c) => setData('is_private', c === true)}
                            />
                            <Label htmlFor="is_private">Private</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_free"
                                checked={data.is_free}
                                onCheckedChange={(c) => setData('is_free', c === true)}
                            />
                            <Label htmlFor="is_free">Free</Label>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Modules</Label>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {modules.map((module) => (
                                <label
                                    key={module.id}
                                    className="flex items-center gap-2 rounded-md border border-black/10 p-2 text-sm dark:border-white/10"
                                >
                                    <Checkbox
                                        checked={data.module_ids.includes(module.id)}
                                        onCheckedChange={() => toggleModule(module.id)}
                                    />
                                    <span>{module.name}</span>
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.module_ids} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Update package</Button>
                        <Button asChild variant="ghost" type="button">
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

PackageEdit.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/super-admin' },
        { title: 'Packages', href: index() },
        { title: 'Edit' },
    ],
};