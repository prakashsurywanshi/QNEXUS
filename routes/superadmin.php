<?php

use App\Http\Controllers\SuperAdmin\BlogPostController;
use App\Http\Controllers\SuperAdmin\CmsPageController;
use App\Http\Controllers\SuperAdmin\CmsSectionController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\GlobalSettingController;
use App\Http\Controllers\SuperAdmin\PackageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'superadmin'])
    ->prefix('super-admin')
    ->name('superadmin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('settings', [GlobalSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [GlobalSettingController::class, 'update'])->name('settings.update');

        Route::resource('cms/pages', CmsPageController::class)
            ->names('cms.pages')
            ->except('show');

        Route::resource('cms/sections', CmsSectionController::class)
            ->names('cms.sections')
            ->except('show');

        Route::resource('blog/posts', BlogPostController::class)
            ->names('blog.posts')
            ->except('show');

        Route::resource('packages', PackageController::class)
            ->names('packages')
            ->except('show');
    });
