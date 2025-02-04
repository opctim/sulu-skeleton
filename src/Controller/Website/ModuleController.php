<?php

declare(strict_types=1);

namespace App\Controller\Website;

use App\Service\PreloadService;
use Sulu\Bundle\WebsiteBundle\Controller\DefaultController;
use Sulu\Component\Content\Compat\StructureInterface;
use Symfony\Component\HttpFoundation\Response;

class ModuleController extends DefaultController
{
    public function indexAction(StructureInterface $structure, $preview = false, $partial = false): Response
    {
        $request = $this->container->get('request_stack')->getCurrentRequest();

        // enforcing the format so the bad guys can fuck off
        if ('html' !== $request->getRequestFormat()) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }

        return $this->addPreloadHeaders(
            parent::indexAction($structure, $preview, $partial),
        );
    }

    protected function addPreloadHeaders(Response $response): Response
    {
        /** @var PreloadService $preloadService */
        $preloadService = $this->container->get(PreloadService::class);

        return $preloadService->addPreloadHeaders($response);
    }

    public static function getSubscribedServices(): array
    {
        return [
            ...parent::getSubscribedServices(),
            PreloadService::class,
        ];
    }
}
