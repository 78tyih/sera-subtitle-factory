'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AspectRatio, CaptionRecipe } from '@/types/caption';
import { presets, getPreset } from '@/presets';
import { demoTranscripts, DEFAULT_DEMO_ID, getTranscript } from '@/lib/demo-transcripts';

/**
 * Single store for the whole product (spec §61).
 * Persisted: saved recipes + preferences.  Not persisted: playback state.
 */

export type StudioTab = 'templates' | 'typography' | 'colors' | 'background' | 'border' | 'motion' | 'emphasis' | 'recipes';

interface HistoryEntry {
  recipe: CaptionRecipe;
}

interface CaptionState {
  /* project */
  transcriptId: string;
  recipe: CaptionRecipe;
  aspect: AspectRatio;
  showSafeArea: boolean;

  /* playback */
  currentTime: number;
  duration: number;
  playing: boolean;

  /* selection */
  selectedSegmentId: string | null;
  tab: StudioTab;

  /* library */
  savedRecipes: CaptionRecipe[];
  recentPresetIds: string[];

  /* history */
  past: HistoryEntry[];
  future: HistoryEntry[];

  /* actions */
  setTab: (t: StudioTab) => void;
  setTranscript: (id: string) => void;
  setAspect: (a: AspectRatio) => void;
  toggleSafeArea: () => void;
  usePreset: (id: string) => void;
  patchRecipe: (patch: DeepPartial<CaptionRecipe>) => void;
  replaceRecipe: (r: CaptionRecipe) => void;
  setTime: (t: number) => void;
  setPlaying: (p: boolean) => void;
  togglePlaying: () => void;
  selectSegment: (id: string | null) => void;
  saveRecipe: (name?: string) => void;
  duplicateRecipe: (id: string) => void;
  renameRecipe: (id: string, name: string) => void;
  deleteRecipe: (id: string) => void;
  importRecipe: (r: CaptionRecipe) => void;
  undo: () => void;
  redo: () => void;
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function mergeDeep<T>(base: T, patch: DeepPartial<T>): T {
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(patch as Record<string, unknown>)) {
    const pv = (patch as Record<string, unknown>)[key];
    const bv = (base as Record<string, unknown>)[key];
    if (pv && typeof pv === 'object' && !Array.isArray(pv) && bv && typeof bv === 'object' && !Array.isArray(bv)) {
      out[key] = mergeDeep(bv, pv as DeepPartial<typeof bv>);
    } else {
      out[key] = pv;
    }
  }
  return out as T;
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

const initialTranscript = getTranscript(DEFAULT_DEMO_ID);
const initialDuration = initialTranscript.words.length
  ? initialTranscript.words[initialTranscript.words.length - 1].end + 0.8
  : 5;

export const useCaptionStore = create<CaptionState>()(
  persist(
    (set, get) => ({
      transcriptId: DEFAULT_DEMO_ID,
      recipe: clone(presets[0]),
      aspect: '16:9',
      showSafeArea: true,

      currentTime: 0,
      duration: initialDuration,
      playing: true,

      selectedSegmentId: null,
      tab: 'templates',

      savedRecipes: [],
      recentPresetIds: [],

      past: [],
      future: [],

      setTab: (tab) => set({ tab }),

      setTranscript: (id) => {
        const t = getTranscript(id);
        const duration = t.words.length ? t.words[t.words.length - 1].end + 0.8 : 5;
        set({ transcriptId: id, currentTime: 0, duration, selectedSegmentId: null });
      },

      setAspect: (aspect) => set({ aspect }),
      toggleSafeArea: () => set((s) => ({ showSafeArea: !s.showSafeArea })),

      usePreset: (id) => {
        const preset = getPreset(id) ?? get().savedRecipes.find((r) => r.id === id);
        if (!preset) return;
        set((s) => ({
          recipe: clone(preset),
          past: [...s.past, { recipe: clone(s.recipe) }].slice(-40),
          future: [],
          recentPresetIds: [id, ...s.recentPresetIds.filter((x) => x !== id)].slice(0, 6)
        }));
      },

      patchRecipe: (patch) =>
        set((s) => ({
          recipe: mergeDeep(s.recipe, patch),
          past: [...s.past, { recipe: clone(s.recipe) }].slice(-40),
          future: []
        })),

      replaceRecipe: (r) =>
        set((s) => ({ recipe: clone(r), past: [...s.past, { recipe: clone(s.recipe) }].slice(-40), future: [] })),

      setTime: (t) => set({ currentTime: Math.max(0, t) }),
      setPlaying: (playing) => set({ playing }),
      togglePlaying: () => set((s) => ({ playing: !s.playing })),
      selectSegment: (selectedSegmentId) => set({ selectedSegmentId }),

      saveRecipe: (name) =>
        set((s) => {
          const base = clone(s.recipe);
          const id = `${base.id}-copy-${s.savedRecipes.length + 1}`;
          const saved: CaptionRecipe = {
            ...base,
            id: s.savedRecipes.some((r) => r.id === base.id) ? id : base.id,
            name: name ?? (s.savedRecipes.some((r) => r.id === base.id) ? `${base.name} Copy` : base.name),
            author: 'sera',
            version: '1.0',
            createdAt: new Date().toISOString()
          };
          const exists = s.savedRecipes.findIndex((r) => r.id === saved.id);
          const savedRecipes = exists >= 0 ? s.savedRecipes.map((r, i) => (i === exists ? saved : r)) : [...s.savedRecipes, saved];
          return { savedRecipes };
        }),

      duplicateRecipe: (id) =>
        set((s) => {
          const src = s.savedRecipes.find((r) => r.id === id);
          if (!src) return {};
          const copy: CaptionRecipe = { ...clone(src), id: `${src.id}-${Date.now()}`, name: `${src.name} Copy` };
          return { savedRecipes: [...s.savedRecipes, copy] };
        }),

      renameRecipe: (id, name) =>
        set((s) => ({ savedRecipes: s.savedRecipes.map((r) => (r.id === id ? { ...r, name } : r)) })),

      deleteRecipe: (id) => set((s) => ({ savedRecipes: s.savedRecipes.filter((r) => r.id !== id) })),

      importRecipe: (r) => set((s) => ({ savedRecipes: [...s.savedRecipes, { ...r, id: `${r.id}-${Date.now()}` }] })),

      undo: () =>
        set((s) => {
          const last = s.past[s.past.length - 1];
          if (!last) return {};
          return { recipe: clone(last.recipe), past: s.past.slice(0, -1), future: [{ recipe: clone(s.recipe) }, ...s.future].slice(0, 40) };
        }),

      redo: () =>
        set((s) => {
          const next = s.future[0];
          if (!next) return {};
          return { recipe: clone(next.recipe), future: s.future.slice(1), past: [...s.past, { recipe: clone(s.recipe) }] };
        })
    }),
    {
      name: 'ssf-store-v1',
      partialize: (s) => ({
        transcriptId: s.transcriptId,
        recipe: s.recipe,
        aspect: s.aspect,
        showSafeArea: s.showSafeArea,
        savedRecipes: s.savedRecipes,
        recentPresetIds: s.recentPresetIds
      })
    }
  )
);

export const allTranscripts = demoTranscripts;
