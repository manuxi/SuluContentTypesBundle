<?php

declare(strict_types=1);

namespace Manuxi\SuluContentTypesBundle\Content\Type;

use Sulu\Component\Content\Compat\PropertyInterface;
use Sulu\Component\Content\SimpleContentType;

/**
 * ContentType for slider/range input with configurable min/max/step/default.
 * 
 * Provides a visual slider interface combined with a number input for precise control.
 * Perfect for values like rotation speeds, opacity, priorities, etc.
 * 
 * The implementation uses SimpleContentType which handles data persistence automatically.
 * This approach is compatible with both Sulu 2.x and the upcoming Sulu 3.x (no PHPCR dependency).
 * 
 * @author Manuxi
 */
class SliderRange extends SimpleContentType
{
    public function __construct()
    {
        parent::__construct('SliderRange');
    }

    /**
     * Returns the value for use in templates.
     * If no value is set, returns the default_value from parameters.
     */
    public function getContentData(PropertyInterface $property)
    {
        $value = $property->getValue();
        
        // Use default value if no value is set
        if (null === $value || '' === $value) {
            return $this->getDefaultValueFromParams($property);
        }
        
        return \is_numeric($value) ? (int) $value : null;
    }

    /**
     * Returns data for the admin interface including min/max/step parameters.
     */
    public function getViewData(PropertyInterface $property): array
    {
        $params = $property->getParams();
        
        return [
            'value' => $this->getContentData($property),
            'min' => isset($params['min']) ? (int) $params['min']->getValue() : 0,
            'max' => isset($params['max']) ? (int) $params['max']->getValue() : 100,
            'step' => isset($params['step']) ? (int) $params['step']->getValue() : 1,
        ];
    }

    /**
     * Get default value from property parameters.
     */
    private function getDefaultValueFromParams(PropertyInterface $property): ?int
    {
        $params = $property->getParams();
        
        if (isset($params['default_value'])) {
            $defaultParam = $params['default_value'];
            $value = $defaultParam->getValue();
            
            if (null !== $value && \is_numeric($value)) {
                return (int) $value;
            }
        }
        
        return null;
    }
}
