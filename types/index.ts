export interface College {
  id: string
  slug: string
  name: string
  city: string
  state: string
  established: number
  about: string
  feesMin: number
  feesMax: number
  overallRating: number
  examAccepted: string[]
  accreditations: string[]
  campusSize?: string
  website?: string
  placementAvg?: number
  placementHighest?: number
  topRecruiters: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  collegeId: string
  name: string
  duration: string
  annualFees: number
  eligibility: string
  field: string
}

export interface Review {
  id: string
  collegeId: string
  reviewerName: string
  rating: number
  content: string
  yearOfPassing: number
  createdAt: Date
}

export interface CollegeWithRelations extends College {
  courses: Course[]
  reviews: Review[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface CollegeFilters {
  search?: string
  state?: string
  feesMin?: number
  feesMax?: number
  examType?: string
  rating?: number
  courseType?: string
  page?: number
  limit?: number
}

export interface PredictorForm {
  exam: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'CAT' | 'GATE'
  rank?: number
  percentile?: number
  category: 'General' | 'OBC' | 'SC' | 'ST'
  preferredState?: string
  maxFees?: number
  preferredField: 'Engineering' | 'Medical' | 'Management' | 'Science'
}

export interface PredictionResult {
  collegeName: string
  admissionChance: 'Safe' | 'Moderate' | 'Ambitious'
  reason: string
  keyStrengths: string
}
