import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useColetas(pontoColetaId?: string, dataInicio?: string, dataFim?: string) {
  let url = "/api/coletas"
  const params = new URLSearchParams()

  if (pontoColetaId) params.append("pontoColetaId", pontoColetaId)
  if (dataInicio) params.append("dataInicio", dataInicio)
  if (dataFim) params.append("dataFim", dataFim)

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 5000,
  })

  return {
    coletas: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
