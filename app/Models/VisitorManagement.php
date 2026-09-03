<?php

namespace App\Models;

use App\Traits\HasSociety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int|null $id
 * @property int|null $society_id
 * @property string $visitor_name
 * @property string|null $visitor_photo
 * @property string|null $phone_number
 * @property string|null $address
 * @property int|null $apartment_id
 * @property string|null $date_of_visit
 * @property string|null $date_of_exit
 * @property string|null $in_time
 * @property string|null $out_time
 * @property int|null $user_id
 * @property int|null $added_by
 * @property string $status
 * @property string|null $purpose_of_visit
 * @property int|null $visitor_type_id
 * @property string|null $id_proof_type
 * @property string|null $id_proof_number
 */
class VisitorManagement extends Model
{
    use HasFactory, HasSociety;

    protected $table = 'visitors_management';

    protected $appends = [
        'visitor_photo_url',
    ];

    protected $casts = [
        'date_of_visit' => 'datetime',
    ];

    const FILE_PATH = 'visitors-photos';

    public function getVisitorPhotoUrlAttribute(): ?string
    {
        if ($this->visitor_photo) {
            return asset_url_local_s3(VisitorManagement::FILE_PATH.'/'.$this->visitor_photo);
        }

        return null;
    }

    /**
     * @return BelongsTo<ApartmentManagement, $this>
     */
    public function apartment(): BelongsTo
    {
        return $this->belongsTo(ApartmentManagement::class, 'apartment_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    /**
     * @return BelongsTo<Society, $this>
     */
    public function society(): BelongsTo
    {
        return $this->belongsTo(Society::class, 'society_id');
    }

    /**
     * @return BelongsTo<VisitorTypeSettingsModel, $this>
     */
    public function visitorType(): BelongsTo
    {
        return $this->belongsTo(VisitorTypeSettingsModel::class, 'visitor_type_id');
    }
}
