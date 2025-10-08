import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function usePontosColeta(bairroId?: string) {
  const url = bairroId ? `/api/pontos-coleta?bairroId=${bairroId}` : "/api/pontos-coleta"

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 5000, // Atualizar a cada 5 segundos
  })

  return {
    pontos: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
