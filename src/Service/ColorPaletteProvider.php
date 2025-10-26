<?php

declare(strict_types=1);

namespace Manuxi\SuluContentTypesBundle\Service;

use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Provides color palette options from YAML configuration.
 */
class ColorPaletteProvider
{
    private array $palettes;
    private string $defaultPalette = 'bootstrap';

    public function __construct(
        private TranslatorInterface $translator,
        array $palettes = [],
    ) {
        $this->palettes = $palettes;
    }

    /**
     * Get all available color values for a specific palette.
     *
     * @param string $paletteName Name of palette (e.g., 'bootstrap', 'custom')
     *
     * @return array Array of color options with name, value, and title
     */
    public function getValues(string $paletteName = 'bootstrap'): array
    {
        if (!isset($this->palettes[$paletteName])) {
            return [];
        }

        $values = [];
        $colors = $this->palettes[$paletteName];

        foreach ($colors as $key => $colorCode) {
            // Generate translation key
            $transKey = sprintf('sulu_content_types.colors.%s', $key);

            $values[] = [
                'name' => $key,
                'value' => sprintf('%s:%s', $key, $colorCode), // Format: "primary:#0d6efd"
                'title' => $this->translator->trans($transKey, [], 'admin'),
            ];
        }

        return $values;
    }

    public function getDefaultPalette(): string
    {
        return $this->defaultPalette;
    }

    public function getAvailablePalettes(): array
    {
        return array_keys($this->palettes);
    }

    public function getDefaultValue(string $paletteName = 'bootstrap'): string
    {
        if (!isset($this->palettes[$paletteName])) {
            $bootstrapPalette = $this->palettes[$this->getDefaultPalette()] ?? [];
        } else {
            $bootstrapPalette = $this->palettes[$paletteName] ?? [];
        }

        return array_key_first($bootstrapPalette) ?? '';
    }
}
