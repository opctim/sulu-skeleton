<?php

declare(strict_types=1);

namespace App\Twig;

use App\Service\PreloadService;
use Psr\Container\ContainerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class AppExtension extends AbstractExtension implements ServiceSubscriberInterface
{
    public function __construct(
        private readonly ContainerInterface $container,
        private readonly ParameterBagInterface $parameterBag,
    ) {
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('is_string', 'is_string'),
            new TwigFunction('uniqid', 'uniqid'),
            new TwigFunction('preload_image', fn ($args): string => $this->preloadImage($args)),
            new TwigFunction('preload_font', fn ($args): string => $this->preloadFont($args)),
        ];
    }

    public function preloadFont(...$args): string
    {
        /** @var PreloadService $service */
        $service = $this->container->get(PreloadService::class);

        $service->addFont(...$args);

        return '';
    }

    public function preloadImage(...$args): string
    {
        /** @var PreloadService $service */
        $service = $this->container->get(PreloadService::class);

        $service->addImage(...$args);

        return '';
    }

    public static function getSubscribedServices(): array
    {
        return [
            PreloadService::class,
        ];
    }
}
