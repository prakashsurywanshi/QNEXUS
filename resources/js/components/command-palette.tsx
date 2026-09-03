import { router, usePage } from '@inertiajs/react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import {
    BadgeDollarSign,
    BarChart3,
    Building2,
    CalendarPlus,
    Cpu,
    FilePlus2,
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
    type LucideIcon,
} from 'lucide-react';
import { useEffect, useState, type ComponentType } from 'react';
import { dashboard } from '@/routes';
import { index as towerIndex } from '@/routes/towers';
import { index as apartmentIndex } from '@/routes/apartments';
import { index as parkingIndex } from '@/routes/parking';
import { index as amenityIndex } from '@/routes/amenities';
import { index as amenityBookingIndex } from '@/routes/amenity-bookings';
import { index as assetIndex } from '@/routes/assets';
import { index as amcIndex } from '@/routes/amc';
import { index as ticketIndex } from '@/routes/tickets';
import { index as workOrderIndex } from '@/routes/work-orders';
import { index as documentIndex } from '@/routes/documents';
import { index as serviceIndex } from '@/routes/service-management';
import { index as serviceRequestsIndex } from '@/routes/service-requests';
import { index as serviceTypeIndex } from '@/routes/service-types';
import { index as serviceLogIndex } from '@/routes/service-log';
import { index as visitorIndex } from '@/routes/visitors';
import { index as gatepassIndex } from '@/routes/gatepasses';
import { index as patrolIndex } from '@/routes/patrol';
import { index as sosIndex } from '@/routes/sos-alerts';
import { index as emergencyIndex } from '@/routes/emergency-contacts';
import { index as attendanceIndex } from '@/routes/attendance';
import { index as dailyHelpIndex } from '@/routes/daily-help';
import { index as maintenanceIndex } from '@/routes/maintenance';
import { index as paymentIndex } from '@/routes/payments';
import { index as budgetIndex } from '@/routes/budgets';
import { index as ledgerIndex } from '@/routes/ledger';
import { index as vendorIndex } from '@/routes/vendors';
import { index as invoiceIndex } from '@/routes/invoices';
import { index as unitIndex } from '@/routes/commercial-units';
import { index as tenantIndex } from '@/routes/commercial-tenants';
import { index as leaseIndex } from '@/routes/lease-agreements';
import { index as camIndex } from '@/routes/cam-charges';
import { index as noticeIndex } from '@/routes/notices';
import { index as eventIndex } from '@/routes/events';
import { index as pollIndex } from '@/routes/polls';
import { index as memberIndex } from '@/routes/members';
import { index as approvalIndex } from '@/routes/approvals';
import { index as automationIndex } from '@/routes/automations';
import { index as auditIndex } from '@/routes/audit-logs';
import { index as settingsIndex } from '@/routes/settings';
import { index as societiesIndex } from '@/routes/societies';
import { index as notificationsIndex } from '@/routes/notifications';
import { create as approveCreate } from '@/routes/approvals';
import { create as ticketCreate } from '@/routes/tickets';
import { create as workOrderCreate } from '@/routes/work-orders';
import { create as noticeCreate } from '@/routes/notices';
import { create as eventCreate } from '@/routes/events';
import { create as visitorCreate } from '@/routes/visitors';
import { create as gatepassCreate } from '@/routes/gatepasses';
import { create as vendorCreate } from '@/routes/vendors';
import { create as invoiceCreate } from '@/routes/invoices';
import { create as budgetCreate } from '@/routes/budgets';
import { create as paymentCreate } from '@/routes/payments';
import { create as documentCreate } from '@/routes/documents';
import { create as amenityCreate } from '@/routes/amenities';
import { create as assetCreate } from '@/routes/assets';
import { create as amcCreate } from '@/routes/amc';

interface CommandItem {
    title: string;
    href: string;
    icon: ComponentType<{ className?: string }> | LucideIcon;
    permission?: string;
    module?: string;
    keywords?: string;
}

interface CommandGroup {
    label: string;
    items: CommandItem[];
}

