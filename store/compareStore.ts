import { create } from 'zustand'

interface College {
  id: string
  name: string
  slug: string
  city: string
  state: string
  feesMin: number
  feesMax: number
  overallRating: number
  placementAvg?: number
  examAccepted: string[]
  courses: any[]
}

interface CompareState {
  colleges: College[]
  addCollege: (college: College) => void
  removeCollege: (id: string) => void
  clearColleges: () => void
}

export const useCompareStore = create<CompareState>((set) => ({
  colleges: [],
  addCollege: (college) =>
    set((state) => {
      if (state.colleges.some((c) => c.id === college.id)) {
        return state
      }
      if (state.colleges.length >= 3) {
        return state
      }
      return { colleges: [...state.colleges, college] }
    }),
  removeCollege: (id) =>
    set((state) => ({
      colleges: state.colleges.filter((c) => c.id !== id),
    })),
  clearColleges: () => set({ colleges: [] }),
}))
