<?php

declare(strict_types=1);

namespace Manuxi\SuluContentTypesBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('sulu_content_types');
        $rootNode = $treeBuilder->getRootNode();

        $rootNode
            ->children()
                ->arrayNode('color_palettes')
                    ->info('Define color palettes for ColorSelect content type')
                    ->useAttributeAsKey('name')
                    ->arrayPrototype()
                        ->info('Color values as key => hex color code')
                        ->useAttributeAsKey('color_key')
                        ->scalarPrototype()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}