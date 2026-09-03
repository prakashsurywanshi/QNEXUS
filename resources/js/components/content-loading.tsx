import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function TableSkeleton({ rows = 6, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-9 w-32" />
            </div>
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                    {Array.from({ length: columns }).map((__, c) => (
                        <Skeleton key={c} className={cn('h-4', c === 0 ? 'w-1/3' : 'flex-1')} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function ContentLoading({ className }: { className?: string }) {
    return (
        <div className={cn('flex flex-col gap-6 p-4', className)}>
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
            <TableSkeleton rows={4} columns={3} />
        </div>
    );
}
