"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  PawPrint,
  HeartPulse,
  MessageSquare,
  Award,
  Clock,
  Map,
  Search,
  ShoppingCart,
  User,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const WavyDivider = ({
  fillColorClass = "fill-background",
  position = "bottom",
}: {
  fillColorClass?: string;
  position?: "top" | "bottom";
}) => (
  <svg
    className={`w-full h-auto absolute left-0 z-10 ${position === "bottom" ? "bottom-0" : "top-0"}`}
    viewBox="0 0 1440 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    style={position === "top" ? { transform: "scaleY(-1)" } : {}}
  >
    <path
      d="M0 50 C 200 100, 400 0, 720 50 C 1040 100, 1240 0, 1440 50 V 120 H 0 Z"
      className={fillColorClass}
    />
  </svg>
);

const features = [
  {
    name: "Pets",
    description:
      "Registra y gestiona hasta 10 mascotas con detalles como nombre, especie, fecha de nacimiento y más.",
    icon: PawPrint,
    href: "#",
  },
  {
    name: "Health",
    description:
      "Controla vacunas y medicamentos con fechas, dosis y alertas automáticas por correo.",
    icon: HeartPulse,
    href: "#",
  },
  {
    name: "Forum",
    description:
      "Conéctate, comparte dudas y experiencias con otros amantes de mascotas en subforos temáticos.",
    icon: MessageSquare,
    href: "#",
  },
  {
    name: "Badges",
    description: "Gana insignias exclusivas por tu dedicación.",
    icon: Award,
    href: "#",
  },
  {
    name: "Timeline",
    description:
      "Documenta los momentos especiales de tu mascota con hasta cinco fotografías y descripciones cronológicas.",
    icon: Clock,
    href: "#",
  },
  {
    name: "Maps",
    description:
      "Encuentra veterinarios, peluquerías y otros servicios para mascotas cerca de tu ubicación.",
    icon: Map,
    href: "#",
  },
  {
    name: "Find",
    description:
      "Visualiza y reporta mascotas desaparecidas o encontradas en un mapa interactivo con detalles de contacto.",
    icon: Search,
    href: "#",
  },
  {
    name: "Market",
    description:
      "Publica y encuentra artículos para mascotas, nuevos o usados, con imágenes y detalles de contacto.",
    icon: ShoppingCart,
    href: "#",
  },
];

export default function HomePage() {
  return (
    <div className="-mt-24 min-h-screen bg-gray-100 overflow-x-visible">
      <div className="relative w-screen left-1/2 -translate-x-1/2 bg-background rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full bg-muted py-4 px-6 flex items-center justify-between"
        >
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </motion.header>

        {/* Hero */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-muted overflow-hidden">
          <div className="relative z-20 px-4 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md aspect-[4/3] md:order-2"
            >
              <Image
                src="/images/pethug.gif"
                alt="Mascotas abrazándose"
                width={700}
                height={700}
                className="rounded-lg object-contain w-full h-full"
              />
              <div className="absolute inset-0 bg-card/30 rounded-full blur-3xl opacity-50 z-0" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center md:text-left md:order-1"
            >
              <h2 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6 text-foreground">
                Tu Compañero para el Cuidado de Mascotas
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0">
                Gestiona la salud y el bienestar de tus mascotas de forma
                sencilla y organizada.
              </p>
              <div className="flex-col items-center justify-center md:justify-start gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explorar Funcionalidades
                </Button>
                <div className="flex items-center gap-4 mt-4">
                  <Button variant="outline" className="ml-4">
                    <Link href="/sign-up">Regístrate</Link>
                  </Button>
                  <Button variant="outline" className="ml-4">
                    <Link href="/sign-in">Iniciar Sesión</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          <WavyDivider fillColorClass="fill-background" position="bottom" />
        </section>

        {/* Sobre Nosotros */}
        <section className="w-full py-16 md:py-24 px-4 bg-background">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.div variants={itemFadeIn} className="col-span-2">
                <Image
                  src="/images/camera.jpg"
                  alt="Mascota mirando a la cámara"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </motion.div>
              <motion.div variants={itemFadeIn}>
                <Image
                  src="/images/pat.jpg"
                  alt="Mascota siendo acariciada"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </motion.div>
              <motion.div variants={itemFadeIn}>
                <Image
                  src="/images/hamster.jpg"
                  alt="Hámster"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                Sobre NombreApp
              </h2>
              <p className="text-muted-foreground mb-4">
                En NombreApp, entendemos el amor incondicional que sientes por
                tus compañeros peludos. Hemos creado una plataforma intuitiva y
                completa para ayudarte a gestionar cada aspecto de su vida,
                desde su salud hasta sus momentos más memorables.
              </p>
              <p className="text-muted-foreground mb-8">
                Nuestra misión es simplificar el cuidado de tus mascotas,
                ofreciéndote herramientas para mantener su historial médico,
                conectar con una comunidad vibrante y encontrar todo lo que
                necesitan en un solo lugar.
              </p>
              <Button className="px-8 py-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300">
                Conoce Más
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Nuestras Funcionalidades */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted relative overflow-hidden">
          <WavyDivider fillColorClass="fill-background" position="top" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-foreground">
              Nuestras Funcionalidades
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            >
              {features.map((feature) => (
                <motion.div key={feature.name} variants={itemFadeIn}>
                  <Link href={feature.href} className="block h-full">
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-background rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg border-2 border-border">
                      <div className="p-4 rounded-full mb-4">
                        <feature.icon className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <Button
              size="lg"
              className="px-8 py-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            >
              Ver Todas las Funcionalidades
            </Button>
          </div>
          <WavyDivider fillColorClass="fill-background" position="bottom" />
        </section>

        {/* Cómo Empezar */}
        <section className="w-full py-16 md:py-24 px-4 bg-background relative overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-foreground">
              Cómo Empezar
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            >
              <motion.div
                variants={itemFadeIn}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="bg-muted p-4 rounded-full mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  1. Crea tu Cuenta
                </h3>
                <p className="text-muted-foreground">
                  Regístrate en PetPal de forma rápida y sencilla para acceder a
                  todas las herramientas.
                </p>
              </motion.div>
              <motion.div
                variants={itemFadeIn}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="bg-muted p-4 rounded-full mb-4">
                  <PawPrint className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  2. Registra a tu Mascota
                </h3>
                <p className="text-muted-foreground">
                  Añade los perfiles de tus mascotas y designa a tu "mascota
                  activa".
                </p>
              </motion.div>
              <motion.div
                variants={itemFadeIn}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="bg-muted p-4 rounded-full mb-4">
                  <LayoutDashboard className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  3. Explora y Disfruta
                </h3>
                <p className="text-muted-foreground">
                  Comienza a usar el historial médico, el foro, el marketplace y
                  mucho más.
                </p>
              </motion.div>
            </motion.div>
            <Button
              size="lg"
              className="px-8 py-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link href="/sign-up">Regístrate</Link>
            </Button>
          </div>
        </section>

        {/* Contacto */}
        <section className="w-full py-16 md:py-24 px-4 bg-muted">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex items-center gap-4">
              <PawPrint className="h-12 w-12 text-primary" />
              <h2 className="text-4xl font-bold text-foreground">
                ¿Necesitas Ayuda? Contáctanos
              </h2>
            </div>
            <Button
              size="lg"
              className="px-8 py-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            >
              Contactar
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 px-4 bg-card text-card-foreground">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-4">CONTACTO</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    info@nombreapp.com
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (123) 456-7890
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Dirección 123
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-8">
            {"©"} {new Date().getFullYear()} NombreApp. Todos los derechos
            reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}
