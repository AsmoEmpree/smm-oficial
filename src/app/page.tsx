'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Brain, Mail, Lock, User, Chrome, Check, Zap, TrendingUp, Shield, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })

      if (error) throw error

      setMessage('Cadastro realizado! Verifique seu email para confirmar.')
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: name,
              subscription_plan: 'free',
              ai_credits: 3,
            },
          ])

        if (profileError) console.error('Erro ao criar perfil:', profileError)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setMessage('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(errorMessage)
      setLoading(false)
    }
  }

  const plans = [
    {
      name: 'Básico',
      price: 'R$ 29',
      period: '/mês',
      description: 'Perfeito para começar',
      features: [
        'Até 5 projetos ativos',
        '10 créditos de IA por mês',
        'Assistente de IA básico',
        'Métricas individuais',
        'Suporte por email',
        'Armazenamento de 1GB'
      ],
      color: 'from-blue-500 to-cyan-500',
      icon: Zap
    },
    {
      name: 'Profissional',
      price: 'R$ 79',
      period: '/mês',
      description: 'Para profissionais',
      features: [
        'Projetos ilimitados',
        '100 créditos de IA por mês',
        'Assistente de IA avançado',
        'Métricas de equipe completas',
        'Comunicação otimizada',
        'Planejamento com IA',
        'Suporte prioritário',
        'Armazenamento de 10GB',
        'Integrações avançadas'
      ],
      color: 'from-purple-500 to-pink-500',
      icon: TrendingUp,
      popular: true
    },
    {
      name: 'Empresarial',
      price: 'R$ 199',
      period: '/mês',
      description: 'Solução completa',
      features: [
        'Tudo do Profissional',
        'Créditos de IA ilimitados',
        'IA personalizada',
        'Múltiplas equipes',
        'Painel admin completo',
        'White label disponível',
        'Suporte 24/7 dedicado',
        'Armazenamento ilimitado',
        'API personalizada',
        'Treinamento da equipe'
      ],
      color: 'from-orange-500 to-red-500',
      icon: Shield
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-7xl mx-auto">
          {/* Left Side - Auth */}
          <div className="flex items-center justify-center lg:sticky lg:top-8">
            <Card className="w-full max-w-md shadow-2xl border-0">
              <CardHeader className="space-y-4 text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SyncMyMind
                </CardTitle>
                <CardDescription className="text-base">
                  Organize seus projetos com inteligência
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Cadastro</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-login">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email-login"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password-login">Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password-login"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        disabled={loading}
                      >
                        {loading ? 'Entrando...' : 'Entrar'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-signup">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email-signup"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password-signup">Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password-signup"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        disabled={loading}
                      >
                        {loading ? 'Criando conta...' : 'Criar conta'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Ou continue com</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>

                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
                    message.includes('sucesso') || message.includes('realizado')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Plans */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-4 py-1.5">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Escolha seu Plano
              </h1>
              <p className="text-lg text-gray-600">
                Planos flexíveis para todas as necessidades
              </p>
            </div>

            <div className="space-y-4">
              {plans.map((plan, idx) => (
                <Card 
                  key={idx} 
                  className={`shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <plan.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            {plan.name}
                            {plan.popular && (
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                                Popular
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                        <div className="text-sm text-gray-600">{plan.period}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {plan.features.map((feature, featureIdx) => (
                        <div key={featureIdx} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
