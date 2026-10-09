import { EWASTE_CATEGORIES } from '../data/ewaste'

export function classifyItem(detectedLabels) {
  const labels = detectedLabels.map(l => l.Name.toLowerCase())
  const confidences = {}

  labels.forEach((label, idx) => {
    confidences[label] = detectedLabels[idx].Confidence
  })

  let bestMatch = null
  let bestScore = 0
  let bestCategory = null

  for (const category of EWASTE_CATEGORIES) {
    let score = 0
    let matchedKeywords = []

    for (const keyword of category.keywords) {
      for (const label of labels) {
        if (label.includes(keyword) || keyword.includes(label)) {
          const confidence = confidences[label] || 50
          score += confidence
          matchedKeywords.push({ keyword, label, confidence })
        }
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = category
      bestCategory = {
        ...category,
        matchedKeywords,
        rawScore: score
      }
    }
  }

  if (!bestMatch) {
    return {
      categoryId: 'other-electronics',
      categoryName: 'Other Electronics',
      isEwaste: true,
      confidence: Math.min(Math.max(bestScore, 30), 60),
      detectedLabels: labels,
      matchedKeywords: []
    }
  }

  const normalizedConfidence = Math.min(Math.max(bestScore / 2, 40), 98)

  return {
    categoryId: bestMatch.id,
    categoryName: bestMatch.name,
    isEwaste: true,
    confidence: Math.round(normalizedConfidence),
    detectedLabels: labels,
    matchedKeywords: bestCategory.matchedKeywords
  }
}

export function getManualCategory(categoryId) {
  return EWASTE_CATEGORIES.find(c => c.id === categoryId) || EWASTE_CATEGORIES[EWASTE_CATEGORIES.length - 1]
}

export const MANUAL_CATEGORIES = EWASTE_CATEGORIES.map(c => ({
  id: c.id,
  name: c.name,
  icon: c.icon
}))