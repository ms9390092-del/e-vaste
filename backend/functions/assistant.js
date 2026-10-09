const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

const CATEGORY_GUIDANCE = {
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
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }
}

function findRelevantGuidance(question) {
  const lowerQ = question.toLowerCase()
  const keywords = {
    'mobile-phone': ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'cell'],
    'laptop': ['laptop', 'notebook', 'macbook', 'computer'],
    'tablet': ['tablet', 'ipad'],
    'monitor': ['monitor', 'display', 'screen'],
    'keyboard': ['keyboard'],
    'mouse': ['mouse', 'trackpad'],
    'charger': ['charger', 'adapter', 'power brick', 'charging'],
    'cable': ['cable', 'cord', 'wire', 'usb', 'hdmi'],
    'earphones': ['earphone', 'earbud', 'airpod', 'headphone', 'headset'],
    'printer': ['printer', 'scanner'],
    'camera': ['camera', 'dslr', 'webcam'],
    'battery': ['battery', 'power bank', 'button cell'],
  }

  for (const [catId, kws] of Object.entries(keywords)) {
    if (kws.some(kw => lowerQ.includes(kw))) {
      return CATEGORY_GUIDANCE[catId]
    }
  }
  return null
}

function generateResponse(question) {
  const guidance = findRelevantGuidance(question)

  if (guidance) {
    let response = `Based on the **${guidance.title}** guide:\n\n`
    const lowerQ = question.toLowerCase()

    if (lowerQ.includes('what should i do') || lowerQ.includes('how do i') || lowerQ.includes('recycle') || lowerQ.includes('dispose')) {
      response += "**Recommended Handling:**\n"
      guidance.recommendedHandling.forEach((step, i) => {
        response += `${i + 1}. ${step}\n`
      })
      response += "\n"
    }

    if (lowerQ.includes('prepare') || lowerQ.includes('handover') || lowerQ.includes('data') || lowerQ.includes('backup')) {
      response += "**Before Handover Checklist:**\n"
      guidance.beforeHandover.forEach((step, i) => {
        response += `${i + 1}. ${step}\n`
      })
      response += "\n"
    }

    if (lowerQ.includes('avoid') || lowerQ.includes('not') || lowerQ.includes('don\'t')) {
      response += "**Things to Avoid:**\n"
      guidance.avoid.forEach((step, i) => {
        response += `${i + 1}. ${step}\n`
      })
      response += "\n"
    }

    if (lowerQ.includes('reuse') || lowerQ.includes('refurbish') || lowerQ.includes('sell') || lowerQ.includes('donate')) {
      response += `**Reuse Note:** ${guidance.reuseNote}\n\n`
    }

    if (!lowerQ.includes('what should') && !lowerQ.includes('how') && !lowerQ.includes('prepare') && !lowerQ.includes('avoid') && !lowerQ.includes('reuse')) {
      response += `**What it is:** ${guidance.description}\n\n`
      response += `**Why it's e-waste:** ${guidance.whyEwaste}\n\n`
      response += "**Quick Summary:**\n"
      response += `• ${guidance.recommendedHandling[0]}\n`
      response += `• ${guidance.beforeHandover[0]}\n`
      response += `• ${guidance.avoid[0]}\n`
    }

    return response
  }

  const lowerQ = question.toLowerCase()

  if (lowerQ.includes('what is e-waste') || lowerQ.includes('define e-waste')) {
    return "E-waste (electronic waste) refers to discarded electrical or electronic devices. This includes phones, computers, TVs, appliances, and any device with a plug or battery. E-waste contains hazardous materials like lead, mercury, and flame retardants, plus valuable recoverable materials like gold, copper, and rare earth elements."
  }

  if (lowerQ.includes('battery') && (lowerQ.includes('trash') || lowerQ.includes('throw'))) {
    return "**Never throw batteries in the trash.** Batteries pose fire risks in waste trucks and facilities, and contain toxic materials. Take them to dedicated battery recycling locations (Call2Recycle bins at retailers, household hazardous waste facilities, or auto parts stores for lead-acid batteries)."
  }

  if (lowerQ.includes('data') && (lowerQ.includes('secure') || lowerQ.includes('delete') || lowerQ.includes('wipe'))) {
    return "For data security:\n1. Back up important files\n2. Sign out of all accounts\n3. Use secure erase tools (not quick format) for drives\n4. For highly sensitive data, consider physical drive destruction\n\n**Note:** This checklist helps protect your data but does not guarantee secure deletion. For certified data destruction, use professional ITAD services."
  }

  if (lowerQ.includes('near me') || lowerQ.includes('where') || lowerQ.includes('location') || lowerQ.includes('find')) {
    return "I can't access live location data. For finding disposal options near you:\n• Use the **Disposal Finder** feature in this app (requires verified data source)\n• Check Earth911.com or Call2Recycle.org\n• Visit your local government waste management website\n• Check retailer programs (Best Buy, Staples, Home Depot)\n• Contact manufacturer take-back programs directly"
  }

  return "I can help with questions about specific e-waste categories like phones, laptops, batteries, chargers, monitors, etc. Try asking:\n• \"What should I do with an old [item]?\"\n• \"How do I prepare a [item] for recycling?\"\n• \"Is [item] considered e-waste?\"\n\nFor location-specific or regulation-specific information, please verify with official/local sources."
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { question } = body

    if (!question || typeof question !== 'string') {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing or invalid question' })
      }
    }

    if (question.length > 500) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Question too long (max 500 characters)' })
      }
    }

    const answer = generateResponse(question)

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ answer })
    }
  } catch (error) {
    console.error('Assistant error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Failed to process question. Please try again.' })
    }
  }
}