<?php

declare(strict_types=1);

namespace Manuxi\SuluContentTypesBundle\Content\Type;

use Sulu\Component\Content\Compat\PropertyInterface;
use Sulu\Component\Content\SimpleContentType;

/**
 * ContentType for Number with default value support.
 * 
 * This content type extends the standard number input with a default_value parameter.
 * It supports all standard number parameters: min, max, step, multiple_of, plus default_value.
 * 
 * The implementation uses SimpleContentType which handles data persistence automatically.
 * This approach is compatible with both Sulu 2.x and the upcoming Sulu 3.x (no PHPCR dependency).
 * 
 * @author Manuxi
 */
class NumberWithDefault extends SimpleContentType
{
    public function __construct()
    {
        parent::__construct('NumberWithDefault');
    }

    /**
     * Returns the data to be used in templates.
     * If no value is set, returns the default_value from parameters.
     */
    public function getContentData(PropertyInterface $property)
    {
        $value = $property->getValue();
        
        // Use default value if no value is set
        if (null === $value || '' === $value) {
            return $this->getDefaultValueFromParams($property);
        }
        
        return \is_numeric($value) ? (float) $value : null;
    }

    /**
     * Returns data for the admin interface.
     */
    public function getViewData(PropertyInterface $property): array
    {
        return [
            'value' => $this->getContentData($property),
        ];
    }

    /**
     * Get default value from property parameters.
     */
    private function getDefaultValueFromParams(PropertyInterface $property): ?float
    {
        $params = $property->getParams();
        
        if (isset($params['default_value'])) {
            $defaultParam = $params['default_value'];
            $value = $defaultParam->getValue();
            
            if (null !== $value && \is_numeric($value)) {
                return (float) $value;
            }
        }
        
        return null;
    }
}
