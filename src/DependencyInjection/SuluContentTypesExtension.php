<?php

namespace Manuxi\SuluContentTypesBundle\DependencyInjection;

use Manuxi\SuluContentTypesBundle\Service\ColorPaletteProvider;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\Yaml\Yaml;

class SuluContentTypesExtension extends Extension implements PrependExtensionInterface
{
    public function prepend(ContainerBuilder $container): void
    {
        if ($container->hasExtension('framework')) {
            $defaultConfigFile = __DIR__.'/../Resources/config/default.yaml';
            $defaultConfig = Yaml::parseFile($defaultConfigFile);

            if (isset($defaultConfig['sulu_content_types'])) {
                $container->prependExtensionConfig('sulu_content_types', $defaultConfig['sulu_content_types']);
            }

            $container->prependExtensionConfig('framework', [
                'translator' => [
                    'paths' => [
                        __DIR__.'/../Resources/translations',
                    ],
                ],
            ]);
        }
    }

    public function load(array $configs, ContainerBuilder $container): void
    {
        // Process configuration FIRST (merges default.yaml with project config)
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        // Set parameter for use in services.xml
        $palettes = $config['color_palettes'] ?? [];
        $container->setParameter('sulu_content_types.color_palettes', $palettes);

        // Load services.xml AFTER setting parameters
        $loader = new XmlFileLoader(
            $container,
            new FileLocator(__DIR__.'/../Resources/config')
        );
        $loader->load('services.xml');

        // Register ColorPaletteProvider with merged config
        //$this->registerColorPaletteProvider($container, $palettes);
    }

    private function registerColorPaletteProvider(ContainerBuilder $container, array $palettes): void
    {
        $definition = new Definition(ColorPaletteProvider::class);
        $definition->setArguments([
            new Reference('translator'),
            $palettes,
        ]);
        $definition->setPublic(true);

        $container->setDefinition('sulu_content_types.color_palette_provider', $definition);
        $container->setAlias(ColorPaletteProvider::class, 'sulu_content_types.color_palette_provider');
    }
}
