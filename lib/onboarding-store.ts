import { create } from 'zustand'

interface OnboardingData {
  fullName: string
  purpose: string
}

interface OnboardingState {
  step: number
  data: OnboardingData
  setStep: (step: number) => void
  updateData: (partial: Partial<OnboardingData>) => void
  reset: () => void
}

const initialState: OnboardingData = {
  fullName: '',
  purpose: '',
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 0,
  data: { ...initialState },
  setStep: (step) => set({ step }),
  updateData: (partial) =>
    set((state) => ({ data: { ...state.data, ...partial } })),
  reset: () => set({ step: 0, data: { ...initialState } }),
}))
