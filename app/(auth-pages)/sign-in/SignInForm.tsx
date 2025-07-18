"use client"

import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { PawPrint } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage, type Message } from "@/components/form-message"
import { signInAction } from "@/app/actions"

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
}

const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const backgroundShapeVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: 0 },
  visible: { opacity: 1, scale: 1, rotate: 15, transition: { duration: 1.2, ease: "easeOut" } },
}

export default function SignInForm() {
  const params = useSearchParams()
  const raw = params.get("message")
  let message: Message | undefined
  if (raw) {
    try {
      message = JSON.parse(raw) as Message
    } catch {
      message = { message: raw }
    }
  }

    return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={backgroundShapeVariants}
        className="absolute top-0 left-0 w-48 h-48 bg-primary rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.5, rotate: 0 },
          visible: { opacity: 1, scale: 1, rotate: -15, transition: { duration: 1.2, ease: "easeOut", delay: 0.2 } },
        }}
        className="absolute bottom-0 right-0 w-64 h-32 bg-primary rounded-full opacity-20 translate-x-1/2 translate-y-1/2 skew-y-12"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="relative z-10 w-full max-w-4xl bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <motion.div initial="hidden" animate="visible" variants={formItemVariants}>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <PawPrint className="h-10 w-10 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Iniciar Sesión</h1>
              </div>
            </motion.div>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Inicia sesión para continuar
            </motion.p>
          </div>

          <form action={signInAction} className="flex flex-col gap-4">
            <motion.div initial="hidden" animate="visible" variants={formItemVariants} transition={{ delay: 0.2 }}>
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input name="email" placeholder="correo@ejemplo.com" type="email" required />
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={formItemVariants} transition={{ delay: 0.3 }}>
              <Label htmlFor="password" className="sr-only">
                Contraseña
              </Label>
              <Input type="password" name="password" placeholder="Contraseña" required />
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor="remember" className="text-muted-foreground">
                  Recordarme
                </Label>
              </div>
              <Link className="text-primary underline hover:text-primary/80 transition-colors" href="/forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={formItemVariants} transition={{ delay: 0.5 }}>
              <SubmitButton pendingText="Iniciando sesión..." className="w-full py-2.5 text-lg">
                Iniciar sesión
              </SubmitButton>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={formItemVariants} transition={{ delay: 0.6 }}>
              <FormMessage message={message ?? { message: "" }} />
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={formItemVariants}
              transition={{ delay: 0.7 }}
              className="text-sm text-center text-muted-foreground mt-4"
            >
              ¿No tienes cuenta?{" "}
              <Link
                className="text-primary font-medium underline hover:text-primary/80 transition-colors"
                href="/sign-up"
              >
                Regístrate
              </Link>
            </motion.p>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-primary flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="relative w-full h-full max-h-[400px] md:max-h-full aspect-square md:aspect-auto"
          >
            <Image
              src="/images/hamster.jpg" 
              alt="Mascota amigable"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}