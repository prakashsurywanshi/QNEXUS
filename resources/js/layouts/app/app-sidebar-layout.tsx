import { CommandPalette } from '@/components/command-palette';
import { ImpersonateBanner } from '@/components/impersonate-banner';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { MobileTabBar } from '@/components/mobile-tab-bar';
import { useSocietyTheme } from '@/hooks/use-society-theme';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    useSocietyTheme();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <ImpersonateBanner />
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="pb-16 md:pb-0">{children}</div>
            </AppContent>
            <MobileTabBar />
            <CommandPalette />
        </AppShell>
    );
}
