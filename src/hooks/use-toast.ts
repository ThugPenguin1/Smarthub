"use client"

/**
 * ============================================================================
 * FILE: use-toast.ts — Toast Notification Hook
 * ============================================================================
 * WHAT IT IS:
 *   A custom hook + helper that powers the shadcn/ui toast system. It lets
 *   any component push a small temporary notification ("toast") to the
 *   user, e.g. "Message sent!" or "Form submitted successfully".
 *
 * WHAT IT DOES:
 *   - Maintains an in-memory store of currently-visible toasts (a small
 *     array, limited to 1 at a time by default).
 *   - Exposes `toast()` — a function any component can call to push a new
 *     toast. Returns an object with `dismiss`/`update` helpers.
 *   - Exposes `useToast()` — a hook that components use to read the
 *     current toast list (so they can render them) and get a `dismiss`
 *     function.
 *   - Uses a tiny pub/sub pattern: the `toast()` function dispatches an
 *     action that updates the in-memory state and notifies all
 *     subscribed `useToast` listeners.
 *
 * HOW IT FITS IN:
 *   Part of the shadcn/ui toast scaffold. The actual UI rendering is done
 *   by `<Toaster />` in `src/components/ui/toaster.tsx` (mounted once in
 *   `app/layout.tsx`). The `useToast` hook is what page/form components
 *   call to trigger toasts. The whole system is inspired by
 *   `react-hot-toast`.
 *
 *   You usually don't need to read every line of this file — just call
 *   `toast({ title: "...", description: "..." })` from your component.
 * ============================================================================
 */

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// How many toasts to keep on screen at once. 1 means a new toast replaces
// the previous one immediately.
const TOAST_LIMIT = 1
// How long (ms) to keep a dismissed toast in memory before fully removing
// it. The very large number is intentional — it lets the slide-out
// animation finish before the DOM element is removed. (This is a known
// shadcn scaffold quirk; in practice the animation completes well within
// this window.)
const TOAST_REMOVE_DELAY = 1000000

/**
 * ToasterToast — the shape of a toast object as we store it internally.
 * Extends the base ToastProps (open state, onOpenChange) with our own
 * id/title/description/action fields.
 */
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

/**
 * actionTypes — a const object listing the four reducer action types.
 * Using `as const` makes TypeScript infer literal string types (instead
 * of just `string`), which makes the Action union below type-safe.
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// Simple incrementing ID counter. Wraps modulo MAX_SAFE_INTEGER to avoid
// overflow in long-running sessions.
let count = 0

/**
 * genId — generate a unique string ID for a new toast.
 * Inputs: none. Returns: string.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

/**
 * Action — discriminated union of the four possible reducer actions.
 * Each variant carries the data its reducer case needs. This is the
 * classic Redux-style action pattern.
 */
type Action =
  | {
    type: ActionType["ADD_TOAST"]
    toast: ToasterToast
  }
  | {
    type: ActionType["UPDATE_TOAST"]
    toast: Partial<ToasterToast>
  }
  | {
    type: ActionType["DISMISS_TOAST"]
    toastId?: ToasterToast["id"]
  }
  | {
    type: ActionType["REMOVE_TOAST"]
    toastId?: ToasterToast["id"]
  }

/**
 * State — the reducer's state shape. Just an array of toasts.
 */
interface State {
  toasts: ToasterToast[]
}

// Map of toastId → setTimeout handle. Used to dedupe the remove-queue so
// we don't schedule the same toast for removal twice.
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * addToRemoveQueue — schedule a toast to be removed from state after a
 * delay (TOAST_REMOVE_DELAY). The delay lets the slide-out animation
 * play before the DOM element disappears.
 *
 * Input: toastId (string).
 * Effect: schedules a REMOVE_TOAST dispatch after the delay.
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * reducer — the pure function that takes the current state + an action
 * and returns the next state. This is the heart of the tiny state
 * machine that manages toasts.
 *
 * Inputs: state (State), action (Action).
 * Returns: new State.
 *
 * Cases:
 *   ADD_TOAST     — prepend the new toast, slice to TOAST_LIMIT.
 *   UPDATE_TOAST  — merge partial updates into the matching toast.
 *   DISMISS_TOAST — set open=false on the matching toast (or all), and
 *                   add it to the removal queue.
 *   REMOVE_TOAST  — drop the matching toast from the array entirely.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
              ...t,
              open: false,
            }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// ============== Pub/Sub layer ==============
// Listeners are functions that want to be notified whenever the in-memory
// state changes (i.e. the useToast subscribers). The dispatch function
// updates the state and calls every listener with the new state.
const listeners: Array<(state: State) => void> = []

// The single source of truth for toast state. Lives outside React so the
// `toast()` helper can dispatch without being inside a component.
let memoryState: State = { toasts: [] }

/**
 * dispatch — update the in-memory state via the reducer and notify all
 * subscribed listeners. This is the only way to mutate the toast state.
 *
 * Input: action (Action).
 * Effect: memoryState is updated; every listener is called with the new
 * state, which triggers re-renders in any useToast subscriber.
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Public type alias — a toast the caller wants to push, before we assign
// it an id internally. Omits "id" from ToasterToast.
type Toast = Omit<ToasterToast, "id">

/**
 * toast — the public function components call to push a toast.
 *
 * Input: Toast (title, description, action, etc. — without an id).
 * Returns: { id, dismiss, update } — the new toast's id plus helper
 * functions to dismiss or update it later.
 *
 * Implementation: generates an id, dispatches ADD_TOAST, wires up the
 * onOpenChange handler so closing the toast dispatches DISMISS_TOAST.
 */
function toast({ ...props }: Toast) {
  const id = genId()

  // Helper to update this toast later (e.g. change its title).
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  // Helper to dismiss this toast (triggers slide-out animation).
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      // When the toast's open state changes (e.g. user clicks the X),
      // dismiss it. This is how the UI tells us "the user closed me".
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * useToast — the React hook components use to subscribe to toast state.
 *
 * Inputs: none.
 * Returns: { toasts, toast, dismiss } — the current toast list, the
 * `toast()` function to push a new toast, and a `dismiss()` function to
 * dismiss one or all toasts.
 *
 * Implementation: subscribes to the pub/sub layer in useEffect. When the
 * in-memory state changes, `setState` is called with the new state, which
 * triggers a re-render. The cleanup removes this subscriber on unmount.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
