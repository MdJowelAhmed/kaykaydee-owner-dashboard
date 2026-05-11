/** Shared layout math: fixed header (h-20) + gap below header before sidebar / shell content */
export const DASHBOARD_HEADER_H = '3.5rem' as const
export const DASHBOARD_HEADER_SIDEBAR_GAP = '2rem' as const

/** Vertical gap between viewport edges and the floating sidebar card (matches former `my-5`) */
export const DASHBOARD_SIDEBAR_V_INSET = '1.25rem' as const

/** Stacking: navbar above scroll content & sidebar overlay (40); charts/cards often use low local z-index */
export const DASHBOARD_HEADER_Z = 'z-[100]' as const
/** Main column stays below fixed chrome */
export const DASHBOARD_MAIN_Z = 'z-0' as const
