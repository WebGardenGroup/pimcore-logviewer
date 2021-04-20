# pimcore-logviewer
Usagelog viewer for Pimcore admin interface

[![Packagist](https://img.shields.io/packagist/v/wgg/pimcore-logviewer)](https://packagist.org/packages/wgg/pimcore-logviewer)
[![Software License](https://img.shields.io/packagist/l/wgg/pimcore-logviewer)](LICENSE)

#### Requirements

* Pimcore >= 6.8.0

## Installation

```shell
$ composer require wgg/pimcore-logviewer
```

### Installation via Extension Manager

After you have installed the Logviewer Bundle via composer, open Pimcore backend and go to `Tools` => `Bundles`:

- Click the green `+` Button in `Enable / Disable` row
- Click the green `+` Button in `Install/Uninstall` row

### Installation via CommandLine

After you have installed the Logviewer Bundle via composer:

- Execute: `$ bin/console pimcore:bundle:enable WggLogviewerBundle`
- Execute: `$ bin/console pimcore:bundle:install WggLogviewerBundle`

## Upgrading

### Upgrading via Extension Manager

After you have updated the Logviewer Bundle via composer, open Pimcore backend and go to `Tools` => `Bundles`:

- Click the green `+` Button in `Update` row

### Upgrading via CommandLine

After you have updated the Logviewer Bundle via composer:

- Execute: `$ bin/console pimcore:bundle:update WggLogviewerBundle`

### Migrate via CommandLine

Does actually the same as the update command and preferred in CI-Workflow:

- Execute: `$ bin/console pimcore:migrations:migrate --bundle WggLogviewerBundle --allow-no-migration`

## Usage

Logviewer is accessible from the `Tools / View logs` on the administration panel.
