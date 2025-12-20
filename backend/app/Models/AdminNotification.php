<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AdminNotification extends Model
{
    use HasUuids;

    protected $fillable = [
        'type',
        'title',
        'message',
        'read',
        'related_id',
        'patient_id',
    ];

    protected $casts = [
        'read' => 'boolean',
        'created_at' => 'datetime',
    ];

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Methods
    public function markAsRead(): void
    {
        $this->update(['read' => true]);
    }

    public function markAsUnread(): void
    {
        $this->update(['read' => false]);
    }
}
