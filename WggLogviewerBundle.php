<?php

namespace Wgg\LogviewerBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;
use Pimcore\Extension\Bundle\Installer\InstallerInterface;

class WggLogviewerBundle extends AbstractPimcoreBundle
{
    public function getJsPaths(): array
    {
        return [
            '/bundles/wgglogviewer/js/plugin.js',
            '/bundles/wgglogviewer/js/panel.js',
            '/bundles/wgglogviewer/js/item.js',
        ];
    }

    public function getCssPaths(): array
    {
        return [
            '/bundles/wgglogviewer/css/logviewer.css',
        ];
    }

    public function getInstaller(): InstallerInterface
    {
        return new Installer();
    }
}
