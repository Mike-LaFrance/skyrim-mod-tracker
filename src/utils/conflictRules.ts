// Skyrim SE Load Order Conflict & Diagnostics Rule Engine
import { SkyrimMod, ConflictIssue } from '../types';

export function evaluateLoadOrderConflicts(mods: SkyrimMod[]): ConflictIssue[] {
  const issues: ConflictIssue[] = [];
  const activeMods = mods.filter((m) => m.status === 'active').sort((a, b) => a.priority - b.priority);

  if (activeMods.length === 0) return issues;

  // 1. Check Duplicate Priority Numbers
  const priorityMap = new Map<number, SkyrimMod[]>();
  mods.forEach((m) => {
    const list = priorityMap.get(m.priority) || [];
    list.push(m);
    priorityMap.set(m.priority, list);
  });

  priorityMap.forEach((conflictList, priority) => {
    if (conflictList.length > 1) {
      conflictList.forEach((mod) => {
        issues.push({
          id: `dup-priority-${mod.id}`,
          ruleId: 'DUPLICATE_PRIORITY',
          modId: mod.id,
          modName: mod.name,
          title: 'Duplicate Load Order Priority',
          message: `Mod shares priority index #${String(priority).padStart(4, '0')} with ${conflictList.filter((m) => m.id !== mod.id).map((m) => `"${m.name}"`).join(', ')}.`,
          severity: 'warning',
          recommendation: 'Click "Clean Renumber" in the header to re-index all mods sequentially without duplicates.',
        });
      });
    }
  });

  // 2. Official DLC Masters Placement (Dawnguard, HearthFires, Dragonborn)
  const dlcDawnguard = activeMods.find((m) => m.name.toLowerCase().includes('dawnguard'));
  const dlcHearthfires = activeMods.find((m) => m.name.toLowerCase().includes('hearthfires'));
  const dlcDragonborn = activeMods.find((m) => m.name.toLowerCase().includes('dragonborn'));

  if (dlcDawnguard && dlcDawnguard.priority > 5) {
    issues.push({
      id: `dlc-dawnguard-pos-${dlcDawnguard.id}`,
      ruleId: 'OFFICIAL_DLC_ORDER',
      modId: dlcDawnguard.id,
      modName: dlcDawnguard.name,
      title: 'Official Master DLC Loaded Late',
      message: `DLC: Dawnguard is priority #${String(dlcDawnguard.priority).padStart(4, '0')}. Official Bethesda masters should always load first.`,
      severity: 'critical',
      recommendation: 'Move DLC: Dawnguard to priority #0000 at the top of your load order.',
      suggestedAction: 'move_up',
    });
  }

  if (dlcHearthfires && dlcDawnguard && dlcHearthfires.priority < dlcDawnguard.priority) {
    issues.push({
      id: `dlc-hearthfires-order-${dlcHearthfires.id}`,
      ruleId: 'OFFICIAL_DLC_ORDER',
      modId: dlcHearthfires.id,
      modName: dlcHearthfires.name,
      title: 'Official DLC Sequence Inverted',
      message: `DLC: HearthFires is loading before DLC: Dawnguard. Official sequence is Dawnguard -> HearthFires -> Dragonborn.`,
      severity: 'warning',
      recommendation: 'Order official DLCs: Dawnguard (#0000), HearthFires (#0001), Dragonborn (#0002).',
      suggestedAction: 'move_down',
    });
  }

  if (dlcDragonborn && dlcDawnguard && dlcDragonborn.priority < dlcDawnguard.priority) {
    issues.push({
      id: `dlc-dragonborn-order-${dlcDragonborn.id}`,
      ruleId: 'OFFICIAL_DLC_ORDER',
      modId: dlcDragonborn.id,
      modName: dlcDragonborn.name,
      title: 'Official DLC Sequence Inverted',
      message: `DLC: Dragonborn is loading before DLC: Dawnguard. Official sequence is Dawnguard -> HearthFires -> Dragonborn.`,
      severity: 'warning',
      recommendation: 'Order official DLCs: Dawnguard (#0000), HearthFires (#0001), Dragonborn (#0002).',
      suggestedAction: 'move_down',
    });
  }

  // 3. Alternate Start Placement (Should be near the bottom of the load order)
  const alternateStart = activeMods.find((m) =>
    m.name.toLowerCase().includes('alternate start') || m.name.toLowerCase().includes('live another life')
  );

  if (alternateStart) {
    const totalActive = activeMods.length;
    const activeIndex = activeMods.findIndex((m) => m.id === alternateStart.id);
    // If Alternate Start is before 75% of the active mod list
    if (activeIndex < Math.floor(totalActive * 0.7) && totalActive > 10) {
      issues.push({
        id: `alt-start-placement-${alternateStart.id}`,
        ruleId: 'ALTERNATE_START_PLACEMENT',
        modId: alternateStart.id,
        modName: alternateStart.name,
        title: 'Alternate Start Loaded Too Early',
        message: `"${alternateStart.name}" is positioned at index ${activeIndex + 1} of ${totalActive}. It must load near the very bottom to avoid quest and cell overwrite conflicts.`,
        severity: 'warning',
        recommendation: 'Move Alternate Start down near the end of your load order (only Lux, specialized patches, or water shaders should load after it).',
        suggestedAction: 'move_down',
      });
    }
  }

  // 4. Lighting vs Weather Order (e.g. Lux should load after Cathedral Weathers)
  const luxMod = activeMods.find((m) => m.name.toLowerCase().startsWith('lux') && !m.name.toLowerCase().includes('via'));
  const weatherMod = activeMods.find((m) => m.name.toLowerCase().includes('weather') || m.name.toLowerCase().includes('cathedral weathers'));

  if (luxMod && weatherMod && luxMod.priority < weatherMod.priority) {
    issues.push({
      id: `lux-weather-conflict-${luxMod.id}`,
      ruleId: 'LIGHTING_WEATHER_ORDER',
      modId: luxMod.id,
      modName: luxMod.name,
      title: 'Lighting Overhaul Loaded Before Weather Mod',
      message: `"${luxMod.name}" (priority #${String(luxMod.priority).padStart(4, '0')}) loads before "${weatherMod.name}" (priority #${String(weatherMod.priority).padStart(4, '0')}). Weather mods will overwrite interior lighting templates.`,
      severity: 'warning',
      recommendation: `Move "${luxMod.name}" below "${weatherMod.name}" so interior lighting templates take precedence.`,
      suggestedAction: 'move_down',
    });
  }

  // 5. Address Library for SKSE Plugins Dependency
  const addressLibrary = activeMods.find((m) => m.name.toLowerCase().includes('address library'));
  const skseMods = activeMods.filter((m) => m.pluginType === 'SKSE Plugin' && !m.name.toLowerCase().includes('address library'));

  if (skseMods.length > 0 && !addressLibrary) {
    const disabledAddressLibrary = mods.find((m) => m.status === 'disabled' && m.name.toLowerCase().includes('address library'));
    skseMods.slice(0, 3).forEach((mod) => {
      issues.push({
        id: `address-library-missing-${mod.id}`,
        ruleId: 'ADDRESS_LIBRARY_DEPENDENCY',
        modId: mod.id,
        modName: mod.name,
        title: 'Missing SKSE Core Dependency',
        message: `"${mod.name}" is an SKSE .dll plugin, but "Address Library for SKSE Plugins" is ${disabledAddressLibrary ? 'disabled' : 'not detected'}. The game will crash on launch without it.`,
        severity: 'critical',
        recommendation: 'Enable "Address Library for SKSE Plugins" and place it before any SKSE plugins.',
        suggestedAction: 'enable_dependency',
      });
    });
  } else if (addressLibrary && skseMods.length > 0) {
    // Check if any SKSE mod loads BEFORE Address Library
    const earlySKSE = skseMods.filter((m) => m.priority < addressLibrary.priority);
    earlySKSE.forEach((mod) => {
      issues.push({
        id: `address-library-order-${mod.id}`,
        ruleId: 'ADDRESS_LIBRARY_ORDER',
        modId: mod.id,
        modName: mod.name,
        title: 'SKSE Plugin Loaded Before Address Library',
        message: `"${mod.name}" (priority #${String(mod.priority).padStart(4, '0')}) loads before "Address Library" (priority #${String(addressLibrary.priority).padStart(4, '0')}).`,
        severity: 'warning',
        recommendation: 'Move Address Library above all SKSE .dll plugins in your load order.',
        suggestedAction: 'move_down',
      });
    });
  }

  // 6. SkyUI Requirement for Modern UI Frameworks
  const skyUi = activeMods.find((m) => m.name.toLowerCase() === 'skyui' || m.name.toLowerCase().startsWith('skyui '));
  const uiAddons = activeMods.filter((m) => {
    const n = m.name.toLowerCase();
    return (n.includes('truehud') || n.includes('morehud') || n.includes('mcm helper')) && m.id !== skyUi?.id;
  });

  if (uiAddons.length > 0 && !skyUi) {
    uiAddons.forEach((mod) => {
      issues.push({
        id: `skyui-missing-${mod.id}`,
        ruleId: 'SKYUI_REQUIREMENT',
        modId: mod.id,
        modName: mod.name,
        title: 'SkyUI Required for MCM & HUD Overhauls',
        message: `"${mod.name}" requires SkyUI for MCM configuration menus and SWF HUD hooks.`,
        severity: 'critical',
        recommendation: 'Ensure SkyUI SE is active in your load order.',
        suggestedAction: 'enable_dependency',
      });
    });
  }

  // 7. CACO & Ordinator Perk Compatibility Advisory
  const cacoMod = activeMods.find((m) => m.name.toLowerCase().includes('complete alchemy') || m.name.toLowerCase().includes('caco'));
  const ordinatorMod = activeMods.find((m) => m.name.toLowerCase().includes('ordinator'));

  if (cacoMod && ordinatorMod) {
    const hasPatchNote = (cacoMod.notes + ordinatorMod.notes).toLowerCase().includes('patch');
    if (!hasPatchNote) {
      issues.push({
        id: `caco-ordinator-advisory-${cacoMod.id}`,
        ruleId: 'CACO_ORDINATOR_PATCH',
        modId: cacoMod.id,
        modName: cacoMod.name,
        title: 'Perk Tree Patch Advisory: CACO + Ordinator',
        message: `Both "${cacoMod.name}" and "${ordinatorMod.name}" modify the Alchemy perk tree. An official compatibility patch is recommended.`,
        severity: 'advisory',
        recommendation: 'Download the "CACO - Ordinator Patch" from Nexus Mods to merge alchemy perk changes cleanly.',
      });
    }
  }

  return issues;
}
