import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useBairros() {
  const { data, error, isLoading, mutate } = useSWR("/api/bairros", fetcher)

  return {
    bairros: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
