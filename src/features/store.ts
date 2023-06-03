import { create } from 'zustand'

type FeatureStore = {
    inViewFeauture: string | null
    setInViewFeature: (feature: string | null) => void
    inFullScreen: string | null
    setInFullScreen: (feature: string | null) => void
    lastFullScreen: string | null
    setLastFullScreen: (feature: string | null) => void
}

export const useFeatureStore = create<FeatureStore>((set) => ({
    inViewFeauture: null,
    setInViewFeature: (feature: string | null) =>
        set({ inViewFeauture: feature }),
    inFullScreen: null,
    setInFullScreen: (feature: string | null) => {
        set({ inFullScreen: feature })
        if (feature !== null) {
            set({ lastFullScreen: feature })
        }
    },
    lastFullScreen: null,
    setLastFullScreen: (feature: string | null) =>
        set({ lastFullScreen: feature }),
}))
