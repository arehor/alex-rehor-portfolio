import React, { useState } from 'react';
import { ExternalLink, Copy, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface GoogleSheetsSetupProps {
  onClose: () => void;
  language: 'en' | 'es';
}

const GoogleSheetsSetup: React.FC<GoogleSheetsSetupProps> = ({ onClose, language }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const translations = {
    en: {
      title: 'Connect Google Sheets',
      subtitle: 'Store and manage your blog posts in Google Sheets',
      step1: 'Create Google Sheet',
      step1Desc: 'Create a new Google Sheet with the required columns',
      step2: 'Get API Key',
      step2Desc: 'Enable Google Sheets API and create credentials (Free tier: 100 requests/day)',
      step3: 'Configure Access',
      step3Desc: 'Make your sheet accessible and get the Sheet ID',
      step4: 'Add Environment Variables',
      step4Desc: 'Add your API key and Sheet ID to environment variables',
      columns: 'Required Columns:',
      templateSheet: 'Use Template Sheet',
      googleConsole: 'View API Costs & Limits',
      envVars: 'Environment Variables:',
      sheetId: 'Sheet ID (from URL):',
      createSheet: 'Create Your Sheet:',
      step1Instructions: '1. Go to Google Sheets and create a new sheet\n2. Add the column headers exactly as shown above\n3. Add your first blog post in row 2',
      benefits: 'Benefits:',
      benefit1: 'Edit posts directly in Google Sheets',
      benefit2: 'Collaborate with team members',
      benefit3: 'Automatic sync with your website',
      benefit4: 'Backup and version control',
      costInfo: 'Cost Information:',
      freeQuota: 'Free: 100 requests per day',
      paidQuota: 'Paid: $4 per 1M requests after free tier',
      readCost: 'Reading posts: ~1 request per page load',
      writeCost: 'Writing posts: Currently saved locally (no API cost)',
      close: 'Close',
      copied: 'Copied!',
      copy: 'Copy'
    },
    es: {
      title: 'Conectar Google Sheets',
      subtitle: 'Almacena y gestiona tus publicaciones de blog en Google Sheets',
      step1: 'Crear Google Sheet',
      step1Desc: 'Crea una nueva hoja de Google con las columnas requeridas',
      step2: 'Obtener API Key',
      step2Desc: 'Habilita la API de Google Sheets y crea credenciales (Nivel gratuito: 100 solicitudes/día)',
      step3: 'Configurar Acceso',
      step3Desc: 'Haz tu hoja accesible y obtén el ID de la hoja',
      step4: 'Agregar Variables de Entorno',
      step4Desc: 'Agrega tu API key e ID de hoja a las variables de entorno',
      columns: 'Columnas Requeridas:',
      templateSheet: 'Usar Hoja de Plantilla',
      googleConsole: 'Ver Costos y Límites de API',
      envVars: 'Variables de Entorno:',
      sheetId: 'ID de Hoja (desde URL):',
      createSheet: 'Crea tu Hoja:',
      step1Instructions: '1. Ve a Google Sheets y crea una nueva hoja\n2. Agrega los encabezados de columna exactamente como se muestra arriba\n3. Agrega tu primera publicación de blog en la fila 2',
      benefits: 'Beneficios:',
      benefit1: 'Editar publicaciones directamente en Google Sheets',
      benefit2: 'Colaborar con miembros del equipo',
      benefit3: 'Sincronización automática con tu sitio web',
      benefit4: 'Respaldo y control de versiones',
      costInfo: 'Información de Costos:',
      freeQuota: 'Gratis: 100 solicitudes por día',
      paidQuota: 'Pago: $4 por 1M de solicitudes después del nivel gratuito',
      readCost: 'Leer publicaciones: ~1 solicitud por carga de página',
      writeCost: 'Escribir publicaciones: Actualmente guardado localmente (sin costo de API)',
      close: 'Cerrar',
      copied: '¡Copiado!',
      copy: 'Copiar'
    }
  };

  const t = translations[language];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const googleConsoleUrl = 'https://console.cloud.google.com/apis/library/sheets.googleapis.com';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileSpreadsheet className="w-6 h-6 mr-2 text-green-600" />
                {t.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{t.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Benefits */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
              {t.benefits}
            </h3>
            <ul className="space-y-2 text-green-700 dark:text-green-300">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.benefit1}
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.benefit2}
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.benefit3}
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.benefit4}
              </li>
            </ul>
          </div>

          {/* Cost Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
              {t.costInfo}
            </h3>
            <ul className="space-y-2 text-blue-700 dark:text-blue-300">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.freeQuota}
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.paidQuota}
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.readCost}
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.writeCost}
              </li>
            </ul>
          </div>

          {/* Setup Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.step1}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t.step1Desc}</p>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.columns}
                </p>
                <div className="bg-white dark:bg-gray-800 rounded border p-3 text-sm font-mono">
                  A: ID | B: Title | C: Excerpt | D: Content | E: Date | F: Read Time | G: Image URL
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  {language === 'en' ? 'Create Your Sheet:' : 'Crea tu Hoja:'}
                </h4>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>1. {language === 'en' ? 'Go to Google Sheets and create a new sheet' : 'Ve a Google Sheets y crea una nueva hoja'}</li>
                  <li>2. {language === 'en' ? 'Add the column headers exactly as shown above' : 'Agrega los encabezados de columna exactamente como se muestra arriba'}</li>
                  <li>3. {language === 'en' ? 'Add your first blog post in row 2' : 'Agrega tu primera publicación de blog en la fila 2'}</li>
                </ol>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.step2}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t.step2Desc}</p>
              
              <a
                href={googleConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t.googleConsole}
              </a>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.step3}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t.step3Desc}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.sheetId}
                </p>
                <div className="bg-white dark:bg-gray-800 rounded border p-2 text-sm font-mono text-gray-600 dark:text-gray-400">
                  https://docs.google.com/spreadsheets/d/<span className="text-blue-600 font-bold">SHEET_ID</span>/edit
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.step4}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t.step4Desc}</p>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.envVars}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-white dark:bg-gray-800 rounded border p-2 text-sm font-mono flex-1">
                      VITE_GOOGLE_SHEETS_API_KEY=your_api_key
                    </div>
                    <button
                      onClick={() => copyToClipboard('VITE_GOOGLE_SHEETS_API_KEY=your_api_key', 'apikey')}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {copied === 'apikey' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="bg-white dark:bg-gray-800 rounded border p-2 text-sm font-mono flex-1">
                      VITE_GOOGLE_SPREADSHEET_ID=your_sheet_id
                    </div>
                    <button
                      onClick={() => copyToClipboard('VITE_GOOGLE_SPREADSHEET_ID=your_sheet_id', 'sheetid')}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {copied === 'sheetid' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Note:</strong> {language === 'en' 
                  ? 'After setting up the environment variables, restart your development server for changes to take effect.'
                  : 'Después de configurar las variables de entorno, reinicia tu servidor de desarrollo para que los cambios surtan efecto.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsSetup;