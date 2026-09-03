import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: LucideIcon | null;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    compact?: boolean;
}

export default function EmptyState({ icon: Icon, title, description, action, className, compact }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 text-center',
                compact ? 'px-4 py-10' : 'px-6 py-16',
                className,
            )}
        >
            {Icon && (
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
                    <Icon className="size-6" />
                </div>
            )}
            <div className="space-y-1">
                <h3 className="text-base font-semibold">{title}</h3>
                {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            </div>
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
