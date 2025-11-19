'use client'

import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Projeto, ConexaoProjeto } from '@/types/sync-my-mind'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { Network } from 'lucide-react'

interface MindMapProps {
  projetos: Projeto[]
  conexoes: ConexaoProjeto[]
  onSelectProject: (projeto: Projeto) => void
  onCreateConnection?: (origemId: string, destinoId: string) => Promise<void>
}

// Componente customizado para os nós do mapa mental
function ProjectNode({ data }: { data: any }) {
  return (
    <Card
      className="min-w-[250px] cursor-pointer hover:shadow-lg transition-shadow border-2"
      onClick={() => data.onSelect(data.projeto)}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
              {data.projeto.nome}
            </h3>
            <ProjectStatusBadge status={data.projeto.status} />
          </div>
          
          {data.projeto.descricao && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {data.projeto.descricao}
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            {data.projeto.login_acesso && (
              <Badge variant="outline" className="text-xs">
                Login
              </Badge>
            )}
            {data.projeto.zeroonepay_api_key && (
              <Badge variant="outline" className="text-xs bg-purple-50">
                ZeroOnePay
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const nodeTypes = {
  projeto: ProjectNode,
}

export function MindMap({
  projetos,
  conexoes,
  onSelectProject,
  onCreateConnection,
}: MindMapProps) {
  // Converter projetos em nós do ReactFlow
  const initialNodes: Node[] = useMemo(() => {
    return projetos.map((projeto, index) => {
      // Calcular posição em grid circular
      const angle = (index / projetos.length) * 2 * Math.PI
      const radius = 300
      const x = Math.cos(angle) * radius + 400
      const y = Math.sin(angle) * radius + 300

      return {
        id: projeto.id,
        type: 'projeto',
        position: { x, y },
        data: {
          projeto,
          onSelect: onSelectProject,
        },
      }
    })
  }, [projetos, onSelectProject])

  // Converter conexões em edges do ReactFlow
  const initialEdges: Edge[] = useMemo(() => {
    return conexoes.map((conexao) => {
      const edgeColors = {
        dependencia: '#3b82f6', // blue
        integracao: '#8b5cf6', // purple
        prerequisito: '#f59e0b', // amber
        relacionado: '#6b7280', // gray
      }

      return {
        id: conexao.id,
        source: conexao.projeto_origem_id,
        target: conexao.projeto_destino_id,
        type: 'smoothstep',
        animated: true,
        label: conexao.tipo_conexao,
        style: {
          stroke: edgeColors[conexao.tipo_conexao] || '#6b7280',
          strokeWidth: 2,
        },
      }
    })
  }, [conexoes])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (onCreateConnection && connection.source && connection.target) {
        try {
          await onCreateConnection(connection.source, connection.target)
          setEdges((eds) => addEdge(connection, eds))
        } catch (error) {
          console.error('Erro ao criar conexão:', error)
        }
      }
    },
    [onCreateConnection, setEdges]
  )

  if (projetos.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center py-12">
          <Network className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Mapa Mental Vazio
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            Crie projetos para visualizar as conexões e dependências entre eles
            no mapa mental interativo.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const projeto = node.data.projeto as Projeto
              switch (projeto.status) {
                case 'pendente':
                  return '#fbbf24'
                case 'em_andamento':
                  return '#3b82f6'
                case 'concluido':
                  return '#10b981'
                default:
                  return '#6b7280'
              }
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
    </Card>
  )
}
