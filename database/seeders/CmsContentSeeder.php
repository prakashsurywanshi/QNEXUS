<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\CmsPage;
use App\Models\CmsSection;
use Illuminate\Database\Seeder;

class CmsContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedPage('about', 'About QNEXUS', [
            'content' => "QNEXUS is an intelligent, role-based Community & Commercial Management Platform designed by QODEIGENCE for residential societies, gated communities, commercial buildings, business parks, and mixed-use properties.\n\nQNEXUS connects people, property, security, services and operations in one intelligent community experience. The platform transforms traditional society management from fragmented, paper-based and WhatsApp-driven processes into a structured, secure and intelligent digital operating environment.\n\nThe long-term vision is that every person, unit, vehicle, visitor, asset, facility, vendor and service within a property has a connected digital identity and workflow.",
            'meta_title' => 'About QNEXUS',
            'meta_description' => 'QNEXUS is an intelligent community and commercial management platform by QODEIGENCE.',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        $this->seedPage('pricing', 'Pricing', [
            'content' => 'QNEXUS pricing is designed around the scale of your community. Pricing can be based on units, users, modules, usage and infrastructure.',
            'meta_title' => 'Pricing',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        $this->seedPage('contact', 'Contact', [
            'content' => 'Get in touch with the QNEXUS team to start modernizing your society.',
            'meta_title' => 'Contact',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        $this->seedPage('security', 'Security & Access', [
            'content' => "QNEXUS delivers secure, modern and contactless access for every resident, visitor and vehicle through its flagship QR-based access engine.\n\nResidents and staff can generate and share time-bound QR entry passes that gate and boom-barrier staff verify instantly at the point of entry. Visitors receive a secure digital QR invitation that is validated on arrival, eliminating paper passes and manual logbooks while keeping a full audit trail.\n\nVehicles enjoy the same contactless flow, and the same digital identity connects access control, patrol logs and emergency response across your property.",
            'meta_title' => 'QR-Based Access & Security',
            'meta_description' => 'Secure, contactless QR-based entry for residents, visitors and vehicles with QNEXUS.',
            'status' => 'published',
            'sort_order' => 4,
        ]);

        $hero = CmsSection::firstOrCreate(
            ['slug' => 'hero'],
            [
                'name' => 'Hero',
                'section_type' => 'hero',
                'heading' => 'Intelligent Community & Commercial Management',
                'subheading' => 'QNEXUS connects people, property, security, services and operations in one intelligent community experience.',
                'button_text' => 'Get started',
                'button_link' => '/register',
                'status' => 'published',
                'sort_order' => 0,
            ]
        );

        $hero->update([
            'name' => 'Hero',
            'section_type' => 'hero',
            'heading' => 'Intelligent Community & Commercial Management',
            'subheading' => 'QNEXUS connects people, property, security, services and operations in one intelligent community experience.',
            'button_text' => 'Get started',
            'button_link' => '/register',
            'status' => 'published',
            'sort_order' => 0,
        ]);

        CmsSection::firstOrCreate(
            ['slug' => 'features'],
            [
                'name' => 'Features',
                'section_type' => 'features',
                'heading' => 'Everything a community needs',
                'status' => 'published',
                'sort_order' => 1,
            ]
        );

        CmsSection::firstOrCreate(
            ['slug' => 'security'],
            [
                'name' => 'Security & Access',
                'section_type' => 'cta',
                'heading' => 'QR-based access is a flagship QNEXUS feature',
                'subheading' => 'Secure, modern and contactless access for every resident, visitor and vehicle.',
                'button_text' => 'Learn more',
                'button_link' => '/page/security',
                'status' => 'published',
                'sort_order' => 2,
            ]
        );

        CmsSection::firstOrCreate(
            ['slug' => 'cta'],
            [
                'name' => 'Call to action',
                'section_type' => 'cta',
                'heading' => 'Ready to modernize your society?',
                'subheading' => 'Start today and bring your community online.',
                'button_text' => 'Start with QNEXUS',
                'button_link' => '/register',
                'status' => 'published',
                'sort_order' => 3,
            ]
        );

        BlogPost::firstOrCreate(
            ['slug' => 'welcome-to-qnexus'],
            [
                'title' => 'Welcome to QNEXUS',
                'excerpt' => 'An intelligent, role-based community and commercial management platform built for modern societies.',
                'body' => "We are excited to introduce QNEXUS — an intelligent, role-based Community & Commercial Management Platform.\n\nQNEXUS connects people, property, security, services and operations in one intelligent community experience, transforming traditional society management into a structured, secure and intelligent digital operating environment.\n\nStay tuned for more updates from the QNEXUS team.",
                'category' => 'News',
                'author' => 'QODEIGENCE',
                'status' => 'published',
                'published_at' => now(),
            ]
        );
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function seedPage(string $slug, string $title, array $attributes): void
    {
        CmsPage::firstOrCreate(
            ['slug' => $slug],
            ['title' => $title, ...$attributes]
        );
    }
}
