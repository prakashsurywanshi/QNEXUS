import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    BadgeDollarSign,
    BarChart3,
    BookOpen,
    Building2,
    Cpu,
    FileText,
    FolderGit2,
    LayoutGrid,
    Megaphone,
    PackageOpen,
    ShieldCheck,
    Sparkles,
    Store,
    Users,
    Wrench,
    Zap,
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
import { index as amenityBookingsIndex } from '@/routes/amenity-bookings';
import { index as apartmentsIndex } from '@/routes/apartments';
import { index as amenitiesIndex } from '@/routes/amenities';
import { index as attendanceIndex } from '@/routes/attendance';
import { index as assetsIndex } from '@/routes/assets';
import { index as budgetsIndex } from '@/routes/budgets';
import { index as camChargesIndex } from '@/routes/cam-charges';
import { index as commercialTenantsIndex } from '@/routes/commercial-tenants';
import { index as commercialUnitsIndex } from '@/routes/commercial-units';
import { index as dailyHelpIndex } from '@/routes/daily-help';
import { index as eventsIndex } from '@/routes/events';
import { index as gatepassesIndex } from '@/routes/gatepasses';
import { index as invoicesIndex } from '@/routes/invoices';
import { index as leaseAgreementsIndex } from '@/routes/lease-agreements';
import { index as ledgerIndex } from '@/routes/ledger';
import { index as maintenanceIndex } from '@/routes/maintenance';
import { index as membersIndex } from '@/routes/members';
import { index as noticesIndex } from '@/routes/notices';
import { index as parkingIndex } from '@/routes/parking';
import { index as patrolIndex } from '@/routes/patrol';
import { index as paymentsIndex } from '@/routes/payments';
import { index as pollsIndex } from '@/routes/polls';
import { index as serviceLogIndex } from '@/routes/service-log';
import { index as servicesIndex } from '@/routes/service-management';
import { index as serviceRequestsIndex } from '@/routes/service-requests';
import { index as serviceTypesIndex } from '@/routes/service-types';
import { index as sosAlertsIndex } from '@/routes/sos-alerts';
import { index as societiesIndex } from '@/routes/societies';
import { index as ticketsIndex } from '@/routes/tickets';
import { index as towersIndex } from '@/routes/towers';
import { index as vendorsIndex } from '@/routes/vendors';
import { index as visitorsIndex } from '@/routes/visitors';
import { index as workOrdersIndex } from '@/routes/work-orders';
import { index as amcIndex } from '@/routes/amc';
import { index as documentsIndex } from '@/routes/documents';
import { index as emergencyContactsIndex } from '@/routes/emergency-contacts';
import { index as approvalsIndex } from '@/routes/approvals';
import { index as automationsIndex } from '@/routes/automations';
import { index as auditLogsIndex } from '@/routes/audit-logs';
import { index as settingsIndex } from '@/routes/settings';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        permission: 'Show Analytics',
        module: 'Analytics',
    },
    {
        title: 'AI Assistant',
        href: '/assistant',
        icon: Sparkles,
        permission: 'Show AI Assistant',
        module: 'AI Assistant',
    },
];

interface SidebarGroupDef {
    title: string;
    icon: LucideIcon;
    items: { title: string; href: string; icon: LucideIcon; permission?: string; module?: string }[];
}

