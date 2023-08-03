<?php

namespace App\Twig;

use App\Service\PreloadService;
use Psr\Container\ContainerInterface;
use Sulu\Bundle\MediaBundle\Api\Media;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class AppExtension extends AbstractExtension implements ServiceSubscriberInterface
{
    private ContainerInterface $container;
    private ParameterBagInterface $parameterBag;

    public function __construct(
        ContainerInterface $container,
        ParameterBagInterface $parameterBag
    ) {
        $this->container = $container;
        $this->parameterBag = $parameterBag;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('is_string', 'is_string'),
            new TwigFunction('uniqid', 'uniqid'),
            new TwigFunction('preload_image', [$this, 'preloadImage']),
            new TwigFunction('preload_font', [$this, 'preloadFont']),
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
