<?php

namespace App\Http\Resources;

use App\Models\Society;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $role = $this->role;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'society_id' => $this->society_id,
            'email_verified_at' => $this->email_verified_at,
            'role' => $role ? [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => $role->display_name,
                'society_id' => $role->society_id,
            ] : null,
            'permissions' => $role ? $role->permissions()->pluck('name') : [],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
