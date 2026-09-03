import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize whitespace-nowrap',
    {
        variants: {
            tone: {
                default: 'bg-muted text-muted-foreground',
                success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
                primary: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
                neutral: 'bg-secondary text-secondary-foreground',
                violet: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
                slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
            },
        },
        defaultVariants: {
            tone: 'default',
        },
    },
);

type StatusBadgeTone = NonNullable<VariantProps<typeof statusBadgeVariants>['tone']>;

const TONE_BY_STATUS: Record<string, StatusBadgeTone> = {
    open: 'info',
    pending: 'warning',
    assigned: 'info',
    in_progress: 'info',
    active: 'success',
    approved: 'success',
    allowed: 'success',
    paid: 'success',
    completed: 'success',
    resolved: 'success',
    verified: 'success',
    overdue: 'danger',
    rejected: 'danger',
    closed: 'neutral',
    cancelled: 'neutral',
    expired: 'neutral',
    inactive: 'neutral',
    denied: 'danger',
    unread: 'info',
    read: 'neutral',
};

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
    status?: string;
    tone?: StatusBadgeTone;
    className?: string;
    children?: React.ReactNode;
}

export default function StatusBadge({ status, tone, className, children }: StatusBadgeProps) {
    const resolvedTone = tone ?? (status ? (TONE_BY_STATUS[status.toLowerCase()] ?? 'default') : 'default');
    return <span className={cn(statusBadgeVariants({ tone: resolvedTone }), className)}>{children ?? status}</span>;
}
