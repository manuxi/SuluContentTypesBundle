# Sulu Content Types Bundle

Custom Content Types für Sulu CMS 2.6+

[![License](https://img.shields.io/github/license/manuxi/SuluContentTypesBundle)](https://github.com/manuxi/SuluContentTypesBundle/blob/main/LICENSE)
[![Sulu Version](https://img.shields.io/badge/Sulu-%5E2.6-blue)](https://sulu.io/)
[![PHP Version](https://img.shields.io/badge/PHP-%5E8.1-purple)](https://php.net/)

**Deutsche Version** | [English Version](README.md)

---

## Features

Dieses Bundle bietet drei Custom Content Types für Sulu CMS:

### 1. 🔢 NumberWithDefault
Nummern-Eingabefeld mit Default-Wert-Unterstützung. Erweitert den Standard `number` Typ um einen `default_value` Parameter.

**Anwendungsfälle:**
- Aktualisierungsintervalle
- Timeouts
- Zähler mit Standardwerten

### 2. 🎨 ColorSelect
Auswahlfeld mit Farbvorschau. Perfekt für Bootstrap-Farbklassen oder beliebige farbcodierte Optionen.

**Anwendungsfälle:**
- Button-Farben
- Badge-Farben
- Theme-Farbauswahl

### 3. 🎚️ SliderRange
Visueller Range-Slider mit Nummern-Eingabe. Konfigurierbare min/max/step/default Werte.

**Anwendungsfälle:**
- Banner-Rotationsgeschwindigkeiten
- Deckkraft/Transparenz
- Prioritätsstufen

---

## Installation

### 1. Installation via Composer

```bash
composer require manuxi/sulu-content-types-bundle
```

### 2. Bundle aktivieren

Füge das Bundle zu `config/bundles.php` hinzu:

```php
<?php

return [
    // ...
    Manuxi\SuluContentTypesBundle\ManuxiSuluContentTypesBundle::class => ['all' => true],
];
```

### 3. Admin-Assets registrieren

Füge zu `assets/admin/packages.json` hinzu:

```json
{
    "sulu-content-types-bundle": "file:../../vendor/manuxi/sulu-content-types-bundle/src/Resources"
}
```

### 4. Admin-Assets kompilieren

```bash
cd assets/admin
npm install
npm run build
```

### 5. Cache leeren

```bash
bin/console cache:clear
```

---

## Verwendung

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
    <!-- Standard: 5000, wenn nicht gesetzt -->
</div>
```

### ColorSelect (mit übersetzbaren Labels)

```xml
<property name="button_color" type="color_select">
    <meta>
        <title lang="en">Button Color</title>
        <title lang="de">Button-Farbe</title>
    </meta>
    <params>
        <param name="values" type="collection">
            <param name="primary" value="primary">
                <meta>
                    <title lang="en">Primary (Blue)</title>
                    <title lang="de">Primärfarbe (Blau)</title>
                </meta>
                <param name="color" value="#0d6efd"/>
            </param>
            <param name="success" value="success">
                <meta>
                    <title lang="en">Success (Green)</title>
                    <title lang="de">Erfolg (Grün)</title>
                </meta>
                <param name="color" value="#198754"/>
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

### SliderRange

```xml
<property name="banner_speed" type="slider_range">
    <meta>
        <title lang="en">Banner Rotation Speed (ms)</title>
        <title lang="de">Banner-Rotationsgeschwindigkeit (ms)</title>
    </meta>
    <params>
        <param name="min" value="1000"/>
        <param name="max" value="10000"/>
        <param name="step" value="500"/>
        <param name="default_value" value="5000"/>
    </params>
</property>
```

**In Twig:**
```twig
<div class="banner-slider" data-speed="{{ content.banner_speed }}">
    <!-- Slider mit 5000ms Standard-Rotation -->
</div>
```

---

## Parameter

### NumberWithDefault

| Parameter | Typ | Beschreibung | Beispiel |
|-----------|-----|--------------|----------|
| `min` | number | Minimalwert | `0` |
| `max` | number | Maximalwert | `100` |
| `step` | number | Schrittweite | `1` |
| `multiple_of` | number | Wert muss Vielfaches von | `5` |
| `default_value` | number | Standardwert | `10` |

### ColorSelect

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `values` | collection | Array von Farboptionen (benannte Keys erlaubt) |
| `values.*` | value-Attribut | Technischer Wert für diese Option |
| `values.*.meta.title` | string | Übersetzbarer Anzeigename |
| `values.*.color` | param | Hex-Farbcode |

**XML-Struktur:**
```xml
<param name="values" type="collection">
    <param name="primary" value="primary">
        <meta><title lang="de">Primärfarbe</title></meta>
        <param name="color" value="#0d6efd"/>
    </param>
</param>
```

### SliderRange

| Parameter | Typ | Beschreibung | Beispiel |
|-----------|-----|--------------|----------|
| `min` | number | Minimalwert | `0` |
| `max` | number | Maximalwert | `100` |
| `step` | number | Schrittweite | `5` |
| `default_value` | number | Standardwert | `50` |

---

## Entwicklung

### Projektstruktur

```
SuluContentTypesBundle/
├── src/
│   ├── Content/Type/              # Content Type Klassen
│   ├── DependencyInjection/       # Service-Laden
│   └── Resources/
│       ├── config/services.xml    # Service-Definitionen
│       ├── js/                    # React-Komponenten
│       └── package.json           # JS-Abhängigkeiten
└── docs/                          # Dokumentation
```

### Tests ausführen

```bash
composer test
```

### Code Style

```bash
composer cs-fix
```

---

## Kompatibilität

- **Sulu CMS:** ^2.6
- **PHP:** ^8.1
- **Symfony:** ^5.4 || ^6.0 || ^7.0
- **React:** ^17.0.0 || ^18.0.0

### JavaScript/Flow Types

Die JavaScript-Komponenten verwenden Flow Type Annotations (`// @flow`). Dies ist optional für die Entwicklung.

Siehe [docs/PHPSTORM_FLOW_FIX.md](docs/dev/PHPSTORM_FLOW_FIX.md) bei IDE-Warnungen.

---

## Zukunftskompatibilität

Dieses Bundle ist mit Blick auf Sulu 3.x-Kompatibilität entwickelt:
- Verwendet SimpleContentType ohne PHPCR-Abhängigkeiten
- Keine direkten PHPCR write/read Methoden
- Zukunftssichere Architektur

---

## Dokumentation

- [Installationsanleitung](docs/INSTALLATION.md) - Schritt-für-Schritt Installation
- [Flow Types](docs/dev/FLOW_TYPES.md) - Flow Type Annotations verstehen
- [PhpStorm Fix](docs/dev/PHPSTORM_FLOW_FIX.md) - IDE-Warnungen beheben
- [Beispiel-Template](docs/example_template.xml) - Vollständige XML-Beispiele
- [Beispiel Twig](docs/example.html.twig) - Twig-Verwendungsbeispiele

---

## Mitwirken

Beiträge sind willkommen! Bitte zögere nicht, einen Pull Request einzureichen.

---

## Lizenz

Dieses Bundle steht unter der MIT-Lizenz. Siehe die vollständige Lizenz in:

[LICENSE](LICENSE)

---

## Credits

Erstellt und gewartet von [Manuxi](https://github.com/manuxi)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/manuxi/SuluContentTypesBundle/issues)
- **Diskussionen:** [Sulu Slack](https://sulu.io/en/community)

---

## Roadmap

Geplante Features für zukünftige Versionen:
- IconSelect (FontAwesome, Material Icons)
- PercentageSlider (mit %-Anzeige)
- CurrencyInput (mit Währungssymbolen)
- ColorPicker (vollständiger Color-Picker)
- DateRangePicker
- TimeRangePicker

---

## Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für die Versionshistorie.