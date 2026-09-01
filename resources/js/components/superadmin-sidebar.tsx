import { Link } from '@inertiajs/react';
import {
    Building2,
    CreditCard,
    FileText,
    FolderGit2,
    Globe,
    LayoutGrid,
    LayoutPanelTop,
    PackageOpen,
    Settings,
    ShieldCheck,
    Store,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavMainGrouped } from '@/components/nav-main-grouped';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/superadmin';
import { edit as editSettings } from '@/routes/superadmin/settings';
import { index as pagesIndex } from '@/routes/superadmin/cms/pages';
import { index as postsIndex } from '@/routes/superadmin/blog/posts';
import { index as sectionsIndex } from '@/routes/superadmin/cms/sections';
import { index as packagesIndex } from '@/routes/superadmin/packages';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const groupedNavItems = [
    {
        title: 'Platform',
        icon: ShieldCheck,
        items: [
            { title: 'Global Settings', href: editSettings().url, icon: Settings },
            { title: 'Landing Site', href: '#', icon: Globe },
        ],
    },
    {
        title: 'CMS',
        icon: FileText,
        items: [
            { title: 'Pages', href: pagesIndex().url, icon: FileText },
            { title: 'Blog Posts', href: postsIndex().url, icon: FileText },
            { title: 'Landing Sections', href: sectionsIndex().url, icon: LayoutPanelTop },
        ],
    },
    {
        title: 'Societies',
        icon: Building2,
        items: [
            { title: 'All Societies', href: '#', icon: Building2 },
            { title: 'Provision New', href: '#', icon: Store },
        ],
    },
    {
        title: 'Packages & Billing',
        icon: PackageOpen,
        items: [
            { title: 'Packages', href: packagesIndex().url, icon: PackageOpen },
            { title: 'Subscriptions', href: '#', icon: CreditCard },
            { title: 'Invoices', href: '#', icon: FileText },
            { title: 'Gateways', href: '#', icon: CreditCard },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/anomalyco/opencode',
        icon: FolderGit2,
    },
];

export function SuperAdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMainGrouped groups={groupedNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}