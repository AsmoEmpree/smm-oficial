'use client'

import { Badge } from '@/components/ui/badge'
import type { ProjetoStatus } from '@/types/sync-my-mind'

interface ProjectStatusBadgeProps {
  status: ProjetoStatus
  className?: string
}

export function ProjectStatusBadge({ status, className = '' }: ProjectStatusBadgeProps) {
  const statusConfig = {
    pendente: {
      label: 'Pendente',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    em_andamento: {
      label: 'Em Andamento',
      className: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    concluido: {
      label: 'Concluído',
      className: 'bg-green-100 text-green-800 border-green-300',
    },
  }

  const config = statusConfig[status]

  return (
    <Badge className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  )
}
