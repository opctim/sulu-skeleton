<?php

declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class NotXss extends Constraint
{
    public string $message = 'Die Eingabe ist ungültig.';
}
