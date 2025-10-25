# Installation Guide

## Schritt-für-Schritt Installation des SuluContentTypesBundle

### Voraussetzungen

- Sulu CMS 2.6+
- PHP 8.1+
- Composer
- Node.js & npm

---

## Installation

### Option 1: Via Composer (empfohlen, nach Veröffentlichung)

```bash
composer require manuxi/sulu-content-types-bundle
```

### Option 2: Lokale Installation (für Entwicklung)

1. **Bundle-Verzeichnis erstellen:**
```bash
mkdir -p packages/manuxi
cd packages/manuxi
```

2. **Bundle-Dateien kopieren:**
```bash
# Entpacke SuluContentTypesBundle.zip hier
# oder clone von GitHub:
git clone https://github.com/manuxi/SuluContentTypesBundle.git
```

3. **Composer-Repository hinzufügen:**

In der `composer.json` deines Projekts:
```json
{
    "repositories": [
        {
            "type": "path",
            "url": "packages/manuxi/SuluContentTypesBundle"
        }
    ],
    "require": {
        "manuxi/sulu-content-types-bundle": "@dev"
    }
}
```

4. **Bundle installieren:**
```bash
composer install
```

---

## Konfiguration

### 1. Bundle registrieren

In `config/bundles.php`:

```php
<?php

return [
    // ... andere Bundles
    Manuxi\SuluContentTypesBundle\ManuxiSuluContentTypesBundle::class => ['all' => true],
];
```

### 2. Admin-Assets registrieren

In `assets/admin/packages.json`:

```json
{
    "manuxi-content-types": {
        "path": "../../vendor/manuxi/sulu-content-types-bundle/src/Resources/js/containers/Form/fields",
        "main": "index.js"
    }
}
```

**Für lokale Installation:**
```json
{
    "manuxi-content-types": {
        "path": "../../packages/manuxi/SuluContentTypesBundle/src/Resources/js/containers/Form/fields",
        "main": "index.js"
    }
}
```

### 3. Assets kompilieren

```bash
cd assets/admin
npm install
npm run build
```

### 4. Symfony Cache leeren

```bash
bin/console cache:clear
```

---

## Verifizierung

### Services prüfen

```bash
bin/console debug:container | grep manuxi
```

**Erwartete Ausgabe:**
```
manuxi.sulu_content_types.content.type.number_with_default
manuxi.sulu_content_types.content.type.color_select
manuxi.sulu_content_types.content.type.slider_range
```

### Content Types prüfen

```bash
bin/console debug:container --tag=sulu.content.type | grep -A2 "number_with_default\|color_select\|slider_range"
```

---

## Erste Schritte

### 1. Template erstellen

Erstelle ein neues Template in `config/templates/pages/`:

```xml
<?xml version="1.0" ?>
<template xmlns="http://schemas.sulu.io/template/template"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://schemas.sulu.io/template/template http://schemas.sulu.io/template/template-1.0.xsd">

    <key>test_content_types</key>
    <view>pages/test</view>
    <controller>Sulu\Bundle\WebsiteBundle\Controller\DefaultController::indexAction</controller>

    <meta>
        <title lang="de">Test: Content Types</title>
        <title lang="en">Test: Content Types</title>
    </meta>

    <properties>
        <property name="title" type="text_line" mandatory="true">
            <meta>
                <title lang="de">Titel</title>
                <title lang="en">Title</title>
            </meta>
        </property>

        <!-- Test NumberWithDefault -->
        <property name="test_number" type="number_with_default">
            <meta>
                <title lang="de">Test Nummer</title>
                <title lang="en">Test Number</title>
            </meta>
            <params>
                <param name="default_value" value="42"/>
            </params>
        </property>

        <!-- Test ColorSelect -->
        <property name="test_color" type="color_select">
            <meta>
                <title lang="de">Test Farbe</title>
                <title lang="en">Test Color</title>
            </meta>
            <params>
                <param name="values" type="collection">
                    <param name="red">
                        <params>
                            <param name="name" value="Rot"/>
                            <param name="value" value="danger"/>
                            <param name="color" value="#dc3545"/>
                        </params>
                    </param>
                    <param name="blue">
                        <params>
                            <param name="name" value="Blau"/>
                            <param name="value" value="primary"/>
                            <param name="color" value="#0d6efd"/>
                        </params>
                    </param>
                </param>
            </params>
        </property>

        <!-- Test SliderRange -->
        <property name="test_slider" type="slider_range">
            <meta>
                <title lang="de">Test Slider</title>
                <title lang="en">Test Slider</title>
            </meta>
            <params>
                <param name="min" value="0"/>
                <param name="max" value="100"/>
                <param name="default_value" value="50"/>
            </params>
        </property>
    </properties>
</template>
```

### 2. Twig-Template erstellen

Erstelle `templates/pages/test.html.twig`:

```twig
{% extends "base.html.twig" %}

{% block content %}
    <h1>{{ content.title }}</h1>
    
    <div class="test-results">
        <p>Number: {{ content.test_number }}</p>
        <p>Color: <span class="badge bg-{{ content.test_color }}">{{ content.test_color }}</span></p>
        <p>Slider: {{ content.test_slider }}%</p>
    </div>
{% endblock %}
```

### 3. Seite erstellen

1. Gehe zu Sulu Admin (`/admin`)
2. Erstelle eine neue Seite
3. Wähle Template "Test: Content Types"
4. Teste die Content Types!

---

## Troubleshooting

### Problem: "Content type not found"

**Lösung:**
```bash
bin/console cache:clear
bin/console debug:container | grep content.type
```

### Problem: JavaScript-Fehler in Admin

**Lösung:**
```bash
cd assets/admin
npm run build
bin/console cache:clear
```

Öffne Browser-Console (F12) und prüfe auf Fehler.

### Problem: "Service not found"

**Lösung:**

1. Prüfe `config/bundles.php` - Bundle registriert?
2. Prüfe Namespace in PHP-Dateien
3. `composer dump-autoload`
4. Cache leeren

### Problem: Assets werden nicht geladen

**Lösung:**

1. Prüfe `assets/admin/packages.json` - Pfad korrekt?
2. `npm install` in `assets/admin`
3. `npm run build`
4. Browser-Cache leeren (Ctrl+Shift+R)

---

## Deinstallation

### 1. Bundle aus bundles.php entfernen

### 2. packages.json bereinigen

Entferne den `manuxi-content-types` Eintrag.

### 3. Assets neu kompilieren

```bash
cd assets/admin
npm run build
```

### 4. Composer

```bash
composer remove manuxi/sulu-content-types-bundle
```

### 5. Cache leeren

```bash
bin/console cache:clear
```

---

## Support

- **GitHub Issues:** https://github.com/manuxi/SuluContentTypesBundle/issues
- **Sulu Slack:** https://sulu.io/en/community
- **Documentation:** Siehe README.md

---

## Nächste Schritte

- Siehe [README.md](../README.md) für ausführliche Dokumentation
- Siehe [docs/example_template.xml](example_template.xml) für mehr Beispiele
- Siehe [docs/example.html.twig](example.html.twig) für Twig-Verwendung
