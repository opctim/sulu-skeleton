<?php

namespace App\Validator;

use Attribute;
use Symfony\Component\Validator\Constraint;

#[Attribute]
class NotXss extends Constraint
{
    public string $message = 'Die Eingabe ist ungültig.';
}