export const PRIORITIES = {
  1: { level: 1, name: 'P1', color: '#d1453b', icon: '🚩', label: 'Urgente' },
  2: { level: 2, name: 'P2', color: '#eb8909', icon: '🚩', label: 'Alta' },
  3: { level: 3, name: 'P3', color: '#246fe0', icon: '🚩', label: 'Média' },
  4: { level: 4, name: 'P4', color: '#999', icon: '🚩', label: 'Baixa' },
}

export const PRIORITY_OPTIONS = [
  { value: '', label: 'Sem prioridade' },
  { value: '1', label: 'P1 - Urgente' },
  { value: '2', label: 'P2 - Alta' },
  { value: '3', label: 'P3 - Média' },
  { value: '4', label: 'P4 - Baixa' },
]
