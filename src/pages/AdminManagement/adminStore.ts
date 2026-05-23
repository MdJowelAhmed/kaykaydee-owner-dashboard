import { useSyncExternalStore } from 'react'
import { mockAdmins } from './adminData'
import type { AdminPermissionEntry, AdminRole, AdminRow, AdminStatus } from './types'

let admins: AdminRow[] = [...mockAdmins]
const listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

function getSnapshot() {
  return admins
}

function notify() {
  listeners.forEach((l) => l())
}

export function useAdmins(): AdminRow[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function getAdminById(id: string): AdminRow | null {
  return admins.find((a) => a.id === id) ?? null
}

export interface AdminFormPayload {
  name: string
  clinicName: string
  email: string
  phone: string
  role: AdminRole
  status: AdminStatus
  permissions: AdminPermissionEntry[]
}

export function addAdmin(payload: AdminFormPayload): AdminRow {
  const row: AdminRow = {
    id: String(10000 + Math.floor(Math.random() * 90000)),
    joinDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    ...payload,
  }
  admins = [row, ...admins]
  notify()
  return row
}

export function updateAdmin(id: string, payload: AdminFormPayload): AdminRow | null {
  let updated: AdminRow | null = null
  admins = admins.map((a) => {
    if (a.id !== id) return a
    updated = { ...a, ...payload }
    return updated
  })
  if (updated) notify()
  return updated
}

export function removeAdmin(id: string) {
  admins = admins.filter((a) => a.id !== id)
  notify()
}
