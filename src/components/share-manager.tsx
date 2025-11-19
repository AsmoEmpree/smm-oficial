'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Share2, 
  Users, 
  Mail, 
  Copy, 
  Check, 
  Clock, 
  Eye, 
  Edit, 
  Shield,
  Link,
  Send,
  UserPlus,
  Search,
  X
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'

interface ShareManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareManager({ open, onOpenChange }: ShareManagerProps) {
  const { projects, currentProject } = useAppStore()
  const [selectedProject, setSelectedProject] = useState(currentProject?.id || '')
  const [shareType, setShareType] = useState<'link' | 'email'>('link')
  const [permission, setPermission] = useState<'view' | 'edit' | 'admin'>('view')
  const [expiry, setExpiry] = useState<'1day' | '7days' | '30days' | 'never'>('7days')
  const [emailList, setEmailList] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [searchUsers, setSearchUsers] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Mock users for demonstration
  const mockUsers = [
    { id: '1', name: 'Ana Silva', email: 'ana@exemplo.com', avatar: '' },
    { id: '2', name: 'Carlos Santos', email: 'carlos@exemplo.com', avatar: '' },
    { id: '3', name: 'Maria Oliveira', email: 'maria@exemplo.com', avatar: '' },
    { id: '4', name: 'João Costa', email: 'joao@exemplo.com', avatar: '' },
  ]

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUsers.toLowerCase())
  )

  const addEmail = () => {
    if (newEmail.trim() && !emailList.includes(newEmail.trim())) {
      setEmailList([...emailList, newEmail.trim()])
      setNewEmail('')
    }
  }

  const removeEmail = (email: string) => {
    setEmailList(emailList.filter(e => e !== email))
  }

  const generateShareLink = () => {
    const project = projects.find(p => p.id === selectedProject)
    if (!project) return

    // Generate a mock share link
    const token = Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/shared/${token}`
    setGeneratedLink(link)
    toast.success('Link de compartilhamento gerado!')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Link copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  const sendInvitations = () => {
    const project = projects.find(p => p.id === selectedProject)
    if (!project) return

    const recipients = shareType === 'email' ? emailList : selectedUsers
    if (recipients.length === 0) {
      toast.error('Adicione pelo menos um destinatário')
      return
    }

    // Mock sending invitations
    toast.success(`Convites enviados para ${recipients.length} pessoa(s)!`)
    setEmailList([])
    setSelectedUsers([])
  }

  const getPermissionIcon = (perm: string) => {
    switch (perm) {
      case 'view': return <Eye className="h-4 w-4" />
      case 'edit': return <Edit className="h-4 w-4" />
      case 'admin': return <Shield className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const getPermissionColor = (perm: string) => {
    switch (perm) {
      case 'view': return 'bg-blue-100 text-blue-800'
      case 'edit': return 'bg-yellow-100 text-yellow-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getExpiryText = (exp: string) => {
    switch (exp) {
      case '1day': return '1 dia'
      case '7days': return '7 dias'
      case '30days': return '30 dias'
      case 'never': return 'Nunca'
      default: return '7 dias'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhar Projeto
          </DialogTitle>
          <DialogDescription>
            Compartilhe seus projetos com sua equipe de forma segura
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Project Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selecionar Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center space-x-2">
                          <span>{project.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Share Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tipo de Compartilhamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={shareType === 'link' ? 'default' : 'outline'}
                    onClick={() => setShareType('link')}
                    className="h-20 flex-col"
                  >
                    <Link className="h-6 w-6 mb-2" />
                    Link Público
                  </Button>
                  <Button
                    variant={shareType === 'email' ? 'default' : 'outline'}
                    onClick={() => setShareType('email')}
                    className="h-20 flex-col"
                  >
                    <Mail className="h-6 w-6 mb-2" />
                    Convite por Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Permissões</CardTitle>
                <CardDescription>
                  Defina o nível de acesso dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { value: 'view', label: 'Visualizar', desc: 'Apenas visualizar o projeto' },
                  { value: 'edit', label: 'Editar', desc: 'Visualizar e editar conteúdo' },
                  { value: 'admin', label: 'Administrar', desc: 'Controle total do projeto' }
                ].map((perm) => (
                  <div
                    key={perm.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      permission === perm.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setPermission(perm.value as any)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getPermissionColor(perm.value)}`}>
                        {getPermissionIcon(perm.value)}
                      </div>
                      <div>
                        <p className="font-medium">{perm.label}</p>
                        <p className="text-sm text-gray-500">{perm.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Expiry (only for links) */}
            {shareType === 'link' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Expiração do Link
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={expiry} onValueChange={(value: any) => setExpiry(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1day">1 dia</SelectItem>
                      <SelectItem value="7days">7 dias</SelectItem>
                      <SelectItem value="30days">30 dias</SelectItem>
                      <SelectItem value="never">Nunca expira</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Recipients */}
          <div className="space-y-6">
            {shareType === 'link' ? (
              /* Link Generation */
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gerar Link</CardTitle>
                  <CardDescription>
                    Crie um link seguro para compartilhar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={generateShareLink} 
                    className="w-full"
                    disabled={!selectedProject}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Gerar Link de Compartilhamento
                  </Button>

                  {generatedLink && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Input value={generatedLink} readOnly />
                        <Button onClick={copyToClipboard} size="sm">
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span>Permissão:</span>
                          <Badge className={getPermissionColor(permission)}>
                            {getPermissionIcon(permission)}
                            <span className="ml-1 capitalize">{permission}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span>Expira em:</span>
                          <span className="font-medium">{getExpiryText(expiry)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Email Invitations */
              <>
                {/* User Search */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Buscar Usuários</CardTitle>
                    <CardDescription>
                      Encontre pessoas para convidar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Buscar por nome ou email..."
                        value={searchUsers}
                        onChange={(e) => setSearchUsers(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => {
                            if (selectedUsers.includes(user.email)) {
                              setSelectedUsers(selectedUsers.filter(email => email !== user.email))
                            } else {
                              setSelectedUsers([...selectedUsers, user.email])
                            }
                          }}
                        >
                          <Checkbox 
                            checked={selectedUsers.includes(user.email)}
                            onChange={() => {}}
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Manual Email Entry */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Adicionar por Email</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="email@exemplo.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                      />
                      <Button onClick={addEmail} size="sm">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Selected Recipients */}
                    <div className="space-y-2">
                      <Label>Destinatários Selecionados:</Label>
                      <div className="flex flex-wrap gap-2">
                        {[...emailList, ...selectedUsers].map((email, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {email}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => {
                                if (emailList.includes(email)) {
                                  removeEmail(email)
                                } else {
                                  setSelectedUsers(selectedUsers.filter(e => e !== email))
                                }
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      {[...emailList, ...selectedUsers].length === 0 && (
                        <p className="text-sm text-gray-500">Nenhum destinatário selecionado</p>
                      )}
                    </div>

                    <Button 
                      onClick={sendInvitations} 
                      className="w-full"
                      disabled={!selectedProject || ([...emailList, ...selectedUsers].length === 0)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Convites ({[...emailList, ...selectedUsers].length})
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Recent Shares */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compartilhamentos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Share2 className="h-8 w-8 mx-auto mb-2" />
                  <p>Nenhum compartilhamento ainda</p>
                  <p className="text-sm">Seus compartilhamentos aparecerão aqui</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}