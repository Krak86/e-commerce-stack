import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Axios client for making HTTP requests (post is default method)
 * @param config AxiosRequestConfig - Configuration for the request, including method, URL, headers, and data.
 * @returns Promise<AxiosResponse & { error: AxiosError }> - A promise that resolves to the response of the request, or an error object if the request fails.
 */
const axiosClient = async (
  config: AxiosRequestConfig
): Promise<
  AxiosResponse & {
    error: AxiosError | null
  }
> => {
  try {
    const response = await axios({
      ...config,
      // Use the provided method or default to 'post'
      method: config.method ?? 'post'
    })
    return {
      ...response,
      data: response.data,
      error: null
    }
  } catch (error: any) {
    return {
      data: null,
      status: error?.response?.status ?? 500,
      statusText: error?.response?.statusText ?? 'Error',
      headers: error?.response?.headers ?? {},
      config: error?.config ?? {},
      request: error?.request ?? null,
      error
    }
  }
}

export { axiosClient }

export type { AxiosError, AxiosRequestConfig, AxiosResponse }
