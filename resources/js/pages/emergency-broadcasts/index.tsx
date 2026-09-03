import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Megaphone, Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCan } from '@/lib/permissions';

interface Broadcast {
    id: number;
    title: string;
    category: string;
    message: string;
    audience: string;
    severity: string;
    location: string | null;
    status: string;
    sent_at: string | null;
    resolved_at: string | null;
    sender: { id: number; name: string } | null;
}

const categoryLabels: Record<string, string> = {
    fire: 'Fire',
    medical: 'Medical',
    security: 'Security',
    water: 'Water',
    electricity: 'Electricity',
    gas: 'Gas',
    natural_disaster: 'Natural Disaster',
    other: 'Other',
};

const severityTone: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    info: 'outline',
    warning: 'secondary',
    critical: 'destructive',
};

const audienceLabels: Record<string, string> = {
    all: 'All',
    residents: 'Residents',
    committee: 'Committee',
    contacts: 'Contacts',
};

function BroadcastRow({ b }: { b: Broadcast }) {
    const can = useCan();
    const { post, delete: deleteForm, processing } = useForm();

    return (
        <Card className={b.severity === 'critical' && b.status === 'active' ? 'border-destructive/50 bg-destructive/5' : ''}>
            <CardContent className="space-y-2 py-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Badge variant={severityTone[b.severity] ?? 'default'}>{b.severity}</Badge>
                        <Badge variant="outline">{categoryLabels[b.category] ?? b.category}</Badge>
                        <span className="text-sm font-semibold">{b.title}</span>
                    </div>
                    <Badge variant={b.status === 'active' ? 'destructive' : 'secondary'}>
                        {b.status}
                    </Badge>
                </div>
                {b.location && <p className="text-sm text-muted-foreground">📍 {b.location}</p>}
                <p className="text-sm">{b.message}</p>
                <div className="flex items-center justify-between gap-4 pt-1">
                    <p className="text-xs text-muted-foreground">
                        {audienceLabels[b.audience]} · {b.sender?.name ?? '—'} ·{' '}
                        {b.sent_at ? new Date(b.sent_at).toLocaleString() : '—'}
                    </p>
                    <div className="flex gap-1">
                        {b.status === 'active' && can('Update Emergency Broadcast') && (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={processing}
                                onClick={() => post(`/emergency-broadcasts/${b.id}/resolve`)}
                            >
                                Mark Resolved
                            </Button>
                        )}
                        {can('Delete Emergency Broadcast') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={processing}
                                onClick={() => {
                                    if (confirm('Delete this broadcast?')) deleteForm(`/emergency-broadcasts/${b.id}`);
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function EmergencyBroadcastIndex({
    active,
    history,
}: {
    active: Broadcast[];
    history: Broadcast[];
}) {
    const can = useCan();

    return (
        <>
            <Head title="Emergency Broadcasts" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Emergency Broadcasts"
                        description="Issue and track emergency alerts to residents, committee and contacts"
                    />
                    {can('Create Emergency Broadcast') && (
                        <Button asChild size="sm">
                            <Link href="/emergency-broadcasts/create">
                                <Plus className="mr-1 size-4" />
                                New Broadcast
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                    <Megaphone className="size-4 text-destructive" />
                    <span className="text-sm">
                        <strong>{active.length}</strong> active broadcast{active.length === 1 ? '' : 's'}
                    </span>
                </div>

                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {active.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No active broadcasts.</p>
                            ) : (
                                active.map((b) => <BroadcastRow key={b.id} b={b} />)
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {history.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No past broadcasts.</p>
                            ) : (
                                history.map((b) => <BroadcastRow key={b.id} b={b} />)
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

EmergencyBroadcastIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/' },
        { title: 'Emergency Broadcasts', href: '/emergency-broadcasts' },
    ],
};
