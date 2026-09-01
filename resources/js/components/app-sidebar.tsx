import { Link } from '@inertiajs/react';
import {
    BadgeDollarSign,
    BookOpen,
    Building2,
    FolderGit2,
    LayoutGrid,
    Megaphone,
    PackageOpen,
    ShieldCheck,
    Store,
    Users,
    Wrench,
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
import { dashboard } from '@/routes';
import { index as apartmentsIndex } from '@/routes/apartments';
import { index as amenitiesIndex } from '@/routes/amenities';
import { index as assetsIndex } from '@/routes/assets';
import { index as budgetsIndex } from '@/routes/budgets';
import { index as camChargesIndex } from '@/routes/cam-charges';
import { index as commercialTenantsIndex } from '@/routes/commercial-tenants';
import { index as commercialUnitsIndex } from '@/routes/commercial-units';
import { index as eventsIndex } from '@/routes/events';
import { index as gatepassesIndex } from '@/routes/gatepasses';
import { index as invoicesIndex } from '@/routes/invoices';
import { index as leaseAgreementsIndex } from '@/routes/lease-agreements';
import { index as ledgerIndex } from '@/routes/ledger';
import { index as maintenanceIndex } from '@/routes/maintenance';
import { index as membersIndex } from '@/routes/members';
import { index as noticesIndex } from '@/routes/notices';
import { index as patrolIndex } from '@/routes/patrol';
import { index as paymentsIndex } from '@/routes/payments';
import { index as pollsIndex } from '@/routes/polls';
import { index as serviceLogIndex } from '@/routes/service-log';
import { index as servicesIndex } from '@/routes/service-management';
import { index as serviceTypesIndex } from '@/routes/service-types';
import { index as societiesIndex } from '@/routes/societies';
import { index as towersIndex } from '@/routes/towers';
import { index as vendorsIndex } from '@/routes/vendors';
import { index as visitorsIndex } from '@/routes/visitors';
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
        title: 'Estate',
        icon: Building2,
        items: [
            { title: 'Towers', href: towersIndex().url, icon: Building2 },
            { title: 'Apartments', href: apartmentsIndex().url, icon: Users },
        ],
    },
    {
        title: 'Amenities & Assets',
        icon: PackageOpen,
        items: [
            { title: 'Amenities', href: amenitiesIndex().url, icon: PackageOpen },
            { title: 'Assets', href: assetsIndex().url, icon: ShieldCheck },
        ],
    },
    {
        title: 'Services',
        icon: Wrench,
        items: [
            { title: 'Services', href: servicesIndex().url, icon: Wrench },
            { title: 'Service Types', href: serviceTypesIndex().url, icon: Wrench },
            { title: 'Service Log', href: serviceLogIndex().url, icon: Wrench },
        ],
    },
    {
        title: 'Security',
        icon: ShieldCheck,
        items: [
            { title: 'Visitors', href: visitorsIndex().url, icon: Users },
            { title: 'Gatepasses', href: gatepassesIndex().url, icon: ShieldCheck },
            { title: 'Patrol', href: patrolIndex().url, icon: ShieldCheck },
        ],
    },
    {
        title: 'Finance',
        icon: BadgeDollarSign,
        items: [
            { title: 'Maintenance', href: maintenanceIndex().url, icon: BadgeDollarSign },
            { title: 'Payments', href: paymentsIndex().url, icon: BadgeDollarSign },
            { title: 'Budgets', href: budgetsIndex().url, icon: BadgeDollarSign },
            { title: 'Ledger', href: ledgerIndex().url, icon: BadgeDollarSign },
            { title: 'Vendors', href: vendorsIndex().url, icon: BadgeDollarSign },
            { title: 'Invoices', href: invoicesIndex().url, icon: BadgeDollarSign },
        ],
    },
    {
        title: 'Commercial',
        icon: Store,
        items: [
            { title: 'Commercial Units', href: commercialUnitsIndex().url, icon: Store },
            { title: 'Commercial Tenants', href: commercialTenantsIndex().url, icon: Store },
            { title: 'Lease Agreements', href: leaseAgreementsIndex().url, icon: Store },
            { title: 'CAM Charges', href: camChargesIndex().url, icon: Store },
        ],
    },
    {
        title: 'Community',
        icon: Megaphone,
        items: [
            { title: 'Notices', href: noticesIndex().url, icon: Megaphone },
            { title: 'Events', href: eventsIndex().url, icon: Megaphone },
            { title: 'Polls', href: pollsIndex().url, icon: Megaphone },
            { title: 'Members', href: membersIndex().url, icon: Users },
        ],
    },
    {
        title: 'Admin',
        icon: ShieldCheck,
        items: [{ title: 'Societies', href: societiesIndex().url, icon: Building2 }],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
