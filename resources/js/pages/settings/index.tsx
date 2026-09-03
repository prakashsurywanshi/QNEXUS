import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, KeyRound, Palette, User as UserIcon } from 'lucide-react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCan } from '@/lib/permissions';
import { dashboard } from '@/routes';
import { index as societiesIndex } from '@/routes/societies';
import { edit as profileEdit } from '@/routes/profile';
import { edit as securityEdit } from '@/routes/security';
import { edit as appearanceEdit } from '@/routes/appearance';

const sections = [
    { key: 'profile', title: 'Profile', description: 'Update your name and email address.', href: profileEdit(), icon: UserIcon },
    { key: 'security', title: 'Security', description: 'Manage your password and authentication methods.', href: securityEdit(), icon: KeyRound },
    { key: 'appearance', title: 'Appearance', description: 'Customize the look and feel of your interface.', href: appearanceEdit(), icon: Palette },
];

export default function SettingsIndex() {
    const can = useCan();
    const { props } = usePage();
    const tenancy = (props.tenancy ?? {}) as { society_name?: string | null };
    const showSociety = can('Show Settings');

    return (
        <>
            <Head title="Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading title="Settings" description="Manage your account and society preferences." />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {sections.map((section) => (
                        <Card key={section.key} className="gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <section.icon className="size-4 text-muted-foreground" />
                                    {section.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex grow flex-col gap-3 text-sm text-muted-foreground">
                                <p className="flex-1">{section.description}</p>
                                <Link href={section.href} className="text-sm font-medium text-primary hover:underline">
                                    Open settings →
                                </Link>
                            </CardContent>
                        </Card>
                    ))}

                    {showSociety && (
                        <Card className="gap-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Building2 className="size-4 text-muted-foreground" />
                                    Society Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex grow flex-col gap-3 text-sm text-muted-foreground">
                                <p className="flex-1">
                                    Manage {tenancy.society_name ?? 'your society'} configuration and modules.
                                </p>
                                <Link href={societiesIndex().url} className="text-sm font-medium text-primary hover:underline">
                                    Open society settings →
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

SettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Settings', href: '/settings' },
    ],
};
