# HxH FVTT (Custom)

Sistema de **Hunter x Hunter** para **Foundry VTT v13** (b346+). Replica la UX del sheet de Roll20 (paneles, tablas, pips) y añade tiradas en chat para **Atributos, Habilidades, Disciplinas, Salvaciones y Armas**.

> Versión actual del paquete: **v1.3.2**

## Instalación

### Opción 1 — Manifest (recomendada)
Usa esta URL (CDN) para evitar _Too many requests_ de GitHub Raw:
```
https://cdn.jsdelivr.net/gh/Mirovhan/HxH-FVTT@main/system.json
```

### Opción 2 — Manual (ZIP)
1. Descarga el ZIP desde el release correspondiente.
2. Descomprime en: `Data/systems/hxh-fvtt`  
   (La carpeta debe llamarse **exactamente** `hxh-fvtt`.)

## Compatibilidad
- **Foundry VTT**: mínimo v13 (b346); verificado en v13.
- Sin módulos obligatorios. Opcionales: `Dice So Nice`, `Chat Portrait`.

## Características
- **Hoja de personaje** con:
  - Estadísticas con **pips** y tiradas por atributo.
  - Vida/Energía (actual/total).
  - **Evasión Total** con armaduras repetibles y total calculado.
  - **Salvaciones** (Fortaleza, Reflejos, Voluntad) con tiradas.
  - **Habilidades naturales** (12) con total autocalculado + tiradas.
  - **Disciplinas** con dado por disciplina y tiradas **D/I/C**.
  - **Armas** repetibles; tirada de **precisión** y **daño** al chat.

## Uso rápido
1. Crea un **Actor → Character**.
2. Edita valores y usa los botones **🎲** / **⚔️** para tirar en el chat.

## Actualización
- Desde Foundry: **Clear Package Cache** → **Check for Updates**.
- Si instalaste manualmente, reemplaza la carpeta `Data/systems/hxh-fvtt`.

## Estructura
```
system.json
template.json
module/
  hxh-fvtt.js
  actor/
    actor.js
    sheets/character-sheet.js
templates/
  actor/character-sheet.hbs
styles/
  hxh-fvtt.css
lang/
  es.json
README.md
```

## Build / Release

### Manual
- macOS/Linux:
  ```bash
  zip -r hxh-fvtt-vX.Y.Z.zip . -x ".git/*" ".github/*" "node_modules/*"
  ```
- Windows (PowerShell):
  ```powershell
  Compress-Archive -Path * -DestinationPath hxh-fvtt-vX.Y.Z.zip -Force
  ```

### Automático (GitHub Actions)
Recomendado agregar `.github/workflows/release.yml` para empaquetar al crear un tag.

## Problemas comunes
- **Too many requests** al actualizar: usa el manifest por CDN (arriba).
- No se actualiza: verifica que el `version` online sea **mayor** que la instalada y que la carpeta sea `Data/systems/hxh-fvtt`.
- El ZIP no instala: verifica que los archivos estén en la **raíz** del ZIP.

## Licencia
MIT