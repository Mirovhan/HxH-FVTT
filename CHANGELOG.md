# Changelog

## v1.0.1
- Compatibilidad **Foundry v13 (b346)** verificada.
- `system.json`: minimum/verified=13, maximum=14, coreVersion=13.
- Eliminado `Actors.unregisterSheet("core", ActorSheet)`.
- Hardened `prepareDerivedData()` con `this.system ?? {}`.

## v1.0.0
- MVP inicial (Stats, Salvaciones, Disciplinas D/I/C, Armas, Vida/Energía).