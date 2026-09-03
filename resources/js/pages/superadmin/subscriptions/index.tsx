import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, CreditCard, Play, Square } from 'lucide-react';
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
import { index as subscriptionsIndex, activate, deactivate, store } from '@/routes/superadmin/subscriptions';

type Subscription = {
    id: number;
    name: string | null;
    package_type: string | null;
    subscription_status: string | null;
    ends_at: string | null;
    society: { id: number; name: string } | null;
    package: { id: number; package_name: string } | null;
};

type SocietyOption = { id: number; name: string };
type PackageOption = { id: number; package_name: string };

export default function SubscriptionsIndex({
    subscriptions,
    societies,
    packages,
}: {
    subscriptions: Subscription[];
    societies: SocietyOption[];
    packages: PackageOption[];
}) {
    const { data, setData, post, processing, errors } = useForm<{ society_id: string; package_id: string }>({
        society_id: '',
        package_id: '',
    });

    const toggle = (subscription: Subscription) => {
        const active = subscription.subscription_status === 'active';
        router.post(
            active ? deactivate(subscription.id).url : activate(subscription.id).url,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Subscriptions" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Subscriptions"
                    description="Manage plan subscriptions assigned to each society."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>New subscription</CardTitle>
                        <CardDescription>Assign a package to a society.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="flex flex-wrap items-end gap-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                post(store().url);
                            }}
                        >
                            <div className="min-w-44 space-y-1">
                                <Select value={data.society_id} onValueChange={(v) => setData('society_id', v)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Society" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {societies.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.society_id && (
                                    <p className="text-xs text-destructive">{errors.society_id}</p>
                                )}
                            </div>
                            <div className="min-w-44 space-y-1">
                                <Select value={data.package_id} onValueChange={(v) => setData('package_id', v)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Package" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {packages.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.package_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.package_id && (
                                    <p className="text-xs text-destructive">{errors.package_id}</p>
                                )}
                            </div>
                            <Button type="submit" disabled={processing || !data.society_id || !data.package_id}>
                                Assign package
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>All subscriptions</CardTitle>
                        <CardDescription>{subscriptions.length} subscriptions on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {subscriptions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No subscriptions yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="pb-2 font-medium">Society</th>
                                            <th className="pb-2 font-medium">Package</th>
                                            <th className="pb-2 font-medium">Status</th>
                                            <th className="pb-2 font-medium">Ends</th>
                                            <th className="pb-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscriptions.map((subscription) => {
                                            const active = subscription.subscription_status === 'active';
                                            return (
                                                <tr key={subscription.id} className="border-b">
                                                    <td className="py-3 font-medium">
                                                        {subscription.society?.name ?? '—'}
                                                    </td>
                                                    <td className="py-3">
                                                        {subscription.package?.package_name ?? subscription.name ?? '—'}
                                                    </td>
                                                    <td className="py-3">
                                                        <span
                                                            className={
                                                                active
                                                                    ? 'inline-flex items-center gap-1 text-green-600'
                                                                    : 'inline-flex items-center gap-1 text-muted-foreground'
                                                            }
                                                        >
                                                            {active ? (
                                                                <CheckCircle2 className="h-3 w-3" />
                                                            ) : (
                                                                <AlertCircle className="h-3 w-3" />
                                                            )}
                                                            {subscription.subscription_status ?? '—'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-muted-foreground">
                                                        {subscription.ends_at
                                                            ? new Date(subscription.ends_at).toLocaleDateString()
                                                            : '—'}
                                                    </td>
                                                    <td className="py-3">
                                                        <Button
                                                            size="sm"
                                                            variant={active ? 'destructive' : 'default'}
                                                            onClick={() => toggle(subscription)}
                                                        >
                                                            {active ? (
                                                                <>
                                                                    <Square className="mr-1 h-3 w-3" />
                                                                    Deactivate
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Play className="mr-1 h-3 w-3" />
                                                                    Activate
                                                                </>
                                                            )}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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

SubscriptionsIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: dashboard() },
        { title: 'Subscriptions', href: subscriptionsIndex() },
    ],
};