const groupedNavItems: SidebarGroupDef[] = [
    {
        title: 'Estate',
        icon: Building2,
        items: [
            { title: 'Towers', href: towersIndex().url, icon: Building2, permission: 'Show Tower', module: 'Tower' },
            { title: 'Apartments', href: apartmentsIndex().url, icon: Users, permission: 'Show Apartment', module: 'Apartment' },
            { title: 'Parking', href: parkingIndex().url, icon: Building2, permission: 'Show Parking', module: 'Parking' },
        ],
    },
    {
        title: 'Amenities & Assets',
        icon: PackageOpen,
        items: [
            { title: 'Amenities', href: amenitiesIndex().url, icon: PackageOpen, permission: 'Show Amenities', module: 'Amenities' },
            { title: 'Amenity Bookings', href: amenityBookingsIndex().url, icon: PackageOpen, permission: 'Show Book Amenity', module: 'Book Amenity' },
            { title: 'Assets', href: assetsIndex().url, icon: ShieldCheck, permission: 'Show Assets', module: 'Assets' },
            { title: 'AMC', href: amcIndex().url, icon: ShieldCheck, permission: 'Show AMC', module: 'AMC' },
        ],
    },
    {
        title: 'Operations',
        icon: Wrench,
        items: [
            { title: 'Tickets', href: ticketsIndex().url, icon: Wrench, permission: 'Show Tickets', module: 'Tickets' },
            { title: 'Work Orders', href: workOrdersIndex().url, icon: Wrench, permission: 'Show Work Orders', module: 'Work Orders' },
            { title: 'Documents', href: documentsIndex().url, icon: FileText, permission: 'Show Documents', module: 'Documents' },
        ],
    },
    {
        title: 'Services',
        icon: Wrench,
        items: [
            { title: 'Services', href: servicesIndex().url, icon: Wrench, permission: 'Show Service Provider', module: 'Service Provider' },
            { title: 'Service Requests', href: serviceRequestsIndex().url, icon: Wrench, permission: 'Show Service Requests', module: 'Service Requests' },
            { title: 'Service Types', href: serviceTypesIndex().url, icon: Wrench, permission: 'Show Service Provider', module: 'Service Provider' },
            { title: 'Service Log', href: serviceLogIndex().url, icon: Wrench, permission: 'Show Service Time Logging', module: 'Service Time Logging' },
        ],
    },
    {
        title: 'Security',
        icon: ShieldCheck,
        items: [
            { title: 'Visitors', href: visitorsIndex().url, icon: Users, permission: 'Show Visitors', module: 'Visitors' },
            { title: 'Visitor Preapprovals', href: '/visitor-preapprovals', icon: Users, permission: 'Show Visitor Preapproval', module: 'Visitor Preapprovals' },
            { title: 'Visitor Types', href: '/visitor-types', icon: Users, permission: 'Show Visitor Preapproval', module: 'Visitor Preapprovals' },
            { title: 'Gatepasses', href: gatepassesIndex().url, icon: ShieldCheck, permission: 'Show Gatepass', module: 'Gatepasses' },
            { title: 'Patrol', href: patrolIndex().url, icon: ShieldCheck, permission: 'Show Patrol', module: 'Patrol' },
            { title: 'Boom Barriers', href: '/boom-barrier-logs', icon: ShieldCheck, permission: 'Show Boom Barrier', module: 'Boom Barriers' },
            { title: 'Vehicles', href: '/vehicles', icon: ShieldCheck, permission: 'Show Vehicles', module: 'Vehicles' },
            { title: 'SOS Alerts', href: sosAlertsIndex().url, icon: ShieldCheck, permission: 'Show SOS Alert', module: 'SOS Alerts' },
            { title: 'Emergency Contacts', href: emergencyContactsIndex().url, icon: ShieldCheck, permission: 'Show Emergency Contacts', module: 'Emergency Contacts' },
            { title: 'Emergency Broadcasts', href: '/emergency-broadcasts', icon: Megaphone, permission: 'Show Emergency Broadcast', module: 'Emergency Broadcast' },
        ],
    },
    {
        title: 'Staff',
        icon: Users,
        items: [
            { title: 'Staff Management', href: '/staff', icon: Users, permission: 'Show Staff', module: 'Staff Management' },
            { title: 'Attendance', href: attendanceIndex().url, icon: Users, permission: 'Show Worker Checkin', module: 'Worker Checkins' },
            { title: 'Daily Help', href: dailyHelpIndex().url, icon: Users, permission: 'Show Daily Help', module: 'Daily Help' },
        ],
    },
    {
        title: 'Finance',
        icon: BadgeDollarSign,
        items: [
            { title: 'Maintenance', href: maintenanceIndex().url, icon: BadgeDollarSign, permission: 'Show Maintenance', module: 'Maintenance' },
            { title: 'Payments', href: paymentsIndex().url, icon: BadgeDollarSign, permission: 'Show Finance', module: 'Finance' },
            { title: 'Budgets', href: budgetsIndex().url, icon: BadgeDollarSign, permission: 'Show Budget', module: 'Budgets' },
            { title: 'Ledger', href: ledgerIndex().url, icon: BadgeDollarSign, permission: 'Show General Ledger', module: 'General Ledger' },
            { title: 'Vendors', href: vendorsIndex().url, icon: BadgeDollarSign, permission: 'Show Vendor', module: 'Vendors' },
            { title: 'Invoices', href: invoicesIndex().url, icon: BadgeDollarSign, permission: 'Show Finance', module: 'Finance' },
            { title: 'Chart of Accounts', href: '/chart-of-accounts', icon: BadgeDollarSign, permission: 'Show Chart of Account', module: 'Chart of Accounts' },
            { title: 'Journal Vouchers', href: '/journal-vouchers', icon: BadgeDollarSign, permission: 'Show Journal Voucher', module: 'Journal Vouchers' },
            { title: 'Credit Notes', href: '/credit-notes', icon: BadgeDollarSign, permission: 'Show Credit Note', module: 'Credit Notes' },
            { title: 'Advance Accounts', href: '/advance-accounts', icon: BadgeDollarSign, permission: 'Show Advance Account', module: 'Advance Accounts' },
            { title: 'Purchase Orders', href: '/purchase-orders', icon: BadgeDollarSign, permission: 'Show Purchase Order', module: 'Purchase Orders' },
            { title: 'Purchase Invoices', href: '/purchase-invoices', icon: BadgeDollarSign, permission: 'Show Purchase Invoice', module: 'Purchase Invoices' },
            { title: 'Vendor Contracts', href: '/vendor-contracts', icon: BadgeDollarSign, permission: 'Show Vendor Contract', module: 'Vendor Contracts' },
            { title: 'Vendor Payments', href: '/vendor-payments', icon: BadgeDollarSign, permission: 'Show Vendor Payment', module: 'Vendor Payments' },
            { title: 'Fixed Deposits', href: '/fixed-deposits', icon: BadgeDollarSign, permission: 'Show Fixed Deposit', module: 'Fixed Deposits' },
            { title: 'Prepaid Meters', href: '/prepaid-meters', icon: BadgeDollarSign, permission: 'Show Prepaid Meter', module: 'Prepaid Meters' },
        ],
    },
    {
        title: 'Smart Building & Energy',
        icon: Zap,
        items: [
            { title: 'Energy Dashboard', href: '/energy', icon: Zap, permission: 'Show Energy', module: 'Energy' },
            { title: 'Smart Devices', href: '/smart-devices', icon: Cpu, permission: 'Show Smart Devices', module: 'Smart Building' },
        ],
    },
    {
        title: 'Commercial',
        icon: Store,
        items: [
            { title: 'Commercial Units', href: commercialUnitsIndex().url, icon: Store, permission: 'Show Commercial Unit', module: 'Commercial Units' },
            { title: 'Commercial Tenants', href: commercialTenantsIndex().url, icon: Store, permission: 'Show Commercial Tenant', module: 'Commercial Tenants' },
            { title: 'Lease Agreements', href: leaseAgreementsIndex().url, icon: Store, permission: 'Show Lease Agreement', module: 'Lease Agreements' },
            { title: 'CAM Charges', href: camChargesIndex().url, icon: Store, permission: 'Show CAM Charge', module: 'CAM Charges' },
        ],
    },
    {
        title: 'Community',
        icon: Megaphone,
        items: [
            { title: 'Notices', href: noticesIndex().url, icon: Megaphone, permission: 'Show Notice Board', module: 'Notice Board' },
            { title: 'Events', href: eventsIndex().url, icon: Megaphone, permission: 'Show Event', module: 'Events' },
            { title: 'Polls', href: pollsIndex().url, icon: Megaphone, permission: 'Show Poll', module: 'Polls' },
            { title: 'Members', href: membersIndex().url, icon: Users, permission: 'Show Members' },
            { title: 'Meetings', href: '/meetings', icon: Megaphone, permission: 'Show Meeting', module: 'Meetings' },
            { title: 'Pets', href: '/pets', icon: Users, permission: 'Show Pet', module: 'Pets' },
            { title: 'Family Members', href: '/family-members', icon: Users, permission: 'Show Family Members', module: 'Family Members' },
            { title: 'Move Records', href: '/move-records', icon: Users, permission: 'Show Move Record', module: 'Move Records' },
        ],
    },
    {
        title: 'Settings',
        icon: ShieldCheck,
        items: [
            { title: 'Settings', href: settingsIndex().url, icon: Building2, module: 'Settings' },
            { title: 'Society Settings', href: societiesIndex().url, icon: Building2, permission: 'Manage Settings', module: 'Settings' },
        ],
    },
    {
        title: 'Governance',
        icon: ShieldCheck,
        items: [
            { title: 'Approvals', href: approvalsIndex().url, icon: ShieldCheck, permission: 'Show Approvals', module: 'Approvals' },
            { title: 'Automation', href: automationsIndex().url, icon: ShieldCheck, permission: 'Show Automations', module: 'Automations' },
            { title: 'Audit Trail', href: auditLogsIndex().url, icon: ShieldCheck, permission: 'Show Audit Logs', module: 'Audit Logs' },
            { title: 'Compliance', href: '/compliance-items', icon: ShieldCheck, permission: 'Show Compliance', module: 'Compliance' },
        ],
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
    const { props } = usePage();
    const tenancy = (props.tenancy ?? {}) as { permissions?: string[]; enabledModules?: string[] };
    const permissions = tenancy.permissions ?? [];
    const enabledModules = tenancy.enabledModules ?? [];

    const visibleGroups = groupedNavItems
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) =>
                    (!item.permission || permissions.includes(item.permission)) &&
                    (!item.module || enabledModules.includes(item.module)),
            ),
        }))
        .filter((group) => group.items.length > 0);

    const visibleMainNavItems = mainNavItems.filter(
        (item) =>
            (!item.permission || permissions.includes(item.permission)) &&
            (!('module' in item) || !item.module || enabledModules.includes(item.module)),
    );

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
                <NavMain items={visibleMainNavItems} />
                <NavMainGrouped groups={visibleGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
