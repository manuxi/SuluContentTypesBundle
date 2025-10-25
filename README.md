# Sulu Content Types Bundle

Custom Content Types for Sulu CMS 2.6+

[![License](https://img.shields.io/github/license/manuxi/SuluContentTypesBundle)](https://github.com/manuxi/SuluContentTypesBundle/blob/main/LICENSE)
[![Sulu Version](https://img.shields.io/badge/Sulu-%5E2.6-blue)](https://sulu.io/)
[![PHP Version](https://img.shields.io/badge/PHP-%5E8.1-purple)](https://php.net/)

[Deutsche Version](README_DE.md) | **English Version**

---

## Features

This bundle provides three custom content types for Sulu CMS:

### 1. 🔢 NumberWithDefault
Number input field with default value support. Extends the standard `number` type with a `default_value` parameter.

**Use Cases:**
- Refresh intervals
- Timeouts
- Counters with default values

### 2. 🎨 ColorSelect
Select field with color preview using Sulu's icon font. Perfect for Bootstrap color classes or any color-coded options.

**Use Cases:**
- Button colors
- Badge colors
- Theme color selection

### 3. 🎚️ SliderRange
Visual range slider with configurable display modes. Supports textbox input, floating tooltips, and various label layouts.

**Use Cases:**
- Banner rotation speeds
- Opacity/transparency
- Priority levels
- Volume controls

---

## Installation

### 1. Install via Composer

```bash
composer require manuxi/sulu-content-types-bundle
```

### 2. Enable the Bundle

Add the bundle to your `config/bundles.php`:

```php
<?php

return [
    // ...
    Manuxi\SuluContentTypesBundle\ManuxiSuluContentTypesBundle::class => ['all' => true],
];
```

### 3. Register Admin Assets

Add to your main project's `assets/admin/package.json`:

```json
{
    "dependencies": {
        "sulu-content-types-bundle": "file:../../vendor/manuxi/sulu-content-types-bundle/src/Resources"
    }
}
```

### 4. Import in Main Project

Add to your main project's `assets/admin/index.js`:

```javascript
import 'sulu-content-types-bundle';
```

### 5. Build Admin Assets

```bash
cd assets/admin
npm install
npm run build
```

### 6. Clear Cache

```bash
bin/console cache:clear
```

---

## Usage

### NumberWithDefault

```xml
<property name="refresh_interval" type="number_with_default">
    <meta>
        <title lang="en">Refresh Interval (ms)</title>
        <title lang="de">Aktualisierungsintervall (ms)</title>
    </meta>
    <params>
        <param name="min" value="1000"/>
        <param name="max" value="30000"/>
        <param name="step" value="500"/>
        <param name="default_value" value="5000"/>
    </params>
</property>
```

**In Twig:**
```twig
<div data-refresh="{{ content.refresh_interval }}">
    <!-- Defaults to 5000 if not set -->
</div>
```

### ColorSelect

**Important:** The color is encoded in the value attribute using the format `"key:color"` (e.g., `"primary:#0d6efd"`).

```xml
<property name="button_color" type="color_select">
    <meta>
        <title lang="en">Button Color</title>
        <title lang="de">Button-Farbe</title>
    </meta>
    <params>
        <param name="values" type="collection">
            <param name="primary" value="primary:#0d6efd">
                <meta>
                    <title lang="en">Primary (Blue)</title>
                    <title lang="de">Primärfarbe (Blau)</title>
                </meta>
            </param>
            <param name="secondary" value="secondary:#6c757d">
                <meta>
                    <title lang="en">Secondary (Gray)</title>
                    <title lang="de">Sekundärfarbe (Grau)</title>
                </meta>
            </param>
            <param name="success" value="success:#198754">
                <meta>
                    <title lang="en">Success (Green)</title>
                    <title lang="de">Erfolg (Grün)</title>
                </meta>
            </param>
        </param>
    </params>
</property>
```

**In Twig:**
```twig
<button class="btn btn-{{ content.button_color }}">
    Call to Action
</button>
```

The value returned is only the key part (e.g., `"primary"`), not the full `"primary:#0d6efd"` string.

### SliderRange

The SliderRange supports multiple display modes via the `display_mode` parameter:

```xml
<!-- Classic with textbox (default) -->
<property name="opacity" type="slider_range">
    <meta>
        <title lang="en">Opacity</title>
    </meta>
    <params>
        <param name="min" value="0"/>
        <param name="max" value="100"/>
        <param name="step" value="5"/>
        <param name="default_value" value="50"/>
        <param name="display_mode" value="input"/>
        <param name="show_labels" value="true"/>
    </params>
</property>

<!-- Floating tooltip (recommended for narrow columns) -->
<property name="speed" type="slider_range">
    <meta>
        <title lang="en">Speed</title>
    </meta>
    <params>
        <param name="min" value="1000"/>
        <param name="max" value="10000"/>
        <param name="step" value="500"/>
        <param name="default_value" value="5000"/>
        <param name="display_mode" value="floating"/>
        <param name="show_labels" value="false"/>
    </params>
</property>
```

**In Twig:**
```twig
<div class="banner-slider" data-speed="{{ content.speed }}">
    <!-- Slider with 5000ms default rotation -->
</div>
```

---

## Parameters

### NumberWithDefault

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `min` | number | Minimum value | `0` |
| `max` | number | Maximum value | `100` |
| `step` | number | Step increment | `1` |
| `multiple_of` | number | Value must be multiple of | `5` |
| `default_value` | number | Default value | `10` |

### ColorSelect

| Parameter | Type | Description |
|-----------|------|-------------|
| `values` | collection | Array of color options |
| `values.*` | value attribute | Key and color in format `"key:color"` |
| `values.*.meta.title` | string | Translatable display name (optional) |

**Value Format:** `"key:#hexcolor"` (e.g., `"primary:#0d6efd"`)

**XML Structure:**
```xml
<param name="values" type="collection">
    <param name="primary" value="primary:#0d6efd">
        <meta><title lang="en">Primary</title></meta>
    </param>
</param>
```

### SliderRange

| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `min` | number | Minimum value | `0` | `0` |
| `max` | number | Maximum value | `100` | `100` |
| `step` | number | Step increment | `1` | `5` |
| `default_value` | number | Default value | `min` | `50` |
| `display_mode` | string | Display mode (see below) | `input` | `floating` |
| `show_labels` | boolean | Show min/max labels | `true` | `false` |

#### Display Modes

| Mode | Description | Best For |
|------|-------------|----------|
| `input` | Textbox next to slider with min/max labels | Full-width layouts, precise input needed |
| `floating` | Tooltip above thumb, smooth animation | Narrow columns (col-3), clean design |
| `inline` | Current value between min/max labels | Compact layouts |
| `below` | Current value centered below slider | Minimal layouts, emphasis on value |
| `none` | No value display, only slider | Ultra-minimal, visual-only control |

**Recommended Combinations:**
- 📱 Narrow columns (col-3): `display_mode="floating"` + `show_labels="false"`
- 📊 Full width: `display_mode="input"` + `show_labels="true"`
- 🎨 Minimalist: `display_mode="below"` + `show_labels="false"`

---

## Development

### Project Structure

```
SuluContentTypesBundle/
├── src/
│   ├── Content/Type/              # Content Type classes
│   ├── DependencyInjection/       # Service loading
│   └── Resources/
│       ├── config/services.xml    # Service definitions
│       ├── js/                    # React components
│       └── package.json           # JS dependencies
├── docs/                          # Public documentation
└── docs/dev/                      # Developer-only docs (not published)
```

### Running Tests

```bash
composer test
```

### Code Style

```bash
composer cs-fix
```

---

## Compatibility

- **Sulu CMS:** ^2.6
- **PHP:** ^8.1
- **Symfony:** ^5.4 || ^6.0 || ^7.0
- **React:** ^17.0.0 || ^18.0.0

### JavaScript/Flow Types

The JavaScript components use Flow type annotations (`// @flow`). This is optional for development.

See [docs/PHPSTORM_FLOW_FIX.md](docs/PHPSTORM_FLOW_FIX.md) if you get IDE warnings.

---

## Future Compatibility

This bundle is designed with Sulu 3.x compatibility in mind:
- Uses SimpleContentType without PHPCR dependencies
- No direct PHPCR write/read methods
- Future-proof architecture

---

## Documentation

- [Installation Guide](docs/INSTALLATION.md) - Step-by-step installation
- [Flow Types](docs/FLOW_TYPES.md) - Understanding Flow type annotations
- [PhpStorm Fix](docs/PHPSTORM_FLOW_FIX.md) - Fixing IDE warnings
- [Example Template](docs/example_template.xml) - Complete XML examples
- [Example Twig](docs/example.html.twig) - Twig usage examples

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This bundle is under the MIT license. See the complete license in:

[LICENSE](LICENSE)

---

## Credits

Created and maintained by [Manuxi](https://github.com/manuxi)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/manuxi/SuluContentTypesBundle/issues)
- **Discussions:** [Sulu Slack](https://sulu.io/en/community)

---

## Roadmap

Planned features for future versions:
- IconSelect (FontAwesome, Material Icons)
- PercentageSlider (with % display)
- CurrencyInput (with currency symbols)
- ColorPicker (full color picker)
- DateRangePicker
- TimeRangePicker

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.