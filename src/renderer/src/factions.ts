export function slug(name: string): string {
  return name.toLowerCase().replace(/ /g, '_').replace(/'/g, '').replace(/-/g, '_')
}

export const FACTIONS: Record<string, Record<string, string[]>> = {
  'The Hex': {
    Eleanor: [
      'Primary Crux', 'Melee Doughty', 'Arcane Camisado',
      'Arcane Impetus', 'Arcane Truculence', 'Arcane Bellicose',
      'Secondary Enervate', 'Arcane Crepuscular',
    ],
  },
  'Steel Meridian': {
    'Steel Meridian': [
      'Scattered Justice', 'Justice Blades', 'Neutralizing Justice',
      'Shattering Justice', 'Path of Statues', 'Tectonic Fracture',
      'Ore Gaze', 'Titanic Rumbler', 'Rubble Heap', 'Prismatic Companion',
      'Recrystalize', 'Fireball Frenzy', 'Immolated Radiance',
      'Healing Flame', 'Exothermic', 'Surging Dash', 'Radiant Finish',
      'Furious Javelin', 'Chromatic Blade', 'Freeze Force',
    ],
  },
  'Arbiters of Hexis': {
    'Arbiters of Hexis': [
      'Gilded Truth', 'Blade of Truth', 'Avenging Truth', 'Stinging Truth',
      'Seeking Shuriken', 'Smoke Shadow', 'Teleport Rush', 'Rising Storm',
      'Elusive Retribution', 'Endless Lullaby', 'Reactive Storm', 'Duality',
      'Calm and Frenzy', 'Peaceful Provocation', 'Energy Transfer',
    ],
  },
  'Cephalon Suda': {
    'Cephalon Suda': [
      'Entropy Spike', 'Entropy Flight', 'Entropy Detonation', 'Entropy Burst',
      'Sonic Fracture', 'Resonance', 'Savage Silence', 'Resonating Quake',
      'Razor Mortar', 'Afterburn', 'Everlasting Ward', 'Vexing Retaliation',
      'Guardian Armor', 'Guided Effigy', 'Freeze Force',
    ],
  },
  'Red Veil': {
    'Red Veil': [
      'Gleaming Blight', 'Eroding Blight', 'Stockpiled Blight', 'Toxic Blight',
      'Seeking Shuriken', 'Smoke Shadow', 'Teleport Rush', 'Rising Storm',
      'Path of Statues', 'Tectonic Fracture', 'Ore Gaze', 'Titanic Rumbler',
    ],
  },
  'Cephalon Simaris': {
    'Cephalon Simaris': [
      'Looter', 'Detect Vulnerability', 'Reawaken', 'Negate', 'Ambush',
      'Astral Autopsy', 'Health Conversion', 'Energy Conversion',
      'Botanist', 'Energy Generator',
    ],
  },
  'Ostron': {
    Hok: [
      'Exodia Brave', 'Exodia Valor', 'Exodia Force', 'Exodia Hunt',
      'Exodia Triumph', 'Exodia Might',
    ],
    'Master Teasonai': [
      'Restorative Bond', 'Manifold Bond', 'Covert Bond',
      'Mystic Bond', 'Tandem Bond',
    ],
  },
  'The Quills': {
    'The Quills': [
      'Magus Vigor', 'Virtuos Null', 'Magus Husk', 'Virtuos Tempo',
      'Virtuos Fury', 'Magus Cloud', 'Virtuos Strike', 'Magus Cadence',
      'Magus Replenish', 'Virtuos Shadow', 'Virtuos Ghost',
    ],
  },
  'Solaris United': {
    'Rude Zuud': [
      'Pax Soar', 'Pax Charge', 'Pax Bolt', 'Pax Seeker',
      'Reinforced Bond', 'Aerial Bond', 'Momentous Bond',
      'Tenacious Bond', 'Astral Bond',
    ],
  },
  'Vox Solaris': {
    'Vox Solaris': [
      'Virtuos Surge', 'Virtuos Spike', 'Virtuos Forge', 'Virtuos Trojan',
      'Magus Anomaly', 'Magus Destruct', 'Magus Lockdown', 'Magus Firewall',
      'Magus Drive', 'Magus Repair', 'Magus Melt', 'Magus Overload',
    ],
  },
  'Entrati': {
    Father: ['Damzav Vati', 'Zazvat Kar', 'Bhisaj Bal', 'Hata Satya'],
    Son: [
      'Vicious Bond', 'Seismic Bond', 'Contagious Bond',
      'Duplex Bond', 'Martyr Symbiosis', 'Volatile Parasite',
    ],
  },
  'Necraloid': {
    Necraloid: [
      'Necramech Vitality', 'Necramech Refuel', 'Necramech Intensify',
      'Necramech Pressure', 'Necramech Efficiency', 'Necramech Drift',
      'Necramech Friction', 'Necramech Flow', 'Ayatan Kitha Sculpture',
    ],
  },
  "Kahl's Garrison": {
    Chipper: [
      'Archon Continuity', 'Archon Stretch', 'Archon Intensify',
      'Archon Vitality', 'Archon Flow',
    ],
  },
  'Nightwave': {
    Nightwave: [
      'Clip Legation', 'Corrosive Projection', 'Critical Precision',
      'Dead Eye', 'Deadly Maneuvers', 'Deceptive Bond', 'Dizzying Rounds',
      'Energy Siphon', 'Loot Detector', 'Photon Overcharge', 'Prism Guard',
      'Range Advantage', 'Rifle Amp', 'Sprint Boost', 'Steel Charge',
    ],
  },
}