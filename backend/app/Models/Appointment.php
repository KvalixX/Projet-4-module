<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'patient_id',
        'patient_name',
        'dentist_id',
        'dentist_name',
        'date',
        'time',
        'duration',
        'type',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime',
    ];

    // Relations
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function dentist(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'dentist_id');
    }

    // Scopes
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('date', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', today())
                     ->where('status', 'scheduled')
                     ->orderBy('date')
                     ->orderBy('time');
    }

    // Methods
    public function isConflicting($date, $time, $duration, $dentistId): bool
    {
        $endTime = \Carbon\Carbon::parse($time)->addMinutes($duration);
        
        return self::where('dentist_id', $dentistId)
            ->where('date', $date)
            ->where('status', 'scheduled')
            ->where('id', '!=', $this->id ?? null)
            ->where(function($query) use ($time, $endTime) {
                $query->whereBetween('time', [$time, $endTime])
                      ->orWhere(function($q) use ($time) {
                          $q->where('time', '<=', $time)
                            ->whereRaw('ADDTIME(time, SEC_TO_TIME(duration * 60)) > ?', [$time]);
                      });
            })
            ->exists();
    }

    public function canBeCancelled(): bool
    {
        return $this->status === 'scheduled' && $this->date >= today();
    }
}
