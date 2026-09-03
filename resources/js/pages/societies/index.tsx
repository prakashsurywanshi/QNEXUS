import { Link, Head } from '@inertiajs/react';
import { Pencil, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { edit } from '@/routes/societies';

interface Society {
    id: number;
    name: string;
    slug: string | null;
    email: string | null;
    phone_number: string | null;
    address: string | null;
    timezone: string | null;
    property_type: string | null;
    is_active: boolean;
}

export default function SocietiesIndex({ society }: { society: Society | null }) {
    return (
        <>
            <Head title="Society Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Society Settings</h1>
                    {society && (
                        <Button asChild size="sm">
                            <Link href={edit(society.id).url}>
                                <Pencil /> Edit Settings
                            </Link>
                        </Button>
                    )}
                </div>

                {!society ? (
                    <p className="text-sm text-muted-foreground">
                        No society profile is associated with your account.
                    </p>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                {society.name}
                            </CardTitle>
                            <CardDescription>
                                Manage the settings for your own society. These details are
                                shown to members of this society only.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                            <div>
                                <span className="text-muted-foreground">Slug</span>
                                <p className="font-medium">{society.slug ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Property type</span>
                                <p className="font-medium capitalize">{society.property_type ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Email</span>
                                <p className="font-medium">{society.email ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Phone</span>
                                <p className="font-medium">{society.phone_number ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Timezone</span>
                                <p className="font-medium">{society.timezone ?? '—'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Status</span>
                                <p className="font-medium">
                                    <span className={society.is_active ? 'text-green-600' : 'text-muted-foreground'}>
                                        {society.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-muted-foreground">Address</span>
                                <p className="font-medium">{society.address ?? '—'}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}