<?php

namespace App\Service;

use Sulu\Bundle\MediaBundle\Api\Media;
use Symfony\Component\HttpFoundation\Response;

class PreloadService
{
    /**
     * @var array[]
     */
    private array $images = [];

    /**
     * @var string[]
     */
    private array $fonts = [];

    public function __construct(private readonly UserAgentService $userAgentService) {}

    /**
     * @return string[]
     */
    public function getImageUrls(): array
    {
        $result = [];

        foreach ($this->images as [ $image, $formats ]) {
            /** @var Media $image */
            /** @var array<string, string>[] $formats */

            $format = $this->getFormat($formats);

            $result[] = $image->getFormats()[$format] ?? $image->getUrl();
        }

        return $result;
    }

    protected function getFormat(array $formats): ?string
    {
        $format = 'sm';

        if ($this->userAgentService->isiPadOS() ||  $this->userAgentService->isiPad()) {
            $format = 'lg';
        } else if ($this->userAgentService->isTablet()) {
            $format = 'md';
        } else if ($this->userAgentService->isDesktop() || $this->userAgentService->isDesktopMode()) {
            $format = 'xl';
        }

        $bestFormat = $this->findBestFormat($format, $formats);

        if ($bestFormat && !preg_match('/\.\w+$/', $bestFormat)) {
            $bestFormat .= '.webp';
        }

        return $bestFormat;
    }

    protected function findBestFormat(string $format, array $formats): ?string
    {
        $result = null;

        switch ($format) {
            case 'sm':
                $result = $formats['sm'] ?? $formats['md'] ?? $formats['lg'] ?? $formats['xl'] ?? null;
                break;
            case 'md':
                $result = $formats['md'] ?? $formats['lg'] ?? $formats['xl'] ?? null;
                break;
            case 'lg':
                $result = $formats['lg'] ?? $formats['xl'] ?? null;
                break;
            case 'xl':
                $result = $formats['xl'] ?? null;
                break;
        }

        if ($result) {
            return $result;
        }

        // if nothing found, do the same in reverse...

        switch ($format) {
            case 'xl':
                $result = $formats['xl'] ?? $formats['lg'] ?? $formats['md'] ?? $formats['sm'] ?? null;
                break;
            case 'lg':
                $result = $formats['lg'] ?? $formats['md'] ?? $formats['sm'] ?? null;
                break;
            case 'md':
                $result = $formats['md'] ?? $formats['sm'] ?? null;
                break;
            case 'sm':
                $result = $formats['sm'] ?? null;
                break;
        }

        return $result;
    }

    public function addImage(Media $image, array $formats): void
    {
        $this->images[] = [ $image, $formats ];
    }

    /**
     * @return array
     */
    public function getFontUrls(): array
    {
        return $this->fonts;
    }

    public function addFont(string $font): void
    {
        $this->fonts[] = $font;
    }

    public function addPreloadHeaders(Response $response): Response
    {
        $linkHeaders = array_merge(
            $this->getImageLinkHeaders(),
            $this->getFontLinkHeaders(),
        );

        $response->headers->set('Link', [ implode(',', $linkHeaders) ], false);

        return $response;
    }

    protected function getFontLinkHeaders(): array
    {
        $linkHeaders = [];

        foreach ($this->getFontUrls() as $fontUrl) {
            $linkHeaders[] = '<' . $fontUrl . '>; rel="preload"; as=font';
        }

        return $linkHeaders;
    }

    protected function getImageLinkHeaders(): array
    {
        $linkHeaders = [];

        foreach ($this->getImageUrls() as $image) {
            $linkHeaders[] = '<' . $image . '>; rel="preload"; as=image';
        }

        return $linkHeaders;
    }
}
