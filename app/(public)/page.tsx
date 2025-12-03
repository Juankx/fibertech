"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target, 
  Eye, 
  Lightbulb, 
  History, 
  CheckCircle, 
  Wrench, 
  Heart,
  Zap,
  Shield,
  Users,
  Globe,
  TrendingUp,
  Award,
  Network,
  Briefcase
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              C&A FIBERTECH
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Soluciones Tecnológicas y Telecomunicaciones de Vanguardia
            </p>
            <p className="text-lg opacity-90 mb-8">
              Conectamos el futuro con tecnología de última generación
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contacto">
                <Button variant="secondary" size="lg">
                  Contáctanos
                </Button>
              </Link>
              <Link href="/trabaja-con-nosotros">
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Trabaja con Nosotros
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nuestra Identidad Corporativa */}
      <section className="py-12 bg-white border-b-2 border-primary">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Nuestra Identidad Corporativa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprometidos con la excelencia y la innovación en telecomunicaciones
            </p>
          </motion.div>
        </div>
      </section>

      {/* ¿Quiénes Somos? */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                ¿Quiénes Somos?
              </h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                C&A FIBERTECH es una empresa líder en soluciones tecnológicas y telecomunicaciones 
                en Ecuador. Desde nuestros inicios, nos hemos especializado en proporcionar 
                servicios de conectividad de clase mundial y soluciones tecnológicas innovadoras 
                que impulsan el desarrollo del país.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Trabajamos incansablemente para conectar a los ecuatorianos, invirtiendo en 
                infraestructura de última generación y manteniendo los más altos estándares de 
                calidad. Nuestro compromiso es brindar la mejor experiencia de servicio a través 
                de soluciones avanzadas de comunicación y tecnología de información.
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center border-t-4 border-t-primary">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">+50</div>
                  <p className="text-sm text-muted-foreground">Colaboradores</p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-secondary">
                <CardContent className="pt-6">
                  <Network className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-secondary mb-2">+200</div>
                  <p className="text-sm text-muted-foreground">Proyectos Completados</p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-primary">
                <CardContent className="pt-6">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">85%</div>
                  <p className="text-sm text-muted-foreground">Cobertura Nacional</p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-secondary">
                <CardContent className="pt-6">
                  <Briefcase className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-secondary mb-2">+500</div>
                  <p className="text-sm text-muted-foreground">Clientes Satisfechos</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Misión */}
              <motion.div {...fadeInUp}>
                <Card className="h-full border-2 border-primary shadow-lg">
                  <CardHeader className="bg-primary text-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8" />
                      <CardTitle className="text-2xl md:text-3xl">Misión</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Brindamos la mejor experiencia de servicio a través de las más avanzadas 
                      soluciones de comunicación, tecnología de información y contenido digital 
                      para acelerar el desarrollo del Ecuador y promover la igualdad de oportunidades 
                      entre las personas.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Visión */}
              <motion.div {...fadeInUp}>
                <Card className="h-full border-2 border-secondary shadow-lg">
                  <CardHeader className="bg-secondary text-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="h-8 w-8" />
                      <CardTitle className="text-2xl md:text-3xl">Visión</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Consolidarnos como un agente de cambio al proporcionar servicios de conectividad 
                      y alta tecnología, preservando nuestro liderazgo en la industria de las 
                      telecomunicaciones y reafirmando nuestro compromiso con las personas para hacer 
                      un mundo más próspero para todos.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Compromiso con la Calidad */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2 border-primary shadow-lg">
              <CardHeader className="bg-primary text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8" />
                  <CardTitle className="text-2xl md:text-3xl">Compromiso con la Calidad</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  C&A FIBERTECH se compromete a ofrecer altos estándares de servicio y satisfacción 
                  a clientes internos y externos. Nuestro Sistema de Gestión de Calidad se basa en 
                  lineamientos alineados a un modelo de calidad mundial.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Estos estándares cumplen con Normas Internacionales ISO y nos permiten:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Ofrecer soluciones de conectividad, tecnologías de la información y soluciones digitales que satisfagan las necesidades de la población</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Contar con un equipo humano competente y comprometido con la innovación y el mejoramiento continuo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Brindar un servicio que cumpla con las expectativas de nuestros clientes en oportunidad y calidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Establecer la identificación y comprensión de las necesidades de nuestros clientes como un generador de mejora continua de nuestros productos y servicios</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Objetivos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">
              Objetivos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <CardTitle>Objetivo General</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Proporcionar soluciones tecnológicas y de telecomunicaciones de excelencia 
                    que impulsen la transformación digital y el crecimiento sostenible de nuestros clientes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                    <CardTitle>Objetivos Específicos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Expandir la cobertura de servicios de telecomunicaciones</li>
                    <li>• Innovar constantemente en soluciones tecnológicas</li>
                    <li>• Mantener los más altos estándares de calidad</li>
                    <li>• Fortalecer las relaciones con nuestros clientes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">
              Nuestros Servicios
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Infraestructura de Red</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Diseño, implementación y mantenimiento de redes de fibra óptica y 
                    infraestructura de telecomunicaciones.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Globe className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Conectividad</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Servicios de internet de alta velocidad, conexiones dedicadas y 
                    soluciones de conectividad empresarial.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Seguridad Informática</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Protección de datos, seguridad de redes y soluciones de ciberseguridad 
                    para empresas.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Wrench className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Soporte Técnico</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Asistencia técnica especializada, mantenimiento preventivo y 
                    resolución de incidencias 24/7.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Consultoría Tecnológica</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Asesoramiento estratégico en transformación digital y optimización 
                    de procesos tecnológicos.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Soluciones Cloud</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Migración a la nube, servicios cloud y soluciones de almacenamiento 
                    y procesamiento remoto.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Nuestros Valores
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Los valores de nuestra empresa representan la base de nuestra cultura, promueven 
                el esfuerzo y el cuidado de lo que hacemos, además que nos ayudan a darle un enfoque 
                claro y transparente a los objetivos en común.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center border-t-4 border-t-primary hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Heart className="h-12 w-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-xl">Sustentabilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compromiso con el desarrollo sostenible y el cuidado del medio ambiente
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-secondary hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-secondary mx-auto mb-3" />
                  <CardTitle className="text-xl">Desarrollo Humano</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Inversión en el crecimiento y bienestar de nuestro equipo y comunidad
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-primary hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-xl">Integridad</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Transparencia, honestidad y ética en todas nuestras acciones y relaciones
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-secondary hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="h-12 w-12 text-secondary mx-auto mb-3" />
                  <CardTitle className="text-xl">Innovación</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Búsqueda constante de nuevas soluciones y tecnologías de vanguardia
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-primary hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Heart className="h-12 w-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-xl">Experiencia del Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Enfoque en brindar la mejor experiencia en cada interacción
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-secondary hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-secondary mx-auto mb-3" />
                  <CardTitle className="text-xl">Eficiencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Optimización de procesos para maximizar resultados y minimizar recursos
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-primary hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-xl">Colaboración</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Trabajo en equipo y alianzas estratégicas para alcanzar objetivos comunes
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-secondary hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Award className="h-12 w-12 text-secondary mx-auto mb-3" />
                  <CardTitle className="text-xl">Excelencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Calidad superior y mejora continua en cada proyecto y servicio
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

