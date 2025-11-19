// ============================================
// SYNC MY MIND - TYPES
// ============================================

export type ProjetoStatus = 'pendente' | 'em_andamento' | 'concluido'
export type TipoConexao = 'dependencia' | 'integracao' | 'prerequisito' | 'relacionado'
export type PapelMembro = 'admin' | 'editor' | 'membro' | 'visualizador'
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta'

export interface Projeto {
  id: string
  nome: string
  descricao?: string
  status: ProjetoStatus
  login_acesso?: string
  senha_acesso?: string
  zeroonepay_api_key?: string
  zeroonepay_secret_key?: string
  zeroonepay_webhook?: string
  zeroonepay_merchant_id?: string
  zeroonepay_status?: string
  usuario_id: string
  created_at: string
  updated_at: string
}

export interface Observacao {
  id: string
  texto: string
  autor: string
  autor_id: string
  projeto_id: string
  created_at: string
}

export interface Tarefa {
  id: string
  descricao: string
  concluida: boolean
  projeto_id: string
  responsavel?: string
  prioridade: PrioridadeTarefa
  created_at: string
  updated_at: string
}

export interface ConexaoProjeto {
  id: string
  projeto_origem_id: string
  projeto_destino_id: string
  tipo_conexao: TipoConexao
  descricao?: string
  created_at: string
}

export interface MembroProjeto {
  id: string
  projeto_id: string
  usuario_id: string
  papel: PapelMembro
  created_at: string
}

// Types para o Mapa Mental (ReactFlow)
export interface MindMapNode {
  id: string
  type: 'projeto'
  position: { x: number; y: number }
  data: {
    projeto: Projeto
    tarefas: Tarefa[]
    observacoes: Observacao[]
  }
}

export interface MindMapEdge {
  id: string
  source: string
  target: string
  type: 'smoothstep'
  label?: string
  animated?: boolean
  style?: React.CSSProperties
}

// Form types
export interface ProjetoFormData {
  nome: string
  descricao?: string
  status: ProjetoStatus
  login_acesso?: string
  senha_acesso?: string
  zeroonepay_api_key?: string
  zeroonepay_secret_key?: string
  zeroonepay_webhook?: string
  zeroonepay_merchant_id?: string
}

export interface ObservacaoFormData {
  texto: string
}

export interface TarefaFormData {
  descricao: string
  responsavel?: string
  prioridade?: PrioridadeTarefa
}

// ZeroOnePay Integration Types
export interface ZeroOnePayConfig {
  api_key: string
  secret_key: string
  webhook_url: string
  merchant_id: string
}

export interface ZeroOnePayStatus {
  connected: boolean
  last_sync?: string
  status: 'ativo' | 'inativo' | 'erro'
  message?: string
}
