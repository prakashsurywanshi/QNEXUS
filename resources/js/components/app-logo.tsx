import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

type Tenancy = {
    society?: {
        name?: string;
        logo?: string | null;
        show_logo_text?: boolean;
    } | null;
};

export default function AppLogo() {
    const { props } = usePage();
    const tenancy = (props.tenancy ?? {}) as Tenancy;
    const society = tenancy.society;

    const name = society?.name ?? (props.name as string | undefined) ?? 'QNEXUS';
    const logo = society?.logo;
    const showText = society?.show_logo_text ?? true;

    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md">
                {logo ? (
                    <img src={logo} alt={name} className="size-full object-contain" />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            {showText && (
                <div className="ml-1 grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate leading-tight font-semibold">{name}</span>
                </div>
            )}
        </>
    );
}
