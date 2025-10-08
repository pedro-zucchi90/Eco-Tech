import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useRegistrosColeta() {
  const { data, error, isLoading, mutate } = useSWR("/api/registros-coleta?status=validado", fetcher, {
    refreshInterval: 5000,
  })

  return {
    registros: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
