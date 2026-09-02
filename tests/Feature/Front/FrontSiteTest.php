<?php

namespace Tests\Feature\Front;

use App\Models\BlogPost;
use App\Models\CmsPage;
use App\Models\GlobalSetting;
use Database\Seeders\CmsContentSeeder;
use Database\Seeders\GlobalCurrencySeeder;
use Database\Seeders\GlobalSettingsSeeder;
use Database\Seeders\SuperadminSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FrontSiteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(GlobalSettingsSeeder::class);
        $this->seed(GlobalCurrencySeeder::class);
        $this->seed(SuperadminSeeder::class);
        $this->seed(CmsContentSeeder::class);

        GlobalSetting::query()->update(['disable_landing_site' => false]);

        forget_global_settings_cache();
    }

    public function test_homepage_renders(): void
    {
        $this->get(route('home'))->assertOk();
    }

    public function test_blog_index_renders(): void
    {
        $this->get(route('site.blog'))->assertOk();
    }

    public function test_blog_post_renders(): void
    {
        $slug = BlogPost::where('status', 'published')->value('slug');

        $this->get(route('site.post', $slug))->assertOk();
    }

    public function test_dynamic_page_renders(): void
    {
        $slug = CmsPage::where('status', 'published')->value('slug');

        $this->get(route('site.page', $slug))->assertOk();
    }

    public function test_missing_dynamic_page_returns_404(): void
    {
        $this->get(route('site.page', 'does-not-exist'))->assertNotFound();
    }
}
