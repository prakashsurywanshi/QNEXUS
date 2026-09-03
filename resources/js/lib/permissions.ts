import { usePage } from '@inertiajs/react';

export function useCan(): (permission?: string) => boolean {
    const { props } = usePage();
    const tenancy = (props.tenancy ?? {}) as { permissions?: string[] };
    const permissions = tenancy.permissions ?? [];

    return (permission?: string) => (permission ? permissions.includes(permission) : true);
}