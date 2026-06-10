export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr'
  if (num >= 100000) return (num / 100000).toFixed(1) + ' L'
  if (num >= 1000) return (num / 1000).toFixed(1) + ' K'
  return num.toString()
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600'
  if (rating >= 4.0) return 'text-green-500'
  if (rating >= 3.5) return 'text-yellow-500'
  if (rating >= 3.0) return 'text-orange-500'
  return 'text-red-500'
}

export function getChanceColor(chance: 'Safe' | 'Moderate' | 'Ambitious'): string {
  switch (chance) {
    case 'Safe':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'Moderate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'Ambitious':
      return 'bg-red-100 text-red-800 border-red-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}
