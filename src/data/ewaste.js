export const EWASTE_CATEGORIES = [
  { id: 'mobile-phone', name: 'Mobile Phone', icon: '📱', keywords: ['cell phone', 'mobile phone', 'smartphone', 'iphone', 'android', 'telephone'] },
  { id: 'laptop', name: 'Laptop', icon: '💻', keywords: ['laptop', 'notebook', 'macbook', 'ultrabook', 'computer'] },
  { id: 'tablet', name: 'Tablet', icon: '📟', keywords: ['tablet', 'ipad', 'tablet computer'] },
  { id: 'monitor', name: 'Monitor', icon: '🖥️', keywords: ['monitor', 'display', 'screen', 'lcd', 'led monitor'] },
  { id: 'keyboard', name: 'Keyboard', icon: '⌨️', keywords: ['keyboard', 'mechanical keyboard', 'wireless keyboard'] },
  { id: 'mouse', name: 'Mouse', icon: '🖱️', keywords: ['mouse', 'computer mouse', 'wireless mouse', 'trackpad'] },
  { id: 'charger', name: 'Charger', icon: '🔌', keywords: ['charger', 'power adapter', 'ac adapter', 'power brick', 'charging cable'] },
  { id: 'cable', name: 'Cable', icon: '🔗', keywords: ['cable', 'cord', 'wire', 'usb cable', 'hdmi cable', 'power cord'] },
  { id: 'earphones', name: 'Earphones', icon: '🎧', keywords: ['earphones', 'earbuds', 'headphones', 'airpods', 'headset'] },
  { id: 'headphones', name: 'Headphones', icon: '🎧', keywords: ['headphones', 'over-ear headphones', 'wireless headphones', 'gaming headset'] },
  { id: 'printer', name: 'Printer', icon: '🖨️', keywords: ['printer', 'scanner', 'all-in-one printer', 'inkjet', 'laser printer'] },
  { id: 'camera', name: 'Camera', icon: '📷', keywords: ['camera', 'digital camera', 'dslr', 'mirrorless', 'webcam'] },
  { id: 'battery', name: 'Battery', icon: '🔋', keywords: ['battery', 'power bank', 'rechargeable battery', 'lithium battery', 'button cell'] },
  { id: 'other-electronics', name: 'Other Electronics', icon: '🔧', keywords: ['electronics', 'electronic device', 'gadget', 'appliance'] },
]

