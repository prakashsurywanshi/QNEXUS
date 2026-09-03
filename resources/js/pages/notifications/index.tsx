import { Head, router } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import Heading from '@/components/heading';
import { NotificationPreferencesDialog } from '@/components/notification-preferences';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { index as notificationsIndex, read } from '@/routes/notifications';

interface NotificationItem {
    id: string;
    title: string;
    body: string | null;
    link: string | null;
    read_at: string | null;
    created_at: string | null;
}

export default function NotificationsIndex({ notifications }: { notifications: NotificationItem[] }) {
    const markAllRead = () => {
        router.patch('/notifications/read-all');
    };

    const markRead = (id: string, link: string | null) => {
        router.patch(`/notifications/${id}/read`);
        if (link) {
            router.visit(link);
        }
    };

    const formatDate = (value: string | null) => {
        if (!value) return '';
        try {
            return new Date(value).toLocaleString();
        } catch {
            return '';
        }
    };

    return (
        <>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Notifications" description="Your latest system notifications." />
                    <div className="flex items-center gap-2">
                        <NotificationPreferencesDialog />
                        {notifications.some((n) => !n.read_at) && (
                            <Button variant="outline" onClick={markAllRead}>
                                <CheckCheck className="mr-2 size-4" />
                                Mark all read
                            </Button>
                        )}
                    </div>
                </div>

                {notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border py-16 text-muted-foreground">
                        <Bell className="size-8" />
                        <p>No notifications yet.</p>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {notifications.map((n) => (
                        <button
                            key={n.id}
                            type="button"
                            onClick={() => markRead(n.id, n.link)}
                            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-accent ${
                                n.read_at ? 'opacity-60' : 'bg-muted/40'
                            }`}
                        >
                            <div
                                className={`mt-1 size-2 shrink-0 rounded-full ${n.read_at ? 'bg-muted-foreground/40' : 'bg-primary'}`}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">{n.title}</p>
                                {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
                                <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Notifications', href: notificationsIndex() },
    ],
};
