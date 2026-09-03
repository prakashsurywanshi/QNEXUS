import { Search } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NotificationsBell } from '@/components/notification-bell';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground md:pr-2"
                    onClick={() => document.dispatchEvent(new CustomEvent('qnexus:open-command'))}
                >
                    <Search className="size-4" />
                    <span className="hidden md:inline">Search…</span>
                    <kbd className="pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:inline-flex">
                        ⌘K
                    </kbd>
                </Button>
                <NotificationsBell />
            </div>
        </header>
    );
}

