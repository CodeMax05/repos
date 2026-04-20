export const DRAGON_CLASSES = [
  {
    value: 'strike',
    label: 'Strike Class',
    description: 'Lightning fast with incredible speed',
    imageURL: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0d4a8dbf-84c1-46f3-b740-e10dd863774f/d5hwjkz-38ba9559-465e-462a-8bd5-ab8c6eba16d5.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi8wZDRhOGRiZi04NGMxLTQ2ZjMtYjc0MC1lMTBkZDg2Mzc3NGYvZDVod2prei0zOGJhOTU1OS00NjVlLTQ2MmEtOGJkNS1hYjhjNmViYTE2ZDUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.n9urSbet2mLdv09VHitr3bPTlz_qyavZEz54ZXwmACU'
  },
  {
    value: 'sharp',
    label: 'Sharp Class',
    description: 'Deadly precision and razor-sharp',
    imageURL: 'https://www.clipartmax.com/png/full/250-2505514_sharp-class-symbol-by-xelku9-how-to-train-your-dragon-dragon-class.png'
  },
  {
    value: 'boulder',
    label: 'Boulder Class',
    description: 'Tough as stone with rock-hard skin',
    imageURL: 'https://www.nicepng.com/png/full/204-2042408_boulder-class-symbol-by-xelku9-d5hwini-train-your.png'
  },
  {
    value: 'stoker',
    label: 'Stoker Class',
    description: 'Master of fire with hottest flames',
    imageURL: 'https://httyddragons.weebly.com/uploads/4/2/4/5/42457497/1709771.png?250'
  }
];

export const DRAGON_CLASS_INFO = {
  strike: {
    label: 'Strike Class',
    color: 'strike',
    description: 'Lightning fast with incredible speed and blazing firepower'
  },
  sharp: {
    label: 'Sharp Class',
    color: 'sharp',
    description: 'Deadly precision and razor-sharp spines'
  },
  boulder: {
    label: 'Boulder Class',
    color: 'boulder',
    description: 'Tough as stone with rock-hard skin'
  },
  stoker: {
    label: 'Stoker Class',
    color: 'stoker',
    description: 'Master of fire with the hottest flames'
  }
};

export const CLASS_TRAITS = {
  strike: ['Incredible speed', 'Blazing firepower', 'Stealth abilities', 'High intelligence'],
  sharp: ['Deadly precision', 'Razor-sharp spines', 'Agile movements', 'Piercing screams'],
  boulder: ['Rock-hard skin', 'Projectile attacks', 'Immense strength', 'Earth manipulation'],
  stoker: ['Hottest flames', 'Fire resistance', 'Self-ignition', 'Intense determination']
};

export const getDragonClassImage = (dragonClass) => {
  const cls = DRAGON_CLASSES.find(c => c.value === dragonClass);
  return cls ? cls.imageURL : '';
};
