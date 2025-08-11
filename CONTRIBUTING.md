# Contributing to Alex Rehor Portfolio

¡Gracias por tu interés en contribuir! Este proyecto es el sitio web personal de Alex Rehor.

## 🚀 Desarrollo Local

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Configuración
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/alex-rehor-portfolio.git

# Navegar al directorio
cd alex-rehor-portfolio

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus API keys
# VITE_GOOGLE_SHEETS_API_KEY=tu_api_key
# VITE_GOOGLE_SPREADSHEET_ID=tu_spreadsheet_id
# VITE_WEB3FORMS_ACCESS_KEY=tu_web3forms_key

# Iniciar servidor de desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
├── services/           # Servicios y APIs
├── utils/              # Utilidades
└── main.tsx           # Punto de entrada
```

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter ESLint
```

## 🎨 Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Icons**: Lucide React

## 📝 Convenciones

- Usar TypeScript para todos los archivos
- Seguir las convenciones de Tailwind CSS
- Componentes funcionales con hooks
- Nombres de archivos en PascalCase para componentes

## 🔒 Variables de Entorno

Asegúrate de configurar las variables de entorno necesarias:

- `VITE_GOOGLE_SHEETS_API_KEY`: Para integración con Google Sheets
- `VITE_GOOGLE_SPREADSHEET_ID`: ID de la hoja de cálculo
- `VITE_WEB3FORMS_ACCESS_KEY`: Para el formulario de contacto

## 📞 Contacto

Si tienes preguntas, puedes contactar a Alex Rehor:
- Email: arehor@me.com
- LinkedIn: [alejandro-alonso-řehoř](https://www.linkedin.com/in/alejandro-alonso-%C5%99eho%C5%99-55b2844a/)