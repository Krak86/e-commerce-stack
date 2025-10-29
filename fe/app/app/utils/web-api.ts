/**
 * Checks whether local storage is available
 * @returns {boolean}
 */
export const isLocalStorage = (): boolean => {
  try {
    if (typeof localStorage === 'object' && navigator.cookieEnabled) return true
    return false
  } catch (_) {
    return false
  }
}

/**
 * Checks whether front-end or back-end
 * @returns {boolean}
 */
export const isBrowser = (): boolean => typeof window !== 'undefined'

/**
 * Update Local Storage Item
 * @param {string} key
 * @param {string} val
 * @returns {void}
 */
export const updateLSName = (key: string, val: string): void => {
  if (isBrowser() && isLocalStorage()) {
    localStorage.setItem(key, val)
  }
}

/**
 * Get Local Storage Item
 * @param {string} key
 * @returns {void}
 */
export const getLSName = (key: string): string | null => {
  if (isBrowser() && isLocalStorage()) {
    return localStorage.getItem(key)
  }
  return null
}

/**
 * Delay function to pause execution for a specified time
 * @param ms number (milliseconds)
 * @return Promise<void>
 */
export const delay = async (ms: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, ms))
}
