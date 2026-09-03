import { Head, Link, router, useForm } from '@inertiajs/react';
import { Building2, Eye, Pencil, Plus, Power, RotateCcw, UserRound } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes/superadmin';
import {
    index as societiesIndex,
    impersonate,
    activate,
    deactivate,
    assignPackage,
    edit as editSociety,
    create as createSociety,
} from '@/routes/superadmin/societies';
import { useState } from 'react';

type Member = {
    id: number;
    name: string;
    email: string | null;
    role: string | number;
};

type Society = {
    id: number;
    name: string;
    slug: string;
    property_type: string | null;
    is_active: boolean;
    created_at: string;
    users_count: number;
    roles_count: number;
    package: { id: number; package_name: string } | null;
    members: Member[];
};

type PackageOption = { id: number; package_name: string };

export default function SuperAdminSocietiesIndex({
    societies,
    packages,
}: {
    societies: Society[];
    packages: PackageOption[];
}) {
    const [assigningFor, setAssigningFor] = useState<number | null>(null);
    const [impersonateFor, setImpersonateFor] = useState<number | null>(null);
    const { data, setData, post, processing } = useForm<{ package_id: string }>({
        package_id: '',
    });

    const { data: member, setData: setMember, post: postMember } = useForm<{ user_id: string }>({
        user_id: '',
    });

    const handleToggleActive = (society: Society) => {
        router.post(
            society.is_active ? deactivate(society.id).url : activate(society.id).url,
            {},
            { preserveScroll: true },
        );
    };

    const handleAssignPackage = (societyId: number) => {
        post(assignPackage(societyId).url, { preserveScroll: true });
    };

    const handleImpersonate = (society: Society) => {
        if (!member.user_id) {
            return;
        }
        postMember(impersonate([society.id, Number(member.user_id)]).url);
    };

    return (
        <>
            <Head title="Societies" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="All Societies"
                    description="Provision, activate and manage the access of all societies on the platform."
                />

                <div className="flex justify-end">
                    <Button asChild>
                        <Link href={createSociety().url}>
                            <Plus /> Add Society
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Societies</CardTitle>
                        <CardDescription>
                            {societies.length} societies on the platform. New societies start
                            inactive and must be activated before their members can sign in.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {societies.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No societies provisioned yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="pb-2 font-medium">Name</th>
                                            <th className="pb-2 font-medium">Type</th>
                                            <th className="pb-2 font-medium">Package</th>
                                            <th className="pb-2 font-medium">Users</th>
                                            <th className="pb-2 font-medium">Status</th>
                                            <th className="pb-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {societies.map((society) => (
                                            <tr key={society.id} className="border-b">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{society.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 capitalize">
                                                    {society.property_type ?? '—'}
                                                </td>
                                                <td className="py-3">
                                                    {society.package?.package_name ?? '—'}
                                                </td>
                                                <td className="py-3">{society.users_count}</td>
                                                <td className="py-3">
                                                    <span
                                                        className={
                                                            society.is_active
                                                                ? 'text-green-600'
                                                                : 'text-muted-foreground'
                                                        }
                                                    >
                                                        {society.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex flex-col items-start gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link href={editSociety(society.id).url}>
                                                                    <Pencil className="mr-1 h-3 w-3" />
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant={society.is_active ? 'destructive' : 'default'}
                                                                size="sm"
                                                                onClick={() => handleToggleActive(society)}
                                                            >
                                                                {society.is_active ? (
                                                                    <>
                                                                        <Power className="mr-1 h-3 w-3" />
                                                                        Deactivate
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <RotateCcw className="mr-1 h-3 w-3" />
                                                                        Activate
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>

                                                        <div className="flex flex-col items-start gap-1">
                                                            {impersonateFor === society.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <Select
                                                                        value={member.user_id}
                                                                        onValueChange={(v) =>
                                                                            setMember('user_id', v)
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="w-44">
                                                                            <SelectValue placeholder="Select member" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {society.members.map((m) => (
                                                                                <SelectItem key={m.id} value={String(m.id)}>
                                                                                    {m.name} ({m.role})
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleImpersonate(society)}
                                                                        disabled={!member.user_id}
                                                                    >
                                                                        <Eye className="mr-1 h-3 w-3" />
                                                                        View as
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setMember('user_id', '');
                                                                        setImpersonateFor(society.id);
                                                                    }}
                                                                    className="flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2"
                                                                >
                                                                    <UserRound className="h-3 w-3" />
                                                                    View as member
                                                                </button>
                                                            )}

                                                            {assigningFor === society.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <Select
                                                                        value={data.package_id}
                                                                        onValueChange={(v) =>
                                                                            setData('package_id', v)
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="w-40">
                                                                            <SelectValue placeholder="Select package" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {packages.map((pkg) => (
                                                                                <SelectItem key={pkg.id} value={String(pkg.id)}>
                                                                                    {pkg.package_name}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <Button
                                                                        size="sm"
                                                                        disabled={processing || !data.package_id}
                                                                        onClick={() => handleAssignPackage(society.id)}
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('package_id', String(society.package?.id ?? ''));
                                                                        setAssigningFor(society.id);
                                                                    }}
                                                                    className="text-xs text-muted-foreground underline underline-offset-2"
                                                                >
                                                                    Assign package
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SuperAdminSocietiesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Super Admin',
            href: dashboard(),
        },
        {
            title: 'Societies',
            href: societiesIndex(),
        },
    ],
};