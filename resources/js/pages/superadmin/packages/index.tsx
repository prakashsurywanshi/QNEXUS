import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/superadmin';
import { create, destroy, edit, index as packagesIndex } from '@/routes/superadmin/packages';

type Module = { id: number; name: string };
type Currency = { id: number; currency_code: string; currency_symbol: string };

type Package = {
    id: number;
    package_name: string;
    description: string | null;
    package_type: string;
    monthly_price: string | null;
    annual_price: string | null;
    is_recommended: boolean;
    is_free: boolean;
    modules: Module[];
    currency: Currency | null;
};

export default function PackagesIndex({ packages }: { packages: Package[] }) {
    const { delete: deleteForm } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this package?')) {
            deleteForm(destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Packages" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Packages</h1>
                    <Button asChild size="sm">
                        <Link href={create().url}>
                            <Plus /> Add Package
                        </Link>
                    </Button>
                </div>

                {packages.length === 0 ? (
                    <p className="text-muted-foreground">No packages created yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-2 font-medium">Name</th>
                                    <th className="pb-2 font-medium">Type</th>
                                    <th className="pb-2 font-medium">Monthly</th>
                                    <th className="pb-2 font-medium">Annual</th>
                                    <th className="pb-2 font-medium">Modules</th>
                                    <th className="pb-2 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {packages.map((pkg) => (
                                    <tr key={pkg.id} className="border-b">
                                        <td className="py-2 font-medium">{pkg.package_name}</td>
                                        <td className="py-2 capitalize">{pkg.package_type}</td>
                                        <td className="py-2">
                                            {pkg.currency?.currency_symbol}{' '}
                                            {pkg.monthly_price ?? '—'}
                                        </td>
                                        <td className="py-2">
                                            {pkg.currency?.currency_symbol}{' '}
                                            {pkg.annual_price ?? '—'}
                                        </td>
                                        <td className="py-2 text-muted-foreground">
                                            {pkg.modules.length} modules
                                        </td>
                                        <td className="py-2">
                                            <div className="flex items-center gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={edit(pkg.id).url}>
                                                        <Pencil /> Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(pkg.id)}
                                                >
                                                    <Trash2 /> Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

PackagesIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: dashboard() },
        { title: 'Packages', href: packagesIndex() },
    ],
};