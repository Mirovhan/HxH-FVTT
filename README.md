# HxH FVTT (Custom System)

Sistema liviano para **Foundry VTT** inspirado en una hoja anterior de Roll20, portado y simplificado para FVTT.

> 🧪 Estado: MVP funcional (Stats, Salvaciones, Disciplinas con tiradas D/I/C, Armas con ataque y daño, Vida/Energía).

## Instalación (Dev local)

1. Clona este repo en cualquier carpeta.
2. Copia la carpeta `hxh-fvtt/` a tu **user data** de Foundry:
   - Windows: `%LOCALAPPDATA%/FoundryVTT/Data/systems/`
   - macOS: `~/Library/Application Support/FoundryVTT/Data/systems/`
   - Linux: `~/.local/share/FoundryVTT/Data/systems/`
3. Reinicia Foundry y selecciona el sistema **HxH FVTT (Custom)** al crear el Mundo.

### Módulos recomendados
- **libWrapper** (requerido para enganchar limpio).
- **socketlib** (si usas tiradas con lógica del GM).
- **Dice So Nice**, **Drag Ruler** (UX).

## Estructura
- `system.json` — manifiesto del sistema.
- `template.json` — modelo de datos del Actor.
- `module/` — JS del sistema (Actor, Sheet y helpers).
- `templates/` — Handlebars de la hoja.
- `styles/` — CSS.
- `lang/` — i18n.

## Roadmap
- Habilidades Naturales (contador de rangos + validador).
- Validador de Talentos/Dotes por nivel y requisitos de stats (UI con mensajes).
- Compendios de ejemplo.
- PowerCards-style en el chat (plantillas bonitas).

## Licencia
MIT — ver `LICENSE`.