"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, UserX, Clock, Ban } from "lucide-react"
import { useUserProfile } from "@/stores/userProfile"
import { Role, UserStatus } from ".prisma/client/default";
import Link from "next/link"
import { formatDateLabel } from "@/lib/date"

export interface ForumUser {
  id: string
  name: string
  tag: number
  role: Role
  status: UserStatus
  menssageCount: number
}

interface MembersSearchProps {
  users: ForumUser[]
}

const getUserTitle = (messageCount: number): string => {
  if (messageCount >= 150) return "Líder de Manada"
  if (messageCount >= 100) return "Veterinario(a)"
  if (messageCount >= 50) return "Maullador(a) Senior"
  if (messageCount >= 25) return "Amante de Mascotas"
  if (messageCount >= 10) return "Cachorro Activo"
  if (messageCount >= 5) return "Gatito Curioso"
  return "Mascota Nueva"
}

export function MembersSearch({ users }: MembersSearchProps) {
  const [userGroup, setUserGroup] = useState("all")
  const [orderBy, setOrderBy] = useState("username")
  const [orderCriteria, setOrderCriteria] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [userList, setUserList] = useState(users)
  const [statusFilter, setStatusFilter] = useState("all")

  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ForumUser | null>(null)
  const [banReason, setBanReason] = useState("")
  const [suspendReason, setSuspendReason] = useState("")
  const [suspendUntilDate, setSuspendUntilDate] = useState("")
  const [suspendUntilTime, setSuspendUntilTime] = useState("")

  const itemsPerPage = 10
  const currentUser = useUserProfile((s) => s.user)
  const currentUserRole = currentUser?.role
  const currentUserId = currentUser?.id
  const isAdmin = currentUserRole === Role.ADMIN
  const isModerator = currentUserRole === Role.MODERATOR || isAdmin

  const filteredUsers = userList.filter((user) => {
    let groupMatch = true
    switch (userGroup) {
      case "admins":
        groupMatch = user.role === Role.ADMIN
        break
      case "moderators":
        groupMatch = user.role === Role.MODERATOR
        break
      case "members":
        groupMatch = user.role === Role.USER
        break
      default:
        groupMatch = true
    }

    // filtro por estado solo para moderadores/admins
    let statusMatch = true
    if (isModerator && statusFilter !== "all") {
      statusMatch = user.status === statusFilter
    }

    return groupMatch && statusMatch
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0

    switch (orderBy) {
      case "username":
        comparison = a.name.localeCompare(b.name)
        break
      case "messages":
        comparison = a.menssageCount - b.menssageCount
        break
    }

    return orderCriteria === "asc" ? comparison : -comparison
  })

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = () => {
    setCurrentPage(1)
    toast.success("Búsqueda actualizada")
  }


  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast.error("Debe proporcionar un motivo para el baneo")
      return
    }
    try {
      await fetch("/api/forum/users/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          status: "BANNED",
          suspensionReason: banReason
        }),
      })
      setUserList(u =>
        u.map(x => x.id === selectedUser.id ? { ...x, status: UserStatus.BANNED } : x)
      )
      toast.success(`${selectedUser.name} ha sido baneado. Motivo: ${banReason}`)
      setBanDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Error baneo")
    } finally {
      setBanReason("")
      setSelectedUser(null)
    }
  }

  const handleSuspendUser = async () => {
    const until = new Date(`${suspendUntilDate}T${suspendUntilTime}`);
    if (!selectedUser || !suspendReason.trim()) {
      toast.error("Debe proporcionar un motivo para la suspensión")
      return
    }
    try {
      if (!suspendUntilDate || !suspendUntilTime) {
        toast.error("Debe proporcionar fecha y hora de fin de suspensión");
        return;
      }

      await fetch("/api/forum/users/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          status: "SUSPENDED",
          suspensionReason: suspendReason,
          suspensionUntil: until.toISOString(),
        }),
      })
      setUserList(u =>
        u.map(x => x.id === selectedUser.id ? { ...x, status: UserStatus.SUSPENDED } : x)
      )
      toast.success(`${selectedUser.name} ha sido suspendido hasta ${formatDateLabel(until.toISOString())}. Motivo: ${suspendReason}`)
      setSuspendDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Error suspensión")
    } finally {
      setSuspendReason("")
      setSelectedUser(null)
      setSuspendUntilDate("")
      setSuspendUntilTime("")
    }
  }

  const handlePromoteToModerator = async (user: ForumUser) => {
    if (!isAdmin) {
      toast.error("Solo los administradores pueden designar moderadores")
      return
    }

    try {
      const res = await fetch("/api/forum/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetUserId: user.id,
          role: "MODERATOR",
        }),
      })

      if (res.status !== 204) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al promover moderador")
      }

      setUserList((list) =>
        list.map((u) =>
          u.id === user.id ? { ...u, role: Role.MODERATOR } : u
        )
      )
      toast.success(`${user.name} ha sido designado como moderador`)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleRevokeModerator = async (user: ForumUser) => {
    if (!isAdmin) {
      toast.error("Solo los administradores pueden revocar moderadores")
      return
    }

    try {
      const res = await fetch("/api/forum/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetUserId: user.id,
          role: "USER",
        }),
      })

      if (res.status !== 204) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al revocar moderador")
      }

      setUserList((list) =>
        list.map((u) =>
          u.id === user.id ? { ...u, role: Role.USER } : u
        )
      )
      toast.success(`Se han revocado los privilegios de moderador de ${user.name}`)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const openBanDialog = (user: ForumUser) => {
    setSelectedUser(user)
    setBanDialogOpen(true)
  }

  const openSuspendDialog = (user: ForumUser) => {
    setSelectedUser(user)
    setSuspendDialogOpen(true)
  }

  const unbanUser = async (user: ForumUser) => {
    try {
      await fetch("/api/forum/users/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id, status: "ACTIVE" })
      });
      setUserList(u =>
        u.map(x => x.id === user.id ? { ...x, status: UserStatus.ACTIVE } : x)
      );
      toast.success(`${user.name} ha sido desbaneado.`);
    } catch (e: any) {
      toast.error(e.message || "Error al desbanear");
    }
  };


  return (
    <div className="space-y-4">

      <div className="border rounded-lg p-4">
        <div className="text-center font-medium text-lg mb-4 p-3 border rounded-lg">Búsqueda de usuarios</div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Grupo de usuarios</Label>
            <Select value={userGroup} onValueChange={setUserGroup}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los usuarios</SelectItem>
                <SelectItem value="admins">Los administradores</SelectItem>
                <SelectItem value="moderators">Moderadores</SelectItem>
                <SelectItem value="members">Miembros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isModerator && (
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="suspended">Suspendidos</SelectItem>
                  <SelectItem value="banned">Baneados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Ordenar por</Label>
            <Select value={orderBy} onValueChange={setOrderBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="username">Nombre de usuario (alias)</SelectItem>
                <SelectItem value="messages">Número de mensajes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Criterio de orden</Label>
            <Select value={orderCriteria} onValueChange={setOrderCriteria}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascendente</SelectItem>
                <SelectItem value="desc">Descendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground mb-4">
          Elige el grupo de usuarios y organízalos por nombre o por el número de respuestas en orden ascendente o
          descendente.
        </div>

      </div>


      <div className="flex items-center gap-2 text-sm">
        <span>Páginas:</span>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-full border ${currentPage === page ? "border-2 font-medium" : "border"
              } hover:bg-accent`}
          >
            {page}
          </button>
        ))}
      </div>


      <div className="border rounded-lg overflow-hidden">
        <div className="p-3 font-medium border-b">Miembros</div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Nombre de usuario</th>
                <th className="text-left p-3">Título</th>
                {isModerator && <th className="text-left p-3">Estado</th>}
                <th className="text-right p-3">Mensajes</th>
                {isModerator && <th className="text-right p-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr key={user.id} className={index !== paginatedUsers.length - 1 ? "border-b" : ""}>
                  <td className="p-3">
                    <Link href={`/forum/user/${user.id}`} className="hover:underline">
                      {user.name}#{user.tag}
                    </Link>
                  </td>
                  <td className="p-3">{getUserTitle(user.menssageCount)}</td>
                  {isModerator && (
                    <td className="p-3">
                      {user.status === UserStatus.ACTIVE && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border">
                          Activo
                        </span>
                      )}
                      {user.status === UserStatus.SUSPENDED && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border">
                          Suspendido
                        </span>
                      )}
                      {user.status === UserStatus.BANNED && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border">
                          Baneado
                        </span>
                      )}
                    </td>
                  )}
                  <td className="p-3 text-right">{user.menssageCount}</td>
                  {isModerator && (
                    <td className="p-3 text-right">
                      {user.role !== Role.ADMIN && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.status === UserStatus.ACTIVE && (
                              <>
                                <DropdownMenuItem onClick={() => openSuspendDialog(user)}>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Suspender temporalmente
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openBanDialog(user)}>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Banear permanentemente
                                </DropdownMenuItem>
                              </>
                            )}

                            {user.status !== UserStatus.ACTIVE && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserList(userList.map((u) => (u.id === user.id ? { ...u, status: UserStatus.ACTIVE } : u)))
                                  toast.success(`${user.name} ha sido desbaneado`)
                                }}
                              >
                                <DropdownMenuItem onClick={() => unbanUser(user)}></DropdownMenuItem>
                                <UserX className="h-4 w-4 mr-2" />
                                Desbanear usuario
                              </DropdownMenuItem>
                            )}

                            {isAdmin && (
                              <>
                                {user.role === Role.USER && (
                                  <DropdownMenuItem onClick={() => handlePromoteToModerator(user)}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Promover a moderador
                                  </DropdownMenuItem>
                                )}

                                {user.role === Role.MODERATOR && (
                                  <DropdownMenuItem onClick={() => handleRevokeModerator(user)}>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Revocar moderador
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Banear usuario permanentemente</DialogTitle>
            <DialogDescription>
              Está a punto de banear permanentemente a <strong>{selectedUser?.name}</strong>. Esta acción impedirá
              que el usuario acceda al foro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Motivo del baneo *</Label>
              <Textarea
                id="ban-reason"
                placeholder="Explique el motivo del baneo..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleBanUser}>
              Banear permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspender usuario temporalmente</DialogTitle>
            <DialogDescription>
              Está a punto de suspender temporalmente a <strong>{selectedUser?.name}</strong>. El usuario no podrá
              acceder al foro durante el período de suspensión.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason">Motivo de la suspensión</Label>
              <Textarea
                id="suspend-reason"
                placeholder="Explique el motivo de la suspensión..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="suspend-date">Fecha de fin</Label>
                <input
                  id="suspend-date"
                  type="date"
                  className="w-full p-2 border rounded"
                  value={suspendUntilDate}
                  onChange={e => setSuspendUntilDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suspend-time">Hora de fin</Label>
                <input
                  id="suspend-time"
                  type="time"
                  className="w-full p-2 border rounded"
                  value={suspendUntilTime}
                  onChange={e => setSuspendUntilTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSuspendUser}>Suspender temporalmente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
