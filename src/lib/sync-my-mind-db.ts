// ============================================
// SYNC MY MIND - DATABASE FUNCTIONS
// ============================================

import { supabase } from './supabase'
import type {
  Projeto,
  Observacao,
  Tarefa,
  ConexaoProjeto,
  MembroProjeto,
  ProjetoFormData,
  ObservacaoFormData,
  TarefaFormData,
} from '@/types/sync-my-mind'

// ============================================
// PROJETOS
// ============================================

export async function getProjetos(): Promise<Projeto[]> {
  const { data, error } = await supabase
    .from('projetos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProjeto(id: string): Promise<Projeto | null> {
  const { data, error } = await supabase
    .from('projetos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProjeto(projeto: ProjetoFormData): Promise<Projeto> {
  const { data: userData } = await supabase.auth.getUser()
  
  if (!userData.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('projetos')
    .insert([
      {
        ...projeto,
        usuario_id: userData.user.id,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProjeto(id: string, projeto: Partial<ProjetoFormData>): Promise<Projeto> {
  const { data, error } = await supabase
    .from('projetos')
    .update(projeto)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProjeto(id: string): Promise<void> {
  const { error } = await supabase
    .from('projetos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// OBSERVAÇÕES
// ============================================

export async function getObservacoes(projetoId: string): Promise<Observacao[]> {
  const { data, error } = await supabase
    .from('observacoes')
    .select('*')
    .eq('projeto_id', projetoId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createObservacao(
  projetoId: string,
  observacao: ObservacaoFormData
): Promise<Observacao> {
  const { data: userData } = await supabase.auth.getUser()
  
  if (!userData.user) throw new Error('Usuário não autenticado')

  // Buscar nome do usuário
  const { data: userProfile } = await supabase
    .from('users')
    .select('name')
    .eq('id', userData.user.id)
    .single()

  const autorNome = userProfile?.name || userData.user.email || 'Usuário'

  const { data, error } = await supabase
    .from('observacoes')
    .insert([
      {
        ...observacao,
        projeto_id: projetoId,
        autor: autorNome,
        autor_id: userData.user.id,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteObservacao(id: string): Promise<void> {
  const { error } = await supabase
    .from('observacoes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// TAREFAS
// ============================================

export async function getTarefas(projetoId: string): Promise<Tarefa[]> {
  const { data, error } = await supabase
    .from('tarefas')
    .select('*')
    .eq('projeto_id', projetoId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTarefa(
  projetoId: string,
  tarefa: TarefaFormData
): Promise<Tarefa> {
  const { data, error } = await supabase
    .from('tarefas')
    .insert([
      {
        ...tarefa,
        projeto_id: projetoId,
        prioridade: tarefa.prioridade || 'media',
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTarefa(id: string, tarefa: Partial<TarefaFormData & { concluida?: boolean }>): Promise<Tarefa> {
  const { data, error } = await supabase
    .from('tarefas')
    .update(tarefa)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTarefa(id: string): Promise<void> {
  const { error } = await supabase
    .from('tarefas')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function toggleTarefa(id: string, concluida: boolean): Promise<Tarefa> {
  return updateTarefa(id, { concluida })
}

// ============================================
// CONEXÕES ENTRE PROJETOS
// ============================================

export async function getConexoes(): Promise<ConexaoProjeto[]> {
  const { data, error } = await supabase
    .from('conexoes_projetos')
    .select('*')

  if (error) throw error
  return data || []
}

export async function createConexao(
  origemId: string,
  destinoId: string,
  tipo: string = 'dependencia',
  descricao?: string
): Promise<ConexaoProjeto> {
  const { data, error } = await supabase
    .from('conexoes_projetos')
    .insert([
      {
        projeto_origem_id: origemId,
        projeto_destino_id: destinoId,
        tipo_conexao: tipo,
        descricao,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteConexao(id: string): Promise<void> {
  const { error } = await supabase
    .from('conexoes_projetos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// MEMBROS DO PROJETO
// ============================================

export async function getMembros(projetoId: string): Promise<MembroProjeto[]> {
  const { data, error } = await supabase
    .from('membros_projeto')
    .select('*')
    .eq('projeto_id', projetoId)

  if (error) throw error
  return data || []
}

export async function addMembro(
  projetoId: string,
  usuarioId: string,
  papel: string = 'membro'
): Promise<MembroProjeto> {
  const { data, error } = await supabase
    .from('membros_projeto')
    .insert([
      {
        projeto_id: projetoId,
        usuario_id: usuarioId,
        papel,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeMembro(id: string): Promise<void> {
  const { error } = await supabase
    .from('membros_projeto')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export function subscribeToProjectChanges(
  projetoId: string,
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel(`projeto-${projetoId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'observacoes',
        filter: `projeto_id=eq.${projetoId}`,
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tarefas',
        filter: `projeto_id=eq.${projetoId}`,
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToAllProjects(callback: (payload: any) => void) {
  const channel = supabase
    .channel('all-projects')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projetos',
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
