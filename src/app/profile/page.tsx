"use client"

import { useState, useEffect } from 'react'
import { Brain, User, Mail, Phone, Camera, Save, ArrowLeft, Settings, Bell, Shield, Palette, Globe, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { authService, userService, type User } from '@/lib/supabase'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [showPassword, setShowPassword] = useState(false)

  // Estados para configurações
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    projectUpdates: true,
    weeklyReports: true,
    theme: 'dark',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        // Simular dados do usuário baseado no auth
        const userData: User = {
          id: currentUser.id,
          name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Usuário',
          email: currentUser.email || '',
          phone: currentUser.user_metadata?.phone || '',
          role: 'user',
          status: 'active',
          created_at: currentUser.created_at || new Date().toISOString(),
          projects_count: 0,
          avatar: currentUser.user_metadata?.avatar_url,
          bio: currentUser.user_metadata?.bio || ''
        }
        setUser(userData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      setMessage('Erro ao carregar perfil do usuário')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setMessage('')

    try {
      const formData = new FormData(e.currentTarget)
      const updatedData = {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        bio: formData.get('bio') as string,
        avatar_url: user.avatar
      }

      // Simular atualização do perfil
      setUser(prev => prev ? { ...prev, ...updatedData } : null)
      setMessage('Perfil atualizado com sucesso!')
      setMessageType('success')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      setMessage('Erro ao atualizar perfil. Tente novamente.')
      setMessageType('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento das preferências
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Configurações salvas com sucesso!')
      setMessageType('success')
    } catch (error) {
      setMessage('Erro ao salvar configurações')
      setMessageType('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const formData = new FormData(e.currentTarget)
      const currentPassword = formData.get('currentPassword') as string
      const newPassword = formData.get('newPassword') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (newPassword !== confirmPassword) {
        setMessage('As senhas não coincidem')
        setMessageType('error')
        return
      }

      if (newPassword.length < 6) {
        setMessage('A nova senha deve ter pelo menos 6 caracteres')
        setMessageType('error')
        return
      }

      // Simular mudança de senha
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Senha alterada com sucesso!')
      setMessageType('success')
      
      // Limpar formulário
      e.currentTarget.reset()
    } catch (error) {
      setMessage('Erro ao alterar senha')
      setMessageType('error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-cyan-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  SyncMyMind
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-gray-400 text-xs">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
          <p className="text-gray-400">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className={`mb-6 ${messageType === 'success' ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
            <AlertDescription className={messageType === 'success' ? 'text-green-400' : 'text-red-400'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-slate-700">
              <Settings className="h-4 w-4 mr-2" />
              Preferências
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Informações Pessoais</CardTitle>
                <CardDescription className="text-gray-400">
                  Atualize suas informações básicas de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user?.name?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{user?.name}</h3>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                      <Badge className="mt-1 bg-green-900/20 text-green-400 border-green-700">
                        {user?.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={user?.name}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="bg-slate-700/50 border-slate-600 text-gray-400"
                      />
                      <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={user?.phone}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-300">Função</Label>
                      <Select defaultValue={user?.role} disabled>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-gray-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="manager">Gerente</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-300">Biografia</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={user?.bio}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Conte um pouco sobre você..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Segurança da Conta</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-gray-300">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          className="bg-slate-700 border-slate-600 text-white pr-10"
                          placeholder="Digite sua senha atual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-300">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Digite sua nova senha"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Confirme sua nova senha"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      {isSaving ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-700">
                  <h3 className="text-white font-medium mb-4">Informações da Conta</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Conta criada em:</span>
                      <span className="text-white">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Último login:</span>
                      <span className="text-white">
                        {user?.last_login ? new Date(user.last_login).toLocaleDateString('pt-BR') : 'Primeiro acesso'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Projetos criados:</span>
                      <span className="text-white">{user?.projects_count || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações de Notificação</CardTitle>
                <CardDescription className="text-gray-400">
                  Escolha como e quando você quer receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Notificações por Email</Label>
                      <p className="text-sm text-gray-400">Receba atualizações importantes por email</p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Notificações Push</Label>
                      <p className="text-sm text-gray-400">Receba notificações no navegador</p>
                    </div>
                    <Switch
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Atualizações de Projetos</Label>
                      <p className="text-sm text-gray-400">Notificações sobre mudanças nos seus projetos</p>
                    </div>
                    <Switch
                      checked={preferences.projectUpdates}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, projectUpdates: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Relatórios Semanais</Label>
                      <p className="text-sm text-gray-400">Resumo semanal dos seus projetos</p>
                    </div>
                    <Switch
                      checked={preferences.weeklyReports}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, weeklyReports: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Preferências do Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Personalize sua experiência no SyncMyMind
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Tema</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) => 
                        setPreferences(prev => ({ ...prev, theme: value }))
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Idioma</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => 
                        setPreferences(prev => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Fuso Horário</Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) => 
                        setPreferences(prev => ({ ...prev, timezone: value }))
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Preferências'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}