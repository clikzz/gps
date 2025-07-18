"use client"

import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PawPrint } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage, type Message } from "@/components/form-message"
import { forgotPasswordAction } from "@/app/actions"

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

export default function ForgotPasswordForm() {
  const params = useSearchParams()
  const raw = params.get("message")
  let message: Message | undefined
  if (raw) {
    try { message = JSON.parse(raw) as Message } catch { message = { message: raw } }
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
        className="relative z-10 w-full max-w-md bg-background rounded-xl shadow-2xl overflow-hidden p-8 md:p-12" // Adjusted max-w and padding
      >
        <div className="text-center mb-8">
          <motion.div initial="hidden" animate="visible" variants={formItemVariants}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <PawPrint className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">NombreApp</h1>
            </div>
          </motion.div>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={formItemVariants}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Ingresa tu email para restablecer tu contraseña
          </motion.p>
        </div>
        <form action={forgotPasswordAction} className="flex flex-col gap-4">
          <motion.div initial="hidden" animate="visible" variants={formItemVariants} transition={{ delay: 0.2 }}>
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input id="email" name="email" type="email" placeholder="Email" required aria-required="true" />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={formItemVariants} transition={{ delay: 0.3 }}>
            <SubmitButton formAction={forgotPasswordAction} pendingText="Enviando..." className="w-full py-2.5 text-lg">
              Restablecer contraseña
            </SubmitButton>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={formItemVariants} transition={{ delay: 0.4 }}>
            <FormMessage message={message ?? { message: "" }} />
          </motion.div>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={formItemVariants}
            transition={{ delay: 0.5 }}
            className="text-sm text-center text-muted-foreground mt-4"
          >
            ¿Ya tienes una cuenta?{" "}
            <Link
              className="text-primary font-medium underline hover:text-primary/80 transition-colors"
              href="/sign-in"
            >
              Inicia sesión
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  )
}
