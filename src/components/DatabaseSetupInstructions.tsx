'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Database, CheckCircle, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export default function DatabaseSetupInstructions() {
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- Execute este script no SQL Editor do Supabase
-- Dashboard > SQL Editor > New Query

-- Criar tabelas
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  max_projects INTEGER NOT NULL DEFAULT 0,
  ai_credits INTEGER NOT NULL DEFAULT 0,
  storage_gb INTEGER NOT NULL DEFAULT 0,
  support_level TEXT NOT NULL DEFAULT 'email',
  active BOOLEAN NOT NULL DEFAULT true,
  color TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  icon TEXT NOT NULL DEFAULT 'zap',
  popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Veja o arquivo database-setup.sql para o script completo!`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <Card className="max-w-4xl w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Database className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Configuração do Banco de Dados
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Configure o banco de dados do Supabase para ativar todas as funcionalidades do painel admin
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Alerta */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-900">Banco de dados não configurado</h4>
                <p className="text-sm text-orange-800 mt-1">
                  Para usar o painel admin, você precisa executar o script SQL no Supabase.
                </p>
              </div>
            </div>
          </div>

          {/* Passos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Siga estes passos:</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Conecte sua conta Supabase</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Vá em Configurações do Projeto → Integrações → Conectar Supabase
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Abra o arquivo database-setup.sql</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    O arquivo está na raiz do projeto com o script SQL completo
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Execute no SQL Editor do Supabase</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Dashboard do Supabase → SQL Editor → New Query → Cole e Execute
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Recarregue esta página</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Após executar o script, recarregue para acessar o painel admin
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview do Script */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Preview do Script SQL</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className="text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
                {sqlScript}
              </pre>
            </div>
            <p className="text-xs text-gray-500 text-center">
              ⚠️ Este é apenas um preview. Use o arquivo database-setup.sql completo!
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Dashboard Supabase
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              Recarregar Página
            </Button>
          </div>

          {/* Link para Documentação */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Precisa de ajuda?{' '}
              <a
                href="/SETUP-BANCO-DE-DADOS.md"
                target="_blank"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Leia a documentação completa
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
