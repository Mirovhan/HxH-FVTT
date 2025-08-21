# Hunter × Hunter TTRPG (1.8B) — Foundry VTT System

Sistema para jugar **Hunter × Hunter RPG (edición 1.8B)** en **Foundry VTT** (serie 12.x).  
Incluye hoja de personaje, tiradas configurables (**d20 aditivo** o **d100 por debajo**), y gestión de **Hatsus** con **PC**.

> ⚠️ Este repo contiene **código del sistema**. No incluye contenido del manual 1.8B.
> Asegúrate de respetar los derechos de autor de la obra original.

---

## Instalación (Molten Hosting / Foundry VTT)

**Manifest URL (recomendado):**  
```
https://raw.githubusercontent.com/Mirovhan/HxH-RPG/main/system.json
```

Pasos:
1. Ve a **Manage → Systems → Install System** en Foundry/Molten.
2. Pega la URL del manifest (arriba) y confirma.
3. Crea un mundo nuevo usando **Hunter × Hunter TTRPG (1.8B)**.

> Requiere Foundry VTT **12.x** (min. 12.0). Probado contra 12.331.

---

## Publicar una versión (release)

1. Empaqueta el sistema en un zip llamado **`hxh-1-8b.zip`** con el **contenido del repo**.
2. Crea un **Release** en GitHub con tag `v0.2.0` (o la que corresponda).
3. Adjunta el archivo `hxh-1-8b.zip` al release.
4. El `system.json` ya apunta a `releases/latest`:
   - **Download:** `https://github.com/Mirovhan/HxH-RPG/releases/latest/download/hxh-1-8b.zip`

> Si cambias el nombre del zip o la versión, ajusta también `system.json`.

---

## Estructura

```
.
├─ system.json
├─ template.json
├─ styles/
├─ system/
├─ templates/
├─ lang/
└─ LICENSE
```

- `system/system.js`: registro del sistema y helpers.
- `system/hxh-actor.js`: cálculo de **PC** y derivados.
- `system/actor-sheet.js`: hoja de personaje, tiradas y **toggle de Hatsus**.
- `templates/sheets/item/hatsu-sheet.hbs`: editor de Hatsu con **coste base + modificadores**.
- `lang/es.json`: textos en español.

---

## Configuración rápida

- **Modo de Tirada**: *Configure Settings → System Settings* → d20 o d100.
- **PC Totales**: por defecto = **Nivel + INT + floor(PER/2)** (ajustable en código).
- **Hatsus**: crear Item *Hatsu*, definir **Coste Base (PC)** y **Modificadores**. Activar desde la hoja.
  El sistema valida **PC usados** ≤ **PC totales** y anuncia al chat.

---

## Licencia

El **código** del sistema está bajo **MIT** (ver `LICENSE`).  
El **contenido del manual 1.8B** no está incluido y mantiene sus respectivos derechos.
