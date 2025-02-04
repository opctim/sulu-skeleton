<?php
declare(strict_types=1);

/**
 * See https://sulu.io/blog/running-sulu-with-frankenphp for more info
 */

namespace App;

use Sulu\Component\HttpKernel\SuluKernel;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\TerminableInterface;

class DualKernel implements HttpKernelInterface, TerminableInterface
{
    private HttpKernelInterface $adminKernel;

    private HttpKernelInterface $websiteKernel;

    public function __construct($context)
    {
        Request::enableHttpMethodParameterOverride();

        $this->adminKernel = new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG'], SuluKernel::CONTEXT_ADMIN);

        $this->websiteKernel = new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG'], SuluKernel::CONTEXT_WEBSITE);

        // Comment this line if you want to use the "varnish" http
        // caching strategy. See http://sulu.readthedocs.org/en/latest/cookbook/caching-with-varnish.html
        if ('dev' !== $context['APP_ENV']) {
            $this->websiteKernel = $this->websiteKernel->getHttpCache();
        }
    }

    public function handle(Request $request, int $type = self::MAIN_REQUEST, bool $catch = true): Response
    {
        if ($this->isAdmin($request)) {
            return $this->adminKernel->handle($request, $type, $catch);
        }

        return $this->websiteKernel->handle($request, $type, $catch);
    }

    public function terminate(Request $request, Response $response): void
    {
        if ($this->isAdmin($request)) {
            $this->adminKernel->terminate($request, $response);
        }

        $this->websiteKernel->terminate($request, $response);
    }

    private function isAdmin(Request $request): bool
    {
        return !!preg_match('/^\/admin(\/|$)/', $request->getPathInfo());
    }
}
