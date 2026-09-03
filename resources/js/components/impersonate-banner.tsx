import { Link, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ImpersonateBanner() {
    const { impersonate } = usePage().props as { impersonate?: { active: boolean; society_id: number | null; stop_url: string } };

    if (!impersonate?.active) {
        return null;
    }

    return (
        <Alert className="rounded-none border-x-0 border-t-0 bg-amber-500 text-white dark:bg-amber-600">
            <div className="flex items-center justify-between">
                <AlertDescription className="text-sm font-medium">
                    You are viewing as a society admin.
                </AlertDescription>
                <Link href={impersonate.stop_url} method="post" as="button">
                    <Button variant="outline" size="sm" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                        <LogOut className="mr-1 h-3 w-3" />
                        Stop Impersonation
                    </Button>
                </Link>
            </div>
        </Alert>
    );
}
