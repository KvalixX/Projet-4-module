<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Treatment extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'patient_id',
        'patient_name',
        'date',
        'type',
        'tooth',
        'description',
        'cost',
        'dentist_id',
        'dentist_name',
        'prescriptions',
        'next_visit',
    ];

    protected $casts = [
        'date' => 'date',
        'next_visit' => 'date',
        'cost' => 'decimal:2',
        'prescriptions' => 'array',
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

    // Accessors
    public function getTotalCostAttribute(): float
    {
        return (float) $this->cost;
    }

    public function getFormattedCostAttribute(): string
    {
        return number_format($this->cost, 2) . ' DH';
    }
}
