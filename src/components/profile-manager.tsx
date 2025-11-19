'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  Plus,
  X,
  Save,
  Edit,
  Camera
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'

interface ProfileManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileManager({ open, onOpenChange }: ProfileManagerProps) {
  const { user, profile, updateProfile } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    company: profile?.company || '',
    role: profile?.role || '',
    skills: profile?.skills || [],
    social_links: profile?.social_links || {}
  })
  const [newSkill, setNewSkill] = useState('')

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setIsEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    })
  }

  const updateSocialLink = (platform: string, url: string) => {
    setFormData({
      ...formData,
      social_links: {
        ...formData.social_links,
        [platform]: url
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Meu Perfil
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
          </DialogTitle>
          <DialogDescription>
            Gerencie suas informações pessoais e profissionais
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {(formData.full_name || user?.email)?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <Label htmlFor="full_name">Nome Completo</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Seu nome completo"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{formData.full_name || 'Não informado'}</p>
                    )}
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Biografia</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.bio || 'Nenhuma biografia adicionada'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  {isEditing ? (
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="Nome da empresa"
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.company || 'Não informado'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="role">Cargo</Label>
                  {isEditing ? (
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="Seu cargo atual"
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.role || 'Não informado'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Habilidades</CardTitle>
              <CardDescription>
                Adicione suas principais habilidades e competências
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-sm text-gray-500">Nenhuma habilidade adicionada</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Digite uma habilidade"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links Sociais</CardTitle>
              <CardDescription>
                Conecte suas redes sociais e perfis profissionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/usuario' },
                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/usuario' },
                { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/usuario' },
                { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://meusite.com' }
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <Label htmlFor={key}>{label}</Label>
                    {isEditing ? (
                      <Input
                        id={key}
                        value={formData.social_links[key] || ''}
                        onChange={(e) => updateSocialLink(key, e.target.value)}
                        placeholder={placeholder}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.social_links[key] ? (
                          <a 
                            href={formData.social_links[key]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {formData.social_links[key]}
                          </a>
                        ) : (
                          'Não informado'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas do Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-500">Projetos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-500">Metas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">0</p>
                  <p className="text-sm text-gray-500">Tarefas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-500">Colaborações</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}