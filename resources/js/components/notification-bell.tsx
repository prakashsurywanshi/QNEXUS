import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { index as notificationsIndex } from '@/routes/notifications';

interface NotificationItem {
    id: string;
    title: string;
    body: string | null;
    link: string | null;
    read_at: string | null;
}

export function NotificationsBell() {
    const page = usePage();
    const notifications = (page.props.notifications as {
        unread_count: number;
        items: NotificationItem[];
    } | null) ?? { unread_count: 0, items: [] };
    const unreadCount = notifications.unread_count;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -right-0.5 -top-0.5 size-4 min-w-4 items-center justify-center rounded-full px-0 text-[10px]">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.items.length === 0 ? (
                    <DropdownMenuItem className="text-muted-foreground" disabled>
                        No new notifications
                    </DropdownMenuItem>
                ) : (
                    notifications.items.map((n) => (
                        <DropdownMenuItem key={n.id} asChild className="flex flex-col items-start gap-0.5 py-2">
                            <Link
                                href={n.link ?? notificationsIndex()}
                                onClick={() => router.patch(`/notifications/${n.id}/read`)}
                            >
                                <span className={`w-full ${n.read_at ? 'text-muted-foreground' : 'font-medium'}`}>{n.title}</span>
                                {n.body && <span className="w-full truncate text-xs text-muted-foreground">{n.body}</span>}
                            </Link>
                        </DropdownMenuItem>
                    ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={notificationsIndex()} className="justify-center text-sm text-primary">
                        <CheckCheck className="mr-2 size-4" /> View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
