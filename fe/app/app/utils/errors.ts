import { toast } from 'react-toastify'
import { NextApiRequest } from 'next'
import { IncomingHttpHeaders } from 'node:http'

import { COLORS_LOG, ENABLE_CONSOLE_LOG } from '@/static'
import { isBrowser, skipIfNull } from '@/utils'

import { AxiosError } from '@/lib'


export const verbose = (callback: () => void, show = false): null => {
  if (show || ENABLE_CONSOLE_LOG) callback()
  return null
}

/**
 * Get error text from different error types
 * @param e
 * @returns
 */
export const getErrorText = (e: any) =>
  skipIfNull(e) +
  skipIfNull(e?.message) +
  skipIfNull(e?.response?.data?.message?.[0]) +
  skipIfNull(e?.response?.data?.message)

export const toError = (response: any, text = '') => {
  throw new Error(getErrorText(response?.data?.error) ?? text)
}

/**`
 *
 * @param error PostgrestError (supabase SDK), AxiosError (axios SDK), ZodError (Zod validation) Error, any
 * @param headers IncomingHttpHeaders  (optional)
 * @param req NextApiRequest (optional), if req is provided the logError will be logged
 * @param log boolean (force verbose error with console.log), default false (true for localhost)
 * @param logError boolean (force verbose error with console.error), default false (true for localhost) (optional)
 * @param toast string (toatify text) (optional)
 * @param sentry boolean (toggle sentry error log), default true (false for localhost) (optional)
 * @param table string (supabase table) (optional)
 * @param action string (function name where api is exectuting) (optional)
 * @param api boolean (is api call), default false (optional)
 * @param throwError boolean (throw error), default false (optional)
 * @param forceLocalhost boolean (force localhost), default false (optional)
 * @returns string
 */
export const manageErrors = ({
  error,
  headers,
  req,
  log = false,
  logError = false,
  toast: text = '',
  action = '',
  throwError = false
}: {
  error: any
  headers?: IncomingHttpHeaders
  req?: NextApiRequest
  log?: boolean
  logError?: boolean
  toast?: string
  sentry?: boolean
  table?: string
  action?: string
  forceLocalhost?: boolean
  throwError?: boolean
}): string => {
  let message = ''
  let ax: AxiosError | null = null
  let errorType: 'Supabase' | 'Axios' | 'Zod' | 'Error' | 'Unknown Error' | null = null

  const isError = !!error

  const headersReq = req?.headers || headers?.origin?.includes('localhost')

  const server = !!req || !!headers

  // check error type and exclude payload
  if (!!isError) {
    // AxiosError error
    if ('isAxiosError' in error) {
      errorType = 'Axios'
      ax = error as AxiosError
      verbose(() => console.log(ax), false)
      message +=
        skipIfNull(ax?.code) +
        skipIfNull(ax?.name) +
        skipIfNull(ax?.message) +
        skipIfNull(ax?.response?.statusText) +
        skipIfNull((ax?.response?.data as any)?.error) +
        `${ax?.config?.signal?.aborted ? skipIfNull((ax?.config?.signal as AbortSignal)?.reason) : ''}`
    }
    // Standard Error
    else if (error instanceof Error) {
      errorType = 'Error'
      message += skipIfNull(error.name) + skipIfNull(error.message) + skipIfNull(error.stack)
    }
    // Unknown error type
    else {
      errorType = 'Unknown Error'
      message += getErrorText(error)
    }
  }

  const errorMessage = `${skipIfNull(text)}${message}`
  const errorMeta = `${action ? `action:${action};` : ''}${errorType}`
  const errorLog = `${errorMeta};${errorMessage}`

  const isLocalhost = (isBrowser() && window?.location?.origin?.includes('localhost')) || headersReq

  // throw error on demand
  if (throwError && isError) {
    throw new Error(errorMessage)
  }

  // DEV mode or Verbose mode
  if ((isLocalhost || log || logError || server) && isError) {
    verbose(() => console.log(`${COLORS_LOG.red}--------VERBOSE ERROR START--------------------`), !server)

    verbose(() => {
      if (logError || server) {
        console.error(errorLog)
      } else {
        console.log(`${COLORS_LOG.yellow}${errorLog}${COLORS_LOG.reset}`)
      }
    }, true)

    verbose(() => console.log(`${COLORS_LOG.red}--------VERBOSE ERROR END----------------------`), !server)
  }

  // Show error notification
  if (!!text && isError) {
    toast.error(text)
  }

  return errorMessage
}
