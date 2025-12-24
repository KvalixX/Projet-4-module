<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Staff extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'staff';

    protected $fillable = [
        'first_name',
        'last_name',
        'role',
        'specialty',
        'phone',
        'email',
        'password',
        'schedule',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'schedule' => 'array',
    ];

    // Relations
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'dentist_id');
    }

    public function treatments(): HasMany
    {
        return $this->hasMany(Treatment::class, 'dentist_id');
    }

    // Scopes
    public function scopeDentists($query)
    {
        return $query->where('role', 'dentist');
    }

    public function scopeAvailable($query)
    {
        return $query->whereNotNull('schedule');
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function isDentist(): bool
    {
        return $this->role === 'dentist';
    }
}
