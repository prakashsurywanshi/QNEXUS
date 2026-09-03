import { Link, usePage } from '@inertiajs/react';
import { CalendarCheck2, Home as HomeIcon, LifeBuoy, Megaphone, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as amenityBookingsIndex } from '@/routes/amenity-bookings';
import { index as noticesIndex } from '@/routes/notices';
import { index as ticketsIndex } from '@/routes/tickets';
import { index as visitorsIndex } from '@/routes/visitors';

interface MobileTabBarProps {
    role?: string;
}

export function MobileTabBar({ role = '' }: MobileTabBarProps) {
    const { url, props } = usePage();
    const tenancy = (props.tenancy ?? {}) as { role?: string };
    const effectiveRole = role || tenancy.role || '';
    const isResident = effectiveRole === 'Owner' || effectiveRole === 'Tenant';
    const isGuard = effectiveRole === 'Guard';

    if (!isResident && !isGuard) {
        return null;
    }

    const tabs = isGuard
        ? [
              { label: 'Home', href: dashboard().url, icon: HomeIcon },
              { label: 'Visitors', href: visitorsIndex().url, icon: ShieldCheck },
              { label: 'Tickets', href: ticketsIndex().url, icon: LifeBuoy },
              { label: 'Notices', href: noticesIndex().url, icon: Megaphone },
          ]
        : [
              { label: 'Home', href: dashboard().url, icon: HomeIcon },
              { label: 'Bookings', href: amenityBookingsIndex().url, icon: CalendarCheck2 },
              { label: 'Tickets', href: ticketsIndex().url, icon: LifeBuoy },
              { label: 'Notices', href: noticesIndex().url, icon: Megaphone },
          ];

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
            <div className="grid grid-cols-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = url === tab.href;
                    return (
                        <Link
                            key={tab.label}
                            href={tab.href}
                            className={cn(
                                'flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                                active ? 'text-primary' : 'text-muted-foreground',
                            )}
                        >
                            <Icon className="size-5" />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