export const CATEGORY_GUIDANCE = {
  'mobile-phone': {
    title: 'Mobile Phone',
    description: 'Smartphones and mobile phones contain valuable materials like gold, silver, copper, and rare earth elements, along with hazardous substances such as lead, mercury, and flame retardants.',
    whyEwaste: 'Mobile phones are classified as e-waste because they contain toxic materials that can leach into soil and water if improperly disposed of in landfills. They also contain recoverable precious metals.',
    beforeHandover: [
      'Back up all important data (photos, contacts, messages)',
      'Sign out of all accounts (Apple ID, Google Account, Samsung Account)',
      'Remove SIM card and memory cards',
      'Perform a factory reset to erase personal data',
      'Remove any screen protectors or cases',
      'Note: A factory reset may not guarantee complete data destruction for highly sensitive data'
    ],
    recommendedHandling: [
      'Trade-in or sell if device is functional',
      'Donate to certified refurbishment programs',
      'Use manufacturer take-back programs (Apple Trade In, Samsung Recycling, etc.)',
      'Drop off at certified e-waste recycling centers',
      'Check with local electronics retailers for recycling programs'
    ],
    avoid: [
      'Throwing in regular trash or recycling bins',
      'Leaving in drawers indefinitely (battery degradation risk)',
      'Attempting to disassemble yourself (battery fire risk)',
      'Selling/giving away without proper data wiping'
    ],
    reuseNote: 'Functional phones can be refurbished and resold, extending their lifecycle. Many carriers and manufacturers offer trade-in credits.'
  },
  'laptop': {
    title: 'Laptop',
    description: 'Laptops contain circuit boards, batteries, displays, and storage drives with both valuable and hazardous materials.',
    whyEwaste: 'Laptops contain lead in solder, mercury in older displays, flame retardants in plastics, and lithium-ion batteries. They also contain recoverable gold, copper, and aluminum.',
    beforeHandover: [
      'Back up all important files to external drive or cloud',
      'Sign out of all accounts and deauthorize software licenses',
      'Use secure erase tools for SSD/HDD (not just quick format)',
      'Remove any external peripherals and dongles',
      'Note: For highly sensitive data, consider physical drive destruction'
    ],
    recommendedHandling: [
      'Manufacturer trade-in programs (Dell, HP, Lenovo, Apple)',
      'Certified IT asset disposition (ITAD) services for businesses',
      'Donate to schools/non-profits if functional (after data wipe)',
      'Certified e-waste recyclers (R2 or e-Stewards certified)'
    ],
    avoid: [
      'Disposing in household waste',
      'Removing battery yourself unless trained',
      'Selling without verified data destruction'
    ],
    reuseNote: 'Many laptops can be refurbished. Components like RAM, SSDs, and screens are often reusable.'
  },
  'tablet': {
    title: 'Tablet',
    description: 'Tablets share similar composition to phones - integrated batteries, circuit boards, and displays.',
    whyEwaste: 'Tablets contain lithium-ion batteries, rare earth elements in displays, and circuit boards with hazardous substances.',
    beforeHandover: [
      'Back up data to cloud or computer',
      'Sign out of Apple ID / Google Account / Samsung Account',
      'Remove SIM card if cellular model',
      'Factory reset the device',
      'Remove cases and screen protectors'
    ],
    recommendedHandling: [
      'Manufacturer trade-in programs',
      'Certified e-waste recycling centers',
      'Electronics retailer take-back programs'
    ],
    avoid: [
      'Household trash disposal',
      'Battery puncture risk if disassembled',
      'Donating without data wipe'
    ],
    reuseNote: 'Functional tablets are highly reusable for education, kiosks, or secondary devices.'
  },
  'monitor': {
    title: 'Monitor',
    description: 'Monitors contain display panels, circuit boards, and power supplies. Older models may contain mercury.',
    whyEwaste: 'LCD/LED monitors contain circuit boards with lead solder, and older CCFL-backlit monitors contain mercury. Plastics may contain flame retardants.',
    beforeHandover: [
      'Disconnect all cables (power, HDMI, DisplayPort, USB)',
      'Remove any mounting brackets or stands',
      'Clean the screen if donating'
    ],
    recommendedHandling: [
      'Certified e-waste recyclers',
      'Manufacturer take-back programs',
      'Local government e-waste collection events',
      'Donate if functional and relatively modern'
    ],
    avoid: [
      'Breaking the screen (mercury/chemical exposure risk)',
      'Curbside disposal',
      'Leaving outdoors (weather damage)'
    ],
    reuseNote: 'Working monitors are easily reusable. Many organizations accept donations of functional displays.'
  },
  'keyboard': {
    title: 'Keyboard',
    description: 'Keyboards contain circuit boards, switches, and plastic housings. Mechanical keyboards have additional metal components.',
    whyEwaste: 'Keyboards contain printed circuit boards with lead solder and electronic components. Wireless models contain batteries.',
    beforeHandover: [
      'Disconnect cables or remove USB receiver',
      'Remove batteries if wireless',
      'Clean debris from keys'
    ],
    recommendedHandling: [
      'E-waste recycling centers',
      'Electronics retailer recycling bins',
      'Donate if functional'
    ],
    avoid: [
      'Household recycling (mixed materials)',
      'Forcing disassembly'
    ],
    reuseNote: 'Mechanical keyboards are highly repairable - switches and keycaps can be replaced.'
  },
  'mouse': {
    title: 'Mouse',
    description: 'Computer mice contain circuit boards, sensors, and batteries (wireless models).',
    whyEwaste: 'Mice contain printed circuit boards with electronic components and lead solder. Wireless mice contain lithium batteries.',
    beforeHandover: [
      'Remove batteries if wireless',
      'Remove USB receiver/dongle',
      'Clean sensor and feet'
    ],
    recommendedHandling: [
      'E-waste recycling centers',
      'Electronics retailer recycling programs',
      'Donate if functional'
    ],
    avoid: [
      'Household trash',
      'Battery compartment corrosion if stored long-term with batteries'
    ],
    reuseNote: 'Functional mice are easily reusable and often accepted by schools and non-profits.'
  },
  'charger': {
    title: 'Charger / Power Adapter',
    description: 'Chargers contain transformers, circuit boards, capacitors, and wiring with copper and electronic components.',
    whyEwaste: 'Power adapters contain circuit boards, transformers with copper windings, capacitors, and plastic housings with flame retardants.',
    beforeHandover: [
      'Unplug from outlet and device',
      'Coil cables neatly to prevent damage',
      'Check for frayed wires or damage'
    ],
    recommendedHandling: [
      'E-waste recycling centers',
      'Electronics retailer recycling (Best Buy, Staples, etc.)',
      'Manufacturer take-back if available'
    ],
    avoid: [
      'Household recycling bins',
      'Using damaged chargers (fire risk)',
      'Throwing in trash'
    ],
    reuseNote: 'Compatible chargers can be reused with other devices. Many households accumulate excess chargers.'
  },
  'cable': {
    title: 'Cable / Cord',
    description: 'Cables contain copper wiring, insulation, and connectors with gold-plated contacts.',
    whyEwaste: 'Cables contain recoverable copper and gold-plated connectors. Insulation may contain plasticizers.',
    beforeHandover: [
      'Untangle and organize cables',
      'Identify cable types (USB, HDMI, power, etc.)',
      'Check for damage or fraying'
    ],
    recommendedHandling: [
      'E-waste recycling for copper recovery',
      'Electronics retailer cable recycling bins',
      'Scrap metal recyclers for copper value'
    ],
    avoid: [
      'Household recycling (tangles machinery)',
      'Cutting cables yourself (sharp ends)',
      'Landfill disposal'
    ],
    reuseNote: 'Standard cables (USB-A, USB-C, HDMI, power cords) are highly reusable. Consider donating excess cables.'
  },
  'earphones': {
    title: 'Earphones / Earbuds',
    description: 'Earphones contain drivers, batteries (wireless), circuit boards, and small plastic/metal components.',
    whyEwaste: 'Wireless earbuds contain tiny lithium-ion batteries, Bluetooth chips, and circuit boards. Wired versions have copper wiring and drivers.',
    beforeHandover: [
      'Clean ear tips and charging case',
      'Reset and unpair from devices (wireless)',
      'Include charging case and all accessories'
    ],
    recommendedHandling: [
      'Manufacturer recycling programs (Apple, Samsung, etc.)',
      'E-waste recycling centers',
      'Electronics retailer recycling'
    ],
    avoid: [
      'Household trash (battery fire risk)',
      'Losing charging case (reduces recyclability)',
      'Attempting battery replacement'
    ],
    reuseNote: 'Limited reuse due to hygiene and battery degradation. Some manufacturers offer refurbishment.'
  },
  'headphones': {
    title: 'Headphones',
    description: 'Headphones contain drivers, headbands, ear cushions, cables, and batteries (wireless models).',
    whyEwaste: 'Headphones contain electronic drivers, circuit boards (wireless), lithium batteries, and various plastics and metals.',
    beforeHandover: [
      'Remove cables if detachable',
      'Charge battery to ~50% if storing',
      'Clean ear cushions',
      'Include all accessories and case'
    ],
    recommendedHandling: [
      'Manufacturer take-back programs',
      'E-waste recycling centers',
      'Donate if functional and hygienic'
    ],
    avoid: [
      'Household trash',
      'Crushing or bending headband',
      'Exposing batteries to heat'
    ],
    reuseNote: 'High-quality headphones are very repairable - ear pads, cables, and headbands are often replaceable.'
  },
  'printer': {
    title: 'Printer / Scanner',
    description: 'Printers contain print heads, circuit boards, motors, rollers, and ink/toner cartridges.',
    whyEwaste: 'Printers contain complex electronics, motors, circuit boards with lead solder, and consumables (ink/toner) that are hazardous.',
    beforeHandover: [
      'Remove all ink/toner cartridges (recycle separately)',
      'Remove paper trays and accessories',
      'Clean ink/toner residue',
      'Secure print head if removable'
    ],
    recommendedHandling: [
      'Manufacturer take-back (HP, Canon, Epson, Brother have programs)',
      'Office supply store recycling (Staples, Office Depot)',
      'Certified e-waste recyclers',
      'Local government e-waste events'
    ],
    avoid: [
      'Household trash (heavy, hazardous components)',
      'Leaving ink/toner inside (leaks)',
      'Curbside disposal'
    ],
    reuseNote: 'Functional printers are often accepted by schools and non-profits. Cartridges have separate recycling streams.'
  },
  'camera': {
    title: 'Camera',
    description: 'Digital cameras contain image sensors, processors, lenses, LCD screens, and batteries.',
    whyEwaste: 'Cameras contain circuit boards, lithium-ion batteries, rare earth elements in sensors, and complex optics.',
    beforeHandover: [
      'Remove memory cards',
      'Remove battery',
      'Remove lens (interchangeable lens cameras)',
      'Include charger and accessories',
      'Reset to factory settings'
    ],
    recommendedHandling: [
      'Manufacturer trade-in programs',
      'Camera store trade-in/recycling',
      'Certified e-waste recyclers',
      'Sell to used camera dealers if functional'
    ],
    avoid: [
      'Household trash',
      'Removing sensor or disassembling',
      'Exposing to moisture'
    ],
    reuseNote: 'Cameras and lenses hold value well. Vintage/film cameras have collector markets. Lenses are highly reusable across systems.'
  },
  'battery': {
    title: 'Battery / Power Bank',
    description: 'Lithium-ion, NiMH, alkaline, and button cell batteries require special handling due to fire risk and toxic materials.',
    whyEwaste: 'Batteries contain heavy metals (lead, cadmium, mercury), lithium, and electrolytes. They pose fire hazards if damaged or short-circuited.',
    beforeHandover: [
      'Tape terminals on lithium/9V batteries (prevent short circuits)',
      'Store in non-conductive container',
      'Separate by chemistry if possible',
      'Do NOT puncture, crush, or expose to heat'
    ],
    recommendedHandling: [
      'Dedicated battery recycling (Call2Recycle, retailer bins)',
      'Household hazardous waste facilities',
      'Auto parts stores for lead-acid batteries',
      'Never in household trash or recycling'
    ],
    avoid: [
      'Household trash (fire risk in trucks/facilities)',
      'Household recycling (contamination/fire risk)',
      'Storing loose with metal objects',
      'Accumulating large quantities'
    ],
    reuseNote: 'Single-use batteries are not rechargeable. Rechargeable batteries have limited cycles. Power banks degrade over time.'
  },
  'other-electronics': {
    title: 'Other Electronics',
    description: 'General electronic devices not covered by specific categories.',
    whyEwaste: 'Most electronic devices contain circuit boards, wiring, batteries, or displays with hazardous and recoverable materials.',
    beforeHandover: [
      'Remove batteries if accessible',
      'Delete personal data if applicable',
      'Include all cables and accessories',
      'Note device type for recycler'
    ],
    recommendedHandling: [
      'Certified e-waste recycling centers',
      'Electronics retailer recycling programs',
      'Local government e-waste collection',
      'Manufacturer take-back if available'
    ],
    avoid: [
      'Household trash or recycling',
      'Disassembly without training',
      'Long-term storage with batteries installed'
    ],
    reuseNote: 'Functional devices can often be donated. Many components are recoverable through proper recycling.'
  }
}