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
  Globe
} from "lucide-react"
import { motion } from "framer-motion"

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
            <p className="text-lg opacity-90">
              Conectamos el futuro con tecnología de última generación
            </p>
          </motion.div>
        </div>
      </section>

      {/* Misión */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle className="text-3xl">Misión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Proporcionar soluciones tecnológicas y de telecomunicaciones de alta calidad 
                  que impulsen el crecimiento y la transformación digital de nuestros clientes, 
                  garantizando conectividad confiable, innovación constante y excelencia en el servicio.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Visión */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2 border-secondary">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-8 w-8 text-secondary" />
                  <CardTitle className="text-3xl">Visión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ser la empresa líder en soluciones tecnológicas y telecomunicaciones en Ecuador, 
                  reconocida por nuestra innovación, confiabilidad y compromiso con la excelencia, 
                  contribuyendo al desarrollo tecnológico del país y mejorando la calidad de vida 
                  de las comunidades que servimos.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Justificación */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="h-8 w-8 text-primary" />
                  <CardTitle className="text-3xl">Justificación</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  En un mundo cada vez más conectado y digitalizado, la necesidad de infraestructura 
                  tecnológica robusta y servicios de telecomunicaciones confiables es fundamental 
                  para el desarrollo económico y social.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  C&A FIBERTECH surge como respuesta a esta necesidad, ofreciendo soluciones 
                  integrales que permiten a empresas, instituciones y comunidades acceder a 
                  tecnologías de vanguardia, mejorando su competitividad y calidad de vida.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <History className="h-8 w-8 text-secondary" />
                  <CardTitle className="text-3xl">Historia</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  C&A FIBERTECH fue fundada con la visión de transformar el panorama tecnológico 
                  en Ecuador. Desde nuestros inicios, nos hemos especializado en proporcionar 
                  soluciones de telecomunicaciones y tecnología de clase mundial.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A lo largo de los años, hemos crecido significativamente, expandiendo nuestra 
                  infraestructura y ampliando nuestro portafolio de servicios para satisfacer las 
                  necesidades cambiantes de nuestros clientes, siempre manteniendo nuestro 
                  compromiso con la calidad y la innovación.
                </p>
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center border-t-4 border-t-primary">
                <CardHeader>
                  <Heart className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Compromiso</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Dedicación total con nuestros clientes y su éxito
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-secondary">
                <CardHeader>
                  <Zap className="h-10 w-10 text-secondary mx-auto mb-2" />
                  <CardTitle>Innovación</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Búsqueda constante de nuevas soluciones y tecnologías
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-primary">
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Confianza</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Transparencia y honestidad en todas nuestras relaciones
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-t-4 border-t-secondary">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-secondary mx-auto mb-2" />
                  <CardTitle>Excelencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Calidad superior en cada proyecto y servicio
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