const createRoutes: CommandItem[] = [
    { title: 'New Work Order', href: workOrderCreate().url, icon: Wrench, permission: 'Create Work Order', module: 'Work Orders' },
    { title: 'New Ticket', href: ticketCreate().url, icon: Wrench, permission: 'Create Tickets', module: 'Tickets' },
    { title: 'New Notice', href: noticeCreate().url, icon: Megaphone, permission: 'Create Notice Board', module: 'Notice Board' },
    { title: 'New Event', href: eventCreate().url, icon: CalendarPlus, permission: 'Create Event', module: 'Events' },
    { title: 'New Visitor Pass', href: visitorCreate().url, icon: Users, permission: 'Create Visitors', module: 'Visitors' },
    { title: 'New Visitor Preapproval', href: '/visitor-preapprovals/create', icon: Users, permission: 'Create Visitor Preapproval', module: 'Visitor Preapprovals' },
    { title: 'New Visitor Type', href: '/visitor-types/create', icon: Users, permission: 'Create Visitor Preapproval', module: 'Visitor Preapprovals' },
    { title: 'New Gatepass', href: gatepassCreate().url, icon: ShieldCheck, permission: 'Create Gatepass', module: 'Gatepasses' },
    { title: 'New Document', href: documentCreate().url, icon: FilePlus2, permission: 'Create Documents', module: 'Documents' },
    { title: 'New Budget', href: budgetCreate().url, icon: BadgeDollarSign, permission: 'Create Budget', module: 'Budgets' },
    { title: 'New Invoice', href: invoiceCreate().url, icon: BadgeDollarSign, permission: 'Show Finance', module: 'Finance' },
    { title: 'Record Payment', href: paymentCreate().url, icon: BadgeDollarSign, permission: 'Show Finance', module: 'Finance' },
    { title: 'New Vendor', href: vendorCreate().url, icon: Store, permission: 'Create Vendor', module: 'Vendors' },
    { title: 'New Amenity', href: amenityCreate().url, icon: PackageOpen, permission: 'Create Amenities', module: 'Amenities' },
    { title: 'New Asset', href: assetCreate().url, icon: PackageOpen, permission: 'Create Assets', module: 'Assets' },
    { title: 'New AMC', href: amcCreate().url, icon: ShieldCheck, permission: 'Create AMC', module: 'AMC' },
    { title: 'New Approval Request', href: approveCreate().url, icon: ShieldCheck, permission: 'Create Approval', module: 'Approvals' },
    { title: 'New Chart of Account', href: '/chart-of-accounts/create', icon: BadgeDollarSign, permission: 'Create Chart of Account', module: 'Chart of Accounts' },
    { title: 'New Journal Voucher', href: '/journal-vouchers/create', icon: BadgeDollarSign, permission: 'Create Journal Voucher', module: 'Journal Vouchers' },
    { title: 'New Purchase Order', href: '/purchase-orders/create', icon: BadgeDollarSign, permission: 'Create Purchase Order', module: 'Purchase Orders' },
    { title: 'New Vendor Contract', href: '/vendor-contracts/create', icon: BadgeDollarSign, permission: 'Create Vendor Contract', module: 'Vendor Contracts' },
    { title: 'Record Vendor Payment', href: '/vendor-payments/create', icon: BadgeDollarSign, permission: 'Create Vendor Payment', module: 'Vendor Payments' },
    { title: 'New Fixed Deposit', href: '/fixed-deposits/create', icon: BadgeDollarSign, permission: 'Create Fixed Deposit', module: 'Fixed Deposits' },
    { title: 'New Prepaid Meter', href: '/prepaid-meters/create', icon: BadgeDollarSign, permission: 'Create Prepaid Meter', module: 'Prepaid Meters' },
    { title: 'New Emergency Broadcast', href: '/emergency-broadcasts/create', icon: Megaphone, permission: 'Create Emergency Broadcast', module: 'Emergency Broadcast' },
    { title: 'New Smart Device', href: '/smart-devices/create', icon: Cpu, permission: 'Create Smart Device', module: 'Smart Building' },
    { title: 'New Meeting', href: '/meetings/create', icon: Megaphone, permission: 'Create Meeting', module: 'Meetings' },
    { title: 'New Compliance Item', href: '/compliance-items/create', icon: ShieldCheck, permission: 'Create Compliance', module: 'Compliance' },
    { title: 'Register Pet', href: '/pets/create', icon: Users, permission: 'Create Pet', module: 'Pets' },
    { title: 'New Move Record', href: '/move-records/create', icon: Users, permission: 'Create Move Record', module: 'Move Records' },
];

