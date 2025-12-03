# C&A FIBERTECH - Proyecto Web Corporativo

Aplicación web corporativa para C&A FIBERTECH, empresa de soluciones tecnológicas y telecomunicaciones, desarrollada con Next.js 14, TypeScript, Prisma y PostgreSQL.

## 🚀 Características

- **Frontend Moderno**: Next.js 14 con App Router, TypeScript, TailwindCSS y ShadCN/UI
- **Backend Integrado**: API Routes de Next.js con Prisma ORM
- **Base de Datos**: PostgreSQL con Prisma
- **Autenticación**: NextAuth con credenciales locales
- **Dashboards**: Panel de usuario y administrador
- **Gestión de CVs**: Sistema de postulaciones con almacenamiento local
- **Formularios**: Contacto y postulación con validación

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio** (o navegar al directorio del proyecto)

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/fibertech?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui-genera-una-clave-segura"
```

4. **Configurar la base de datos**:
```bash
# Generar el cliente Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push
```

5. **Crear un usuario administrador inicial** (opcional):
Puedes crear un usuario administrador directamente en la base de datos o usar el dashboard después de iniciar sesión.

Ejemplo con SQL:
```sql
-- Nota: La contraseña debe estar hasheada con bcrypt
-- Usa un script o la interfaz de administración para crear el primer admin
```

O usa Prisma Studio:
```bash
npm run db:studio
```

## 🚀 Ejecución

**Modo desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

**Modo producción**:
```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
/Fibertech
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (public)/          # Rutas públicas
│   ├── dashboard/         # Dashboards protegidos
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── ui/               # Componentes ShadCN/UI
│   └── dashboard/         # Componentes de dashboard
├── lib/                   # Utilidades
├── prisma/                # Schema y migraciones
├── public/                # Assets estáticos
├── uploads/               # CVs subidos (gitignored)
└── types/                 # TypeScript types
```

## 🎨 Paleta de Colores Corporativos

- **Azul principal**: `#004A99`
- **Azul claro**: `#1E90FF`
- **Gris claro**: `#E6E7E8`
- **Gris medio**: `#B7B9BB`
- **Blanco**: `#FFFFFF`
- **Negro suave**: `#2B2B2B`

## 🔐 Autenticación

- Los usuarios **NO** pueden registrarse públicamente
- Solo los administradores pueden crear usuarios desde el dashboard
- El sistema usa NextAuth con credenciales locales
- Las contraseñas se hashean con bcrypt

## 📝 Módulos Principales

### Páginas Públicas
- **Home** (`/`): Información institucional (Misión, Visión, Historia, etc.)
- **Contáctanos** (`/contacto`): Formulario de contacto
- **Trabaja con Nosotros** (`/trabaja-con-nosotros`): Formulario para enviar CV

### Autenticación
- **Login** (`/login`): Inicio de sesión

### Dashboard Usuario
- **Dashboard** (`/dashboard/user`): Panel principal con estadísticas y gráficos
- **Postulaciones** (`/dashboard/user/postulaciones`): Historial de CVs enviados

### Dashboard Admin
- **Dashboard** (`/dashboard/admin`): Panel de administración con estadísticas
- **Usuarios** (`/dashboard/admin/usuarios`): Gestión de usuarios (crear, listar)
- **CVs** (`/dashboard/admin/cvs`): Lista de postulaciones recibidas
- **Mensajes** (`/dashboard/admin/mensajes`): Mensajes de contacto

## 🗄️ Modelos de Base de Datos

- **User**: Usuarios del sistema (USER, ADMIN)
- **Message**: Mensajes de contacto
- **Cv**: Postulaciones con CVs

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run db:generate` - Genera el cliente Prisma
- `npm run db:push` - Sincroniza el schema con la base de datos
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:studio` - Abre Prisma Studio

## 🔧 Configuración Adicional

### Almacenamiento de CVs
Los CVs se almacenan localmente en la carpeta `/uploads`. Para producción, considera migrar a un servicio de almacenamiento en la nube (S3, etc.).

### Variables de Entorno
Asegúrate de configurar correctamente:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `NEXTAUTH_URL`: URL base de la aplicación
- `NEXTAUTH_SECRET`: Clave secreta para NextAuth (genera una clave segura)

## 📞 Información de Contacto

- **Dirección**: Punin y 9 Agosto N2-134
- **Email**: fibertechya2025@gmail.com
- **Teléfono**: +593 99 504 7684
- **Redes**: @cafibertech

## 📄 Licencia

Este proyecto es propiedad de C&A FIBERTECH.

## 🤝 Contribuciones

Este es un proyecto privado. Para consultas, contacta a los administradores.

---

Desarrollado con ❤️ para C&A FIBERTECH

