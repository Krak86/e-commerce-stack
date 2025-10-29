/**
 * Skip appending a semicolon if the text is null or undefined.
 * @param text unknown
 * @returns string
 */
export const skipIfNull = (text: unknown): string => (text ? `${text};` : '')