const navGroups: CommandGroup[] = [
    {
        label: 'Go to',
        items: [
            { title: 'Dashboard', href: dashboard().url, icon: LayoutGrid, keywords: 'home' },
            { title: 'Analytics', href: '/analytics', icon: BarChart3, keywords: 'intelligence reports charts', permission: 'Show Analytics', module: 'Analytics' },
            { title: 'AI Assistant', href: '/assistant', icon: Sparkles, keywords: 'ask query intelligence', permission: 'Show AI Assistant', module: 'AI Assistant' },
            { title: 'Notifications', href: notificationsIndex().url, icon: LayoutGrid, keywords: 'bell alerts' },
        ],
    },
    {
        label: 'Estate',
        items: [
            { title: 'Towers', href: towerIndex().url, icon: Building2, permission: 'Show Tower', module: 'Tower' },
            { title: 'Apartments', href: apartmentIndex().url, icon: Users, permission: 'Show Apartment', module: 'Apartment' },
            { title: 'Parking', href: parkingIndex().url, icon: Building2, permission: 'Show Parking', module: 'Parking' },
        ],
    },
    {
        label: 'Amenities & Assets',
        items: [
            { title: 'Amenities', href: amenityIndex().url, icon: PackageOpen, permission: 'Show Amenities', module: 'Amenities' },
            { title: 'Amenity Bookings', href: amenityBookingIndex().url, icon: PackageOpen, permission: 'Show Book Amenity', module: 'Book Amenity' },
            { title: 'Assets', href: assetIndex().url, icon: PackageOpen, permission: 'Show Assets', module: 'Assets' },
            { title: 'AMC', href: amcIndex().url, icon: ShieldCheck, permission: 'Show AMC', module: 'AMC' },
        ],
    },
    {
        label: 'Operations',
        items: [
            { title: 'Tickets', href: ticketIndex().url, icon: Wrench, permission: 'Show Tickets', module: 'Tickets' },
            { title: 'Work Orders', href: workOrderIndex().url, icon: Wrench, permission: 'Show Work Orders', module: 'Work Orders' },
            { title: 'Documents', href: documentIndex().url, icon: FolderGit2, permission: 'Show Documents', module: 'Documents' },
        ],
    },
    {
        label: 'Services',
        items: [
            { title: 'Services', href: serviceIndex().url, icon: Wrench, permission: 'Show Service Provider', module: 'Service Provider' },
            { title: 'Service Requests', href: serviceRequestsIndex().url, icon: Wrench, permission: 'Show Service Requests', module: 'Service Requests' },
            { title: 'Service Types', href: serviceTypeIndex().url, icon: Wrench, permission: 'Show Service Provider', module: 'Service Provider' },
            { title: 'Service Log', href: serviceLogIndex().url, icon: Wrench, permission: 'Show Service Time Logging', module: 'Service Time Logging' },
        ],
    },
    {
        label: 'Security',
        items: [
            { title: 'Visitors', href: visitorIndex().url, icon: Users, permission: 'Show Visitors', module: 'Visitors' },
            { title: 'Visitor Preapprovals', href: '/visitor-preapprovals', icon: Users, permission: 'Show Visitor Preapproval', module: 'Visitor Preapprovals' },
            { title: 'Visitor Types', href: '/visitor-types', icon: Users, permission: 'Show Visitor Preapproval', module: 'Visitor Preapprovals' },
            { title: 'Gatepasses', href: gatepassIndex().url, icon: ShieldCheck, permission: 'Show Gatepass', module: 'Gatepasses' },
            { title: 'Patrol', href: patrolIndex().url, icon: ShieldCheck, permission: 'Show Patrol', module: 'Patrol' },
            { title: 'Boom Barriers', href: '/boom-barrier-logs', icon: ShieldCheck, permission: 'Show Boom Barrier', module: 'Boom Barriers' },
            { title: 'Vehicles', href: '/vehicles', icon: ShieldCheck, permission: 'Show Vehicles', module: 'Vehicles' },
            { title: 'SOS Alerts', href: sosIndex().url, icon: ShieldCheck, permission: 'Show SOS Alert', module: 'SOS Alerts' },
            { title: 'Emergency Contacts', href: emergencyIndex().url, icon: ShieldCheck, permission: 'Show Emergency Contacts', module: 'Emergency Contacts' },
            { title: 'Emergency Broadcasts', href: '/emergency-broadcasts', icon: Megaphone, permission: 'Show Emergency Broadcast', module: 'Emergency Broadcast' },
        ],
    },
    {
        label: 'Staff',
        items: [
            { title: 'Staff Management', href: '/staff', icon: Users, permission: 'Show Staff', module: 'Staff Management' },
            { title: 'Attendance', href: attendanceIndex().url, icon: Users, permission: 'Show Worker Checkin', module: 'Worker Checkins' },
            { title: 'Daily Help', href: dailyHelpIndex().url, icon: Users, permission: 'Show Daily Help', module: 'Daily Help' },
        ],
    },
    {
        label: 'Finance',
        items: [
            { title: 'Maintenance', href: maintenanceIndex().url, icon: BadgeDollarSign, permission: 'Show Maintenance', module: 'Maintenance' },
            { title: 'Payments', href: paymentIndex().url, icon: BadgeDollarSign, permission: 'Show Finance', module: 'Finance' },
            { title: 'Budgets', href: budgetIndex().url, icon: BadgeDollarSign, permission: 'Show Budget', module: 'Budgets' },
            { title: 'Ledger', href: ledgerIndex().url, icon: BadgeDollarSign, permission: 'Show General Ledger', module: 'General Ledger' },
            { title: 'Vendors', href: vendorIndex().url, icon: BadgeDollarSign, permission: 'Show Vendor', module: 'Vendors' },
            { title: 'Invoices', href: invoiceIndex().url, icon: BadgeDollarSign, permission: 'Show Finance', module: 'Finance' },
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
            { title: 'Energy Dashboard', href: '/energy', icon: Zap, permission: 'Show Energy', module: 'Energy' },
            { title: 'Smart Devices', href: '/smart-devices', icon: Cpu, permission: 'Show Smart Devices', module: 'Smart Building' },
        ],
    },
    {
        label: 'Commercial',
        items: [
            { title: 'Commercial Units', href: unitIndex().url, icon: Store, permission: 'Show Commercial Unit', module: 'Commercial Units' },
            { title: 'Commercial Tenants', href: tenantIndex().url, icon: Store, permission: 'Show Commercial Tenant', module: 'Commercial Tenants' },
            { title: 'Lease Agreements', href: leaseIndex().url, icon: Store, permission: 'Show Lease Agreement', module: 'Lease Agreements' },
            { title: 'CAM Charges', href: camIndex().url, icon: Store, permission: 'Show CAM Charge', module: 'CAM Charges' },
        ],
    },
    {
        label: 'Community',
        items: [
            { title: 'Notices', href: noticeIndex().url, icon: Megaphone, permission: 'Show Notice Board', module: 'Notice Board' },
            { title: 'Events', href: eventIndex().url, icon: Megaphone, permission: 'Show Event', module: 'Events' },
            { title: 'Polls', href: pollIndex().url, icon: Megaphone, permission: 'Show Poll', module: 'Polls' },
            { title: 'Members', href: memberIndex().url, icon: Users, permission: 'Show Members' },
            { title: 'Meetings', href: '/meetings', icon: Megaphone, permission: 'Show Meeting', module: 'Meetings' },
            { title: 'Pets', href: '/pets', icon: Users, permission: 'Show Pet', module: 'Pets' },
            { title: 'Family Members', href: '/family-members', icon: Users, permission: 'Show Family Members', module: 'Family Members' },
            { title: 'Move Records', href: '/move-records', icon: Users, permission: 'Show Move Record', module: 'Move Records' },
        ],
    },
    {
        label: 'Governance',
        items: [
            { title: 'Approvals', href: approvalIndex().url, icon: ShieldCheck, permission: 'Show Approvals', module: 'Approvals' },
            { title: 'Automation', href: automationIndex().url, icon: ShieldCheck, permission: 'Show Automations', module: 'Automations' },
            { title: 'Audit Trail', href: auditIndex().url, icon: ShieldCheck, permission: 'Show Audit Logs', module: 'Audit Logs' },
            { title: 'Compliance', href: '/compliance-items', icon: ShieldCheck, permission: 'Show Compliance', module: 'Compliance' },
        ],
    },
    {
        label: 'Settings',
        items: [
            { title: 'Settings', href: settingsIndex().url, icon: Building2, module: 'Settings' },
            { title: 'Society Settings', href: societiesIndex().url, icon: Building2, permission: 'Manage Settings', module: 'Settings' },
        ],
    },
];

