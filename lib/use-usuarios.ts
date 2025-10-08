import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useUsuarios() {
  const { data, error, isLoading, mutate } = useSWR("/api/usuarios", fetcher, {
    refreshInterval: 10000,
  })

  return {
    usuarios: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
