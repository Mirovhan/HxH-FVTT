# Hunter × Hunter TTRPG (1.8B) — Foundry VTT v13

Sistema para jugar **Hunter × Hunter 1.8B** en **Foundry VTT v13** (Sheets V2).
Incluye hoja de personaje, tiradas configurables (**d20** o **d100**), y **Hatsus** con control de **PC**.

## Manifest (instalación)
```
https://raw.githubusercontent.com/Mirovhan/HxH-RPG/main/system.json
```
> Requiere Foundry **v13**. Para 12.x usa una versión anterior.

## Uso rápido
- **Modo de Tirada:** *Configure Settings → System Settings* → d20 o d100.
- **PC Totales:** por defecto = **Nivel + INT + floor(PER/2)**.
- **Hatsus:** crea un Item *Hatsu*, define **Coste Base (PC)** y **Modificadores**, y actívalo desde la hoja del PJ.

## Estructura
```
.
├─ system.json
├─ template.json
├─ system/
│  ├─ system.js
│  ├─ hxh-actor.js
│  ├─ hxh-item.js
│  ├─ actor-sheet.js
│  └─ item-sheet.js
├─ templates/
│  └─ sheets/
│     ├─ actor/character-sheet.hbs
│     └─ item/hatsu-sheet.hbs
├─ styles/system.css
└─ lang/
   ├─ es.json
   └─ en.json
```

## Licencia
El **código** del sistema está bajo **MIT** (ver `LICENSE`).  
El **contenido del manual 1.8B** no está incluido y mantiene sus derechos.