export function CommandPalette() {
    const { props } = usePage();
    const tenancy = (props.tenancy ?? {}) as { permissions?: string[]; enabledModules?: string[] };
    const permissions = tenancy.permissions ?? [];
    const enabledModules = tenancy.enabledModules ?? [];
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((v) => !v);
            }
        };
        const openFromButton = () => setOpen(true);
        document.addEventListener('keydown', down);
        document.addEventListener('qnexus:open-command', openFromButton);
        return () => {
            document.removeEventListener('keydown', down);
            document.removeEventListener('qnexus:open-command', openFromButton);
        };
    }, []);

    const run = (item: CommandItem) => {
        setOpen(false);
        router.visit(item.href);
    };

    const visibleCreates = createRoutes.filter(
        (item) =>
            (!item.permission || permissions.includes(item.permission)) &&
            (!item.module || enabledModules.includes(item.module)),
    );
    const visibleNav = navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) =>
                    (!item.permission || permissions.includes(item.permission)) &&
                    (!item.module || enabledModules.includes(item.module)),
            ),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Quick create">
                    {visibleCreates.map((item) => (
                        <CommandItem key={item.title} value={item.title} onSelect={() => run(item)} keywords={[item.keywords ?? '', 'create']}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            <span className="sr-only">Create</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                {visibleNav.map((group) => (
                    <CommandGroup key={group.label} heading={group.label}>
                        {group.items.map((item) => (
                            <CommandItem key={item.title} value={`${group.label} ${item.title}`} onSelect={() => run(item)} keywords={[item.keywords ?? '']}>
                                <item.icon className={cn('size-4', item.title === 'Dashboard' ? 'text-primary' : 'text-muted-foreground')} />
                                <span>{item.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
    );
}
