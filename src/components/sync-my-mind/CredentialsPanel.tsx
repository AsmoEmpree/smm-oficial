'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Key, Eye, EyeOff, Copy, Check } from 'lucide-react'
import type { Projeto } from '@/types/sync-my-mind'

interface CredentialsPanelProps {
  projeto: Projeto
}

export function CredentialsPanel({ projeto }: CredentialsPanelProps) {
  const [showPasswords, setShowPasswords] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const maskText = (text: string) => {
    return '•'.repeat(Math.min(text.length, 20))
  }

  const credentials = [
    {
      label: 'Login de Acesso',
      value: projeto.login_acesso,
      field: 'login',
      sensitive: false,
    },
    {
      label: 'Senha de Acesso',
      value: projeto.senha_acesso,
      field: 'senha',
      sensitive: true,
    },
    {
      label: 'ZeroOnePay API Key',
      value: projeto.zeroonepay_api_key,
      field: 'api_key',
      sensitive: true,
    },
    {
      label: 'ZeroOnePay Secret Key',
      value: projeto.zeroonepay_secret_key,
      field: 'secret_key',
      sensitive: true,
    },
    {
      label: 'Webhook URL',
      value: projeto.zeroonepay_webhook,
      field: 'webhook',
      sensitive: false,
    },
    {
      label: 'Merchant ID',
      value: projeto.zeroonepay_merchant_id,
      field: 'merchant_id',
      sensitive: false,
    },
  ]

  const hasCredentials = credentials.some((cred) => cred.value)

  const getZeroOnePayStatus = () => {
    const hasApiKey = !!projeto.zeroonepay_api_key
    const hasSecretKey = !!projeto.zeroonepay_secret_key
    const hasWebhook = !!projeto.zeroonepay_webhook

    if (hasApiKey && hasSecretKey && hasWebhook) {
      return { status: 'ativo', label: 'Ativo', color: 'bg-green-100 text-green-800 border-green-300' }
    } else if (hasApiKey || hasSecretKey || hasWebhook) {
      return { status: 'parcial', label: 'Parcial', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
    } else {
      return { status: 'inativo', label: 'Não Configurado', color: 'bg-gray-100 text-gray-800 border-gray-300' }
    }
  }

  const zeroOnePayStatus = getZeroOnePayStatus()

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" />
            Credenciais e Integrações
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPasswords(!showPasswords)}
          >
            {showPasswords ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Ocultar
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Mostrar
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!hasCredentials ? (
          <div className="text-center py-12">
            <Key className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Nenhuma credencial configurada ainda.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Edite o projeto para adicionar credenciais.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status ZeroOnePay */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Status da Integração ZeroOnePay
                </h3>
                <Badge className={zeroOnePayStatus.color}>
                  {zeroOnePayStatus.label}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                {zeroOnePayStatus.status === 'ativo'
                  ? 'Todas as credenciais configuradas corretamente.'
                  : zeroOnePayStatus.status === 'parcial'
                  ? 'Algumas credenciais estão faltando.'
                  : 'Configure as credenciais para ativar a integração.'}
              </p>
            </div>

            {/* Lista de Credenciais */}
            <div className="space-y-4">
              {credentials.map((cred) => {
                if (!cred.value) return null

                const displayValue =
                  cred.sensitive && !showPasswords
                    ? maskText(cred.value)
                    : cred.value

                return (
                  <div
                    key={cred.field}
                    className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {cred.label}
                      </label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(cred.value!, cred.field)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedField === cred.field ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-gray-50 rounded px-3 py-2 font-mono text-sm text-gray-900 break-all">
                      {displayValue}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
