<?php

namespace Database\Seeders;

use App\Models\NotificationTemplate;
use Illuminate\Database\Seeder;

class NotificationTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            ['key' => 'work_order_assigned', 'category' => 'work_orders', 'title' => 'Work order assigned', 'body' => 'A new work order ":subject" has been assigned to you.'],
            ['key' => 'work_order_completed', 'category' => 'work_orders', 'title' => 'Work order completed', 'body' => 'The work order ":subject" has been marked completed.'],
            ['key' => 'ticket_created', 'category' => 'tickets', 'title' => 'New request raised', 'body' => '":subject" has been raised and needs attention.'],
            ['key' => 'ticket_reply', 'category' => 'tickets', 'title' => 'New response on your request', 'body' => 'There is a new response on ":subject".'],
            ['key' => 'service_request_quote', 'category' => 'tickets', 'title' => 'Quote received', 'body' => 'A quote has been submitted for ":subject". Please review it.'],
            ['key' => 'service_request_advanced', 'category' => 'tickets', 'title' => 'Service request updated', 'body' => 'Your service request ":subject" has been updated.'],
            ['key' => 'notice_published', 'category' => 'notices', 'title' => 'New notice', 'body' => ':organization published ":subject".'],
            ['key' => 'approval_requested', 'category' => 'system', 'title' => 'Approval requested', 'body' => '":subject" is awaiting your approval.'],
            ['key' => 'approval_decided', 'category' => 'system', 'title' => 'Approval decision', 'body' => 'Your request ":subject" was :status.'],
            ['key' => 'visitor_at_gate', 'category' => 'visitors', 'title' => 'Visitor at gate', 'body' => ':visitor is at the gate, expecting to meet you.'],
            ['key' => 'visitor_approved', 'category' => 'visitors', 'title' => 'Visitor approved', 'body' => 'Your visitor :visitor has been approved.'],
            ['key' => 'maintenance_overdue', 'category' => 'finance', 'title' => 'Maintenance due', 'body' => 'Your maintenance for :month is due. Please pay before :date.'],
            ['key' => 'amc_expiring', 'category' => 'finance', 'title' => 'AMC expiring soon', 'body' => 'The AMC for :vendor expires on :date.'],
            ['key' => 'lease_expiring', 'category' => 'community', 'title' => 'Lease expiring', 'body' => 'The lease for :tenant expires on :date.'],
        ];

        foreach ($templates as $template) {
            NotificationTemplate::updateOrCreate(
                ['key' => $template['key']],
                $template
            );
        }
    }
}
