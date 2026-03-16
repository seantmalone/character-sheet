import '@testing-library/jest-dom'

// Node 22+ ships a built-in localStorage that requires --localstorage-file.
// Override it with a simple in-memory implementation so zustand's persist
// middleware works in the test environment.
const store = new Map()
const localStorageMock = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
}
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})
