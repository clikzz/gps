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
import { MoreHorizontal, Shield, UserX, Clock, Ban, MessageSquare } from "lucide-react"
import { useUserProfile } from "@/stores/userProfile"
import { Role, UserStatus } from ".prisma/client/default"
import Link from "next/link"
import { formatDateLabel } from "@/lib/date"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
  if (messageCount >= 15) return "Cachorro Activo"
  if (messageCount >= 8) return "Gatito Curioso"
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
        comparison = (a.name ?? "").localeCompare(b.name ?? "")
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

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast.error("Debe proporcionar un motivo para el baneo")
      return
    }
    try {
      await fetch("/api/forum/users/status", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          status: "BANNED",
          suspensionReason: banReason,
        }),
      })
      setUserList((u) => u.map((x) => (x.id === selectedUser.id ? { ...x, status: UserStatus.BANNED } : x)))
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
    const until = new Date(`${suspendUntilDate}T${suspendUntilTime}`)
    if (!selectedUser || !suspendReason.trim()) {
      toast.error("Debe proporcionar un motivo para la suspensión")
      return
    }
    try {
      if (!suspendUntilDate || !suspendUntilTime) {
        toast.error("Debe proporcionar fecha y hora de fin de suspensión")
        return
      }
      await fetch("/api/forum/users/status", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          status: "SUSPENDED",
          suspensionReason: suspendReason,
          suspensionUntil: until.toISOString(),
        }),
      })
      setUserList((u) => u.map((x) => (x.id === selectedUser.id ? { ...x, status: UserStatus.SUSPENDED } : x)))
      toast.success(
        `${selectedUser.name} ha sido suspendido hasta ${formatDateLabel(until.toISOString())}. Motivo: ${suspendReason}`,
      )
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
      setUserList((list) => list.map((u) => (u.id === user.id ? { ...u, role: Role.MODERATOR } : u)))
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
      setUserList((list) => list.map((u) => (u.id === user.id ? { ...u, role: Role.USER } : u)))
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id, status: "ACTIVE" }),
      })
      setUserList((u) => u.map((x) => (x.id === user.id ? { ...x, status: UserStatus.ACTIVE } : x)))
      toast.success(`${user.name} ha sido desbaneado.`)
    } catch (e: any) {
      toast.error(e.message || "Error al desbanear")
    }
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <Card className="mb-6 bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-xl sm:text-2xl font-bold text-primary">Búsqueda de usuarios</CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground px-2">
            Elige el grupo de usuarios y organízalos por nombre o por el número de respuestas en orden ascendente o
            descendente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="user-group" className="text-sm font-medium">
                Grupo de usuarios
              </Label>
              <Select value={userGroup} onValueChange={setUserGroup}>
                <SelectTrigger id="user-group" className="bg-background">
                  <SelectValue placeholder="Seleccionar grupo" />
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
                <Label htmlFor="status-filter" className="text-sm font-medium">
                  Estado
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="bg-background">
                    <SelectValue placeholder="Seleccionar estado" />
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
              <Label htmlFor="order-by" className="text-sm font-medium">
                Ordenar por
              </Label>
              <Select value={orderBy} onValueChange={setOrderBy}>
                <SelectTrigger id="order-by" className="bg-background">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="username">Nombre de usuario (alias)</SelectItem>
                  <SelectItem value="messages">Número de mensajes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-criteria" className="text-sm font-medium">
                Criterio de orden
              </Label>
              <Select value={orderCriteria} onValueChange={setOrderCriteria}>
                <SelectTrigger id="order-criteria" className="bg-background">
                  <SelectValue placeholder="Criterio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascendente</SelectItem>
                  <SelectItem value="desc">Descendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center mb-6">
        <Pagination>
          <PaginationContent className="flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }}
                className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} text-xs sm:text-sm`}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true
                if (page === 1 || page === totalPages) return true
                if (Math.abs(page - currentPage) <= 1) return true
                return false
              })
              .map((page, index, array) => {
                const showEllipsis = index > 0 && page - array[index - 1] > 1
                return (
                  <div key={page} className="flex items-center">
                    {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        className="text-xs sm:text-sm"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </div>
                )
              })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }}
                className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""} text-xs sm:text-sm`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Card className="bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Miembros</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] text-foreground">Nombre de usuario</TableHead>
                  <TableHead className="text-foreground">Título</TableHead>
                  {isModerator && <TableHead className="text-foreground">Estado</TableHead>}
                  <TableHead className="text-right text-foreground">Mensajes</TableHead>
                  {isModerator && <TableHead className="text-right text-foreground">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-accent/10 transition-colors">
                    <TableCell className="font-semibold">
                      <Link href={`/forum/user/${user.id}`} className="text-sm font-medium hover:underline">
                        <span className="text-accent font-semibold">{user.name}</span>
                        <span className="text-gray-400 font-semibold"> #{user.tag}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="hover:underline text-xs font-semibold text-destructive">
                      {getUserTitle(user.menssageCount)}
                    </TableCell>
                    {isModerator && (
                      <TableCell>
                        {user.status === UserStatus.ACTIVE && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-destructive-foreground">
                            Activo
                          </span>
                        )}
                        {user.status === UserStatus.SUSPENDED && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-destructive-foreground">
                            Suspendido
                          </span>
                        )}
                        {user.status === UserStatus.BANNED && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                            Baneado
                          </span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-right text-foreground">{user.menssageCount}</TableCell>
                    {isModerator && (
                      <TableCell className="text-right">
                        {user.role !== Role.ADMIN && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menú</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
                              {user.status === UserStatus.ACTIVE && (
                                <>
                                  <DropdownMenuItem
                                    onSelect={() => openSuspendDialog(user)}
                                    className="hover:bg-accent/50"
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Suspender temporalmente
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onSelect={() => openBanDialog(user)}
                                    className="hover:bg-destructive/50"
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Banear permanentemente
                                  </DropdownMenuItem>
                                </>
                              )}
                              {user.status !== UserStatus.ACTIVE && (
                                <DropdownMenuItem onSelect={() => unbanUser(user)} className="hover:bg-primary/50">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Desbanear
                                </DropdownMenuItem>
                              )}
                              {isAdmin && (
                                <>
                                  {user.role === Role.USER && (
                                    <DropdownMenuItem
                                      onSelect={() => handlePromoteToModerator(user)}
                                      className="hover:bg-primary/50"
                                    >
                                      <Shield className="h-4 w-4 mr-2" />
                                      Promover a moderador
                                    </DropdownMenuItem>
                                  )}
                                  {user.role === Role.MODERATOR && (
                                    <DropdownMenuItem
                                      onSelect={() => handleRevokeModerator(user)}
                                      className="hover:bg-destructive/50"
                                    >
                                      <UserX className="h-4 w-4 mr-2" />
                                      Revocar moderador
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3 p-4">
            {paginatedUsers.map((user) => (
              <Card key={user.id} className="p-4 hover:bg-accent/10 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link href={`/forum/user/${user.id}`} className="font-medium hover:underline block">
                        <span className="text-accent text-base font-semibold">{user.name}</span>
                        <span className="text-gray-400 text-sm font-semibold"> #{user.tag}</span>
                      </Link>
                      <p className="text-xs font-semibold text-destructive mt-1">{getUserTitle(user.menssageCount)}</p>
                    </div>

                    {isModerator && user.role !== Role.ADMIN && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
                          {user.status === UserStatus.ACTIVE && (
                            <>
                              <DropdownMenuItem onSelect={() => openSuspendDialog(user)} className="hover:bg-accent/50">
                                <Clock className="h-4 w-4 mr-2" />
                                Suspender temporalmente
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => openBanDialog(user)}
                                className="hover:bg-destructive/50"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Banear permanentemente
                              </DropdownMenuItem>
                            </>
                          )}
                          {user.status !== UserStatus.ACTIVE && (
                            <DropdownMenuItem onSelect={() => unbanUser(user)} className="hover:bg-primary/50">
                              <UserX className="h-4 w-4 mr-2" />
                              Desbanear
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <>
                              {user.role === Role.USER && (
                                <DropdownMenuItem
                                  onSelect={() => handlePromoteToModerator(user)}
                                  className="hover:bg-primary/50"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Promover a moderador
                                </DropdownMenuItem>
                              )}
                              {user.role === Role.MODERATOR && (
                                <DropdownMenuItem
                                  onSelect={() => handleRevokeModerator(user)}
                                  className="hover:bg-destructive/50"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Revocar moderador
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{user.menssageCount}</span>
                        <span className="text-xs text-muted-foreground">mensajes</span>
                      </div>
                    </div>

                    {isModerator && (
                      <div>
                        {user.status === UserStatus.ACTIVE && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-destructive-foreground">
                            Activo
                          </span>
                        )}
                        {user.status === UserStatus.SUSPENDED && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-destructive-foreground">
                            Suspendido
                          </span>
                        )}
                        {user.status === UserStatus.BANNED && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                            Baneado
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="bg-card text-card-foreground w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Banear usuario permanentemente</DialogTitle>
            <DialogDescription className="text-sm">
              Está a punto de banear permanentemente a <strong>{selectedUser?.name}</strong>. Esta acción impedirá que
              el usuario acceda al foro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ban-reason" className="text-sm font-medium">
                Motivo del baneo *
              </Label>
              <Textarea
                id="ban-reason"
                placeholder="Explique el motivo del baneo..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
                className="bg-background text-foreground border-input text-sm"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setBanDialogOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleBanUser} className="w-full sm:w-auto">
              Banear permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="bg-card text-card-foreground w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Suspender usuario temporalmente</DialogTitle>
            <DialogDescription className="text-sm">
              Está a punto de suspender temporalmente a <strong>{selectedUser?.name}</strong>. El usuario no podrá
              acceder al foro durante el período de suspensión.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason" className="text-sm font-medium">
                Motivo de la suspensión
              </Label>
              <Textarea
                id="suspend-reason"
                placeholder="Explique el motivo de la suspensión..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={4}
                className="bg-background text-foreground border-input text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="suspend-date" className="text-sm font-medium">
                  Fecha de fin
                </Label>
                <input
                  id="suspend-date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={suspendUntilDate}
                  onChange={(e) => setSuspendUntilDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suspend-time" className="text-sm font-medium">
                  Hora de fin
                </Label>
                <input
                  id="suspend-time"
                  type="time"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={suspendUntilTime}
                  onChange={(e) => setSuspendUntilTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button onClick={handleSuspendUser} className="w-full sm:w-auto">
              Suspender temporalmente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
