<?php

namespace App\Service;

use Jenssegers\Agent\Agent;
use Symfony\Component\HttpFoundation\RequestStack;

class UserAgentService extends Agent
{
    public function __construct(RequestStack $requestStack) {
        $request = $requestStack->getCurrentRequest();

        parent::__construct(
            $request->headers->all(),
            $request->headers->get('User-Agent')
        );
    }
}