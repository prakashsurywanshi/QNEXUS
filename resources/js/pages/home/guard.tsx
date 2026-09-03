import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    DoorOpen,
    LifeBuoy,
    Megaphone,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { WidgetList } from '@/components/ui/widget-list';
import { dashboard } from '@/routes';
import { index as visitorsIndex } from '@/routes/visitors';
import { index as sosAlertsIndex } from '@/routes/sos-alerts';
import { index as ticketsIndex } from '@/routes/tickets';

interface StatItem {
    value: number;
    label: string;
}

interface WidgetRow {
    id: string | number;
    title: string;
    subtitle?: string;
    meta?: string;
}

interface QuickAction {
    label: string;
    description: string;
    href: string;
    icon: string;
}

interface GuardProps {
    greeting: {
        name: string;
        society_name: string | null;
        date: string;
    };
    stats: Record<string, StatItem>;
    lists: Record<string, WidgetRow[]>;
    quick_actions: QuickAction[];
}

const statMeta: Record<
    string,
    { title: string; icon: typeof DoorOpen; tone: 'default' | 'success' | 'warning' | 'danger' }
> = {
    checkins_today: { title: "Today's Check-ins", icon: DoorOpen, tone: 'default' },
    open_tickets: { title: 'Open Tickets', icon: LifeBuoy, tone: 'danger' },
    active_visitors: { title: 'Active Visitors', icon: DoorOpen, tone: 'warning' },
    notices: { title: 'Notices', icon: Megaphone, tone: 'warning' },
};

const actionIcons: Record<string, typeof DoorOpen> = {
    door: DoorOpen,
    alert: AlertTriangle,
    lifebuoy: LifeBuoy,
};

const listMeta: Record<string, { title: string; icon: typeof DoorOpen }> = {
    visitors_today: { title: "Today's Visitors", icon: DoorOpen },
    open_tickets: { title: 'Open Tickets', icon: LifeBuoy },
    notices: { title: 'Notices', icon: Megaphone },
    sos: { title: 'SOS Alerts', icon: AlertTriangle },
};

export default function GuardHome({ greeting, stats, lists, quick_actions }: GuardProps) {
    const statCards = Object.entries(stats).map(([key, value]) => ({
        key,
        ...(statMeta[key] ?? { title: key.replace('_', ' '), icon: DoorOpen, tone: 'default' as const }),
        value: value.value,
    }));

    const listGroups = Object.entries(lists)
        .map(([key, rows]) => ({
            key,
            rows,
            ...(listMeta[key] ?? { title: key.replace('_', ' '), icon: DoorOpen }),
        }))
        .filter((group) => group.rows.length > 0);

    return (
        <>
            <Head title="Guard Console" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Card className="gap-0 overflow-hidden border-none bg-gradient-to-br from-slate-800 to-slate-950 text-primary-foreground">
                    <CardContent className="flex flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <p className="flex items-center gap-2 text-sm text-primary-foreground/80">
                                <ShieldCheck className="size-4" />
                                {greeting.society_name ?? 'Gate Console'}
                            </p>
                            <h1 className="text-2xl font-semibold">Guard Console</h1>
                            <p className="text-sm text-primary-foreground/80">{greeting.date}</p>
                        </div>
                        <Link
                            href="/visitors/create"
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-primary-foreground/90"
                        >
                            <DoorOpen className="size-4" />
                            Register Visitor
                        </Link>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {statCards.map((card) => (
                        <StatCard
                            key={card.key}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            tone={card.tone}
                        />
                    ))}
                </div>

                {quick_actions.length > 0 && (
                    <Card className="gap-0 py-0">
                        <CardHeader className="border-b py-4">
                            <CardTitle className="text-sm">Console Shortcuts</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 px-5 py-4 sm:grid-cols-3">
                            {quick_actions.map((action) => {
                                const Icon = actionIcons[action.icon] ?? DoorOpen;
                                return (
                                    <Button
                                        key={action.label}
                                        asChild
                                        variant="outline"
                                        className="h-auto flex-col items-start gap-2 p-4 text-left"
                                    >
                                        <Link href={action.href}>
                                            <Icon className="size-5 text-primary" />
                                            <span className="flex flex-col gap-0.5">
                                                <span className="font-medium">{action.label}</span>
                                                <span className="text-xs font-normal text-muted-foreground">{action.description}</span>
                                            </span>
                                        </Link>
                                    </Button>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {listGroups.map((group) => (
                        <WidgetList
                            key={group.key}
                            title={group.title}
                            icon={group.icon}
                            rows={group.rows}
                            emptyText="Nothing to show right now."
                        />
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <Button asChild variant="ghost">
                        <Link href={sosAlertsIndex().url}>
                            SOS Alerts
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href={ticketsIndex().url}>
                            All tickets
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

GuardHome.layout = {
    breadcrumbs: [
        { title: 'Guard Console', href: dashboard() },
    ],
};
