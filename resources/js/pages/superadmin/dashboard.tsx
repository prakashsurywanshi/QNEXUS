import { Head } from '@inertiajs/react';
import { Building2, CreditCard, PackageOpen, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes/superadmin';

type SocietyRow = {
    id: number;
    name: string;
    slug: string;
    property_type: string | null;
    is_active: boolean;
    created_at: string;
};

export default function SuperAdminDashboard({
    stats,
    recentSocieties,
}: {
    stats: { societies: number; users: number; packages: number; subscriptions: number };
    recentSocieties: SocietyRow[];
}) {
    const cards = [
        { title: 'Societies', value: stats.societies, icon: Building2 },
        { title: 'Users', value: stats.users, icon: Users },
        { title: 'Packages', value: stats.packages, icon: PackageOpen },
        { title: 'Subscriptions', value: stats.subscriptions, icon: CreditCard },
    ];

    return (
        <>
            <Head title="Super Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Super Admin Dashboard"
                    description="Platform-wide overview across all societies"
                />

                <div className="grid gap-4 md:grid-cols-4">
                    {cards.map(({ title, value, icon: Icon }) => (
                        <Card key={title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                                <Icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="mt-2">
                    <CardHeader>
                        <CardTitle>Recent societies</CardTitle>
                        <CardDescription>The latest societies that have been provisioned.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentSocieties.length === 0 ? (
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
                                            <th className="pb-2 font-medium">Status</th>
                                            <th className="pb-2 font-medium">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentSocieties.map((society) => (
                                            <tr key={society.id} className="border-b">
                                                <td className="py-2 font-medium">{society.name}</td>
                                                <td className="py-2 capitalize">{society.property_type ?? '—'}</td>
                                                <td className="py-2">
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
                                                <td className="py-2 text-muted-foreground">
                                                    {new Date(society.created_at).toLocaleDateString()}
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

SuperAdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Super Admin',
            href: dashboard(),
        },
    ],
};