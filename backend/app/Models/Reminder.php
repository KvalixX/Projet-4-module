<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'patient_id',
        'patient_name',
        'type',
        'due_date',
        'message',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    // Relations
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', today());
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', today())
                     ->where('status', 'pending');
    }

    // Methods
    public function markAsSent(): void
    {
        $this->update(['status' => 'sent']);
    }

    public function markAsCompleted(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function isOverdue(): bool
    {
        return $this->due_date < today() && $this->status === 'pending';
    }
}
