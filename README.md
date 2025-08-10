# Alex Rehor - Portfolio Personal

Un sitio web moderno y responsive para mostrar mi experiencia como Consultor de IA y Estratega de Datos.

## 🌟 Características

- **Diseño Responsive**: Funciona perfectamente en desktop, tablet y móvil
- **Bilingüe**: Soporte completo para Español e Inglés
- **Modo Oscuro/Claro**: Tema adaptable según preferencia del usuario
- **Blog Interactivo**: Posts con reproducción de audio text-to-speech
- **Formulario de Contacto**: Funcional con Web3Forms
- **Gestión de Contenido**: Panel de administración para editar blog y experiencia
- **Animaciones Suaves**: Transiciones y efectos visuales modernos
- **SEO Optimizado**: Estructura semántica y metadatos apropiados

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: Netlify
- **Forms**: Web3Forms
- **Audio**: Web Speech API

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/alex-rehor-portfolio.git

# Navegar al directorio
cd alex-rehor-portfolio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter ESLint
```

## 🌐 Demo en Vivo

Visita el sitio web: [https://aesthetic-medovik-2d0592.netlify.app](https://aesthetic-medovik-2d0592.netlify.app)

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Navegación principal
│   ├── Hero.tsx        # Sección hero
│   ├── Experience.tsx  # Experiencia laboral
│   ├── Blog.tsx        # Sección del blog
│   ├── ContactForm.tsx # Formulario de contacto
│   └── ...
├── services/           # Servicios y APIs
│   ├── googleSheets.ts # Integración Google Sheets
│   └── googleTranslate.ts # Servicio de traducción
├── utils/              # Utilidades
│   └── translator.ts   # Sistema de traducción
└── main.tsx           # Punto de entrada
```

## ⚙️ Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Google Sheets (opcional)
VITE_GOOGLE_SHEETS_API_KEY=tu_api_key
VITE_GOOGLE_SPREADSHEET_ID=tu_spreadsheet_id

# Google Translate (opcional)
VITE_GOOGLE_TRANSLATE_API_KEY=tu_translate_api_key
```

### Configuración del Formulario de Contacto
El formulario usa Web3Forms. Para configurarlo:
1. Regístrate en [Web3Forms](https://web3forms.com)
2. Obtén tu Access Key
3. Reemplaza el valor en `src/components/ContactForm.tsx`

## 🎨 Personalización

### Colores y Tema
Los colores principales se pueden modificar en `tailwind.config.js` y los componentes usan clases de Tailwind CSS.

### Contenido
- **Experiencia**: Editable desde el panel de administración (contraseña: admin123)
- **Blog**: Gestión completa desde el panel de administración
- **Información personal**: Modificar en `src/components/Hero.tsx`

## 📱 Características Responsive

- **Mobile First**: Diseñado primero para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Menú Hamburguesa**: Navegación optimizada para móviles
- **Imágenes Adaptativas**: Optimizadas para diferentes tamaños de pantalla

## 🔒 Panel de Administración

Accede al panel de administración haciendo clic en los íconos de configuración:
- **Contraseña por defecto**: `admin123`
- **Funciones**: Editar blog posts, experiencia laboral, cambiar contraseña

## 🌍 Internacionalización

El sitio soporta dos idiomas:
- **Español** (ES): Idioma por defecto
- **Inglés** (EN): Traducción completa

Las traducciones se gestionan a través de:
- Diccionario local en `src/utils/translator.ts`
- Integración opcional con Google Sheets para traducciones dinámicas

## 📊 Analytics y SEO

- **Meta tags** optimizados
- **Open Graph** para redes sociales
- **Estructura semántica** HTML5
- **Sitemap** generado automáticamente
- **Performance** optimizado con Vite

## 🚀 Deployment

### Netlify (Recomendado)
1. Conecta tu repositorio de GitHub a Netlify
2. Configura el build command: `npm run build`
3. Configura el publish directory: `dist`
4. Las variables de entorno se configuran en el panel de Netlify

### Otros Proveedores
El proyecto es compatible con:
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Alex Rehor**
- Email: arehor@me.com
- LinkedIn: [alejandro-alonso-řehoř](https://www.linkedin.com/in/alejandro-alonso-%C5%99eho%C5%99-55b2844a/)
- Sitio Web: [https://aesthetic-medovik-2d0592.netlify.app](https://aesthetic-medovik-2d0592.netlify.app)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!