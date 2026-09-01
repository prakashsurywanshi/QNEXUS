import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes/superadmin';
import { edit, update } from '@/routes/superadmin/settings';

type SettingsData = {
    name: string;
    email: string;
    locale: string;
    timezone: string;
    default_currency_id: string;
    disable_landing_site: boolean;
    landing_site_type: 'theme' | 'custom';
    landing_site_url: string;
    show_logo_text: boolean;
    facebook_link: string;
    instagram_link: string;
    twitter_link: string;
    meta_keyword: string;
    meta_description: string;
};

type Currency = {
    id: number;
    currency_name: string;
    currency_symbol: string;
    currency_code: string;
    status: string;
};

export default function SuperAdminSettings({
    settings,
    currencies,
}: {
    settings: SettingsData & { id: number };
    currencies: Currency[];
}) {
    const { data, setData, put, processing, errors } = useForm<SettingsData>({
        name: settings.name,
        email: settings.email ?? '',
        locale: settings.locale ?? 'en',
        timezone: settings.timezone ?? 'Asia/Kolkata',
        default_currency_id: settings.default_currency_id?.toString() ?? '',
        disable_landing_site: settings.disable_landing_site,
        landing_site_type: settings.landing_site_type,
        landing_site_url: settings.landing_site_url ?? '',
        show_logo_text: settings.show_logo_text,
        facebook_link: settings.facebook_link ?? '',
        instagram_link: settings.instagram_link ?? '',
        twitter_link: settings.twitter_link ?? '',
        meta_keyword: settings.meta_keyword ?? '',
        meta_description: settings.meta_description ?? '',
    });

    return (
        <>
            <Head title="Global Settings" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Heading
                    title="Global Settings"
                    description="Platform-wide configuration shared by every society"
                />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(update().url);
                    }}
                    className="max-w-2xl space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Platform name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="e.g. QNEXUS"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Support email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="support@qnexus.test"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="locale">Locale</Label>
                            <Input
                                id="locale"
                                name="locale"
                                value={data.locale}
                                onChange={(e) => setData('locale', e.target.value)}
                                placeholder="en"
                            />
                            <InputError message={errors.locale} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Input
                                id="timezone"
                                name="timezone"
                                value={data.timezone}
                                onChange={(e) => setData('timezone', e.target.value)}
                                placeholder="Asia/Kolkata"
                            />
                            <InputError message={errors.timezone} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="default_currency_id">Default currency</Label>
                        <Select
                            value={data.default_currency_id}
                            onValueChange={(v) => setData('default_currency_id', v)}
                        >
                            <SelectTrigger id="default_currency_id" className="w-full">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((currency) => (
                                    <SelectItem key={currency.id} value={currency.id.toString()}>
                                        {currency.currency_name} ({currency.currency_code} {currency.currency_symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.default_currency_id} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="disable_landing_site"
                            checked={data.disable_landing_site}
                            onCheckedChange={(checked) =>
                                setData('disable_landing_site', checked === true)
                            }
                        />
                        <Label htmlFor="disable_landing_site">Disable landing site</Label>
                        <InputError message={errors.disable_landing_site} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="show_logo_text"
                            checked={data.show_logo_text}
                            onCheckedChange={(checked) =>
                                setData('show_logo_text', checked === true)
                            }
                        />
                        <Label htmlFor="show_logo_text">Show logo text</Label>
                        <InputError message={errors.show_logo_text} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="landing_site_type">Landing site type</Label>
                        <Select
                            value={data.landing_site_type}
                            onValueChange={(v) =>
                                setData('landing_site_type', v as 'theme' | 'custom')
                            }
                        >
                            <SelectTrigger id="landing_site_type" className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="theme">Theme</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.landing_site_type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="landing_site_url">Landing site URL</Label>
                        <Input
                            id="landing_site_url"
                            name="landing_site_url"
                            type="url"
                            value={data.landing_site_url}
                            onChange={(e) => setData('landing_site_url', e.target.value)}
                            placeholder="https://qnexus.test"
                        />
                        <InputError message={errors.landing_site_url} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="facebook_link">Facebook</Label>
                            <Input
                                id="facebook_link"
                                name="facebook_link"
                                value={data.facebook_link}
                                onChange={(e) => setData('facebook_link', e.target.value)}
                            />
                            <InputError message={errors.facebook_link} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="instagram_link">Instagram</Label>
                            <Input
                                id="instagram_link"
                                name="instagram_link"
                                value={data.instagram_link}
                                onChange={(e) => setData('instagram_link', e.target.value)}
                            />
                            <InputError message={errors.instagram_link} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="twitter_link">Twitter</Label>
                            <Input
                                id="twitter_link"
                                name="twitter_link"
                                value={data.twitter_link}
                                onChange={(e) => setData('twitter_link', e.target.value)}
                            />
                            <InputError message={errors.twitter_link} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meta_keyword">Meta keywords</Label>
                        <Input
                            id="meta_keyword"
                            name="meta_keyword"
                            value={data.meta_keyword}
                            onChange={(e) => setData('meta_keyword', e.target.value)}
                            placeholder="society, management, qnexus"
                        />
                        <InputError message={errors.meta_keyword} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meta_description">Meta description</Label>
                        <Textarea
                            id="meta_description"
                            name="meta_description"
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            placeholder="Short description shown in search engines"
                        />
                        <InputError message={errors.meta_description} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save settings</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

SuperAdminSettings.layout = {
    breadcrumbs: [
        {
            title: 'Super Admin',
            href: dashboard(),
        },
        {
            title: 'Global Settings',
            href: edit(),
        },
    ],
};