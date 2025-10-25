<?php

declare(strict_types=1);

namespace Manuxi\SuluContentTypesBundle\Content\Type;

use Sulu\Component\Content\Compat\PropertyInterface;
use Sulu\Component\Content\SimpleContentType;

/**
 * ContentType for select with color preview.
 *
 * Simplified approach: Store colors directly in the value attribute
 * and use a custom format like "primary:#0d6efd"
 *
 * @author Manuxi
 */
class ColorSelect extends SimpleContentType
{
    public function __construct()
    {
        parent::__construct('ColorSelect', '');
    }

    /**
     * Returns the selected value for use in templates.
     */
    public function getContentData(PropertyInterface $property)
    {
        $value = $property->getValue();
        // Return only the key part (e.g., "primary" from "primary:#0d6efd")
        if ($value && strpos($value, ':') !== false) {
            return explode(':', $value)[0];
        }
        return $value ?: '';
    }

    /**
     * Returns data for the admin interface including all available options.
     *
     * New simplified XML structure:
     * <param name="values" type="collection">
     *     <param name="primary" value="primary:#0d6efd">
     *         <meta><title>Primary</title></meta>
     *     </param>
     * </param>
     */
    public function getViewData(PropertyInterface $property): array
    {
        $value = $property->getValue();
        $params = $property->getParams();

        $values = [];
        if (isset($params['values'])) {
            $valuesParam = $params['values']->getValue();

            if (\is_array($valuesParam)) {
                foreach ($valuesParam as $key => $item) {
                    $itemValue = $item->getValue();

                    // Parse format "primary:#0d6efd"
                    $parts = explode(':', $itemValue);
                    $name = $parts[0];
                    $color = isset($parts[1]) ? $parts[1] : '#000000';

                    // Get title from metadata using reflection
                    $title = $key;
                    try {
                        $reflector = new \ReflectionClass($item);
                        if ($reflector->hasProperty('metadata')) {
                            $metadataProperty = $reflector->getProperty('metadata');
                            $metadataProperty->setAccessible(true);
                            $metadata = $metadataProperty->getValue($item);

                            // Metadata is a Metadata object with get($key, $locale) method
                            if (is_object($metadata)) {
                                // Try to get title for current locale, fallback to any available
                                $metadataClass = get_class($metadata);
                                if (method_exists($metadata, 'getData')) {
                                    // getData() returns all metadata as array
                                    $metaData = $metadata->getData();
                                    if (isset($metaData['title'])) {
                                        $title = is_array($metaData['title']) ? reset($metaData['title']) : $metaData['title'];
                                    }
                                }
                            } elseif (is_array($metadata) && isset($metadata['title'])) {
                                $title = is_array($metadata['title']) ? reset($metadata['title']) : $metadata['title'];
                            }
                        }
                    } catch (\Exception $e) {
                        // Fallback to key if metadata access fails
                    }

                    $values[] = [
                        'name' => $name,
                        'value' => $itemValue, // Store full value with color
                        'color' => $color,
                        'title' => $title,
                    ];
                }
            }
        }

        return [
            'value' => $value,
            'values' => $values,
        ];
    }
}