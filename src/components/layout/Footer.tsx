import { TreePine, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-green-900 text-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl">Arbolitos</span>
            </div>
            <p className="text-green-200 text-sm leading-relaxed">
              Conectando personas con la naturaleza urbana a través de la adopción 
              y cuidado responsable de árboles en nuestra ciudad.
            </p>
          </div>

          {/* Sobre el proyecto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-green-300">Sobre el Proyecto</h3>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('about')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                ¿Qué es Arbolitos?
              </button>
              <button 
                onClick={() => onNavigate('mission')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Nuestra Misión
              </button>
              <button 
                onClick={() => onNavigate('impact')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Impacto Ambiental
              </button>
              <button 
                onClick={() => onNavigate('how-it-works')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Cómo Funciona
              </button>
            </div>
          </div>

          {/* Colaboradores y soporte */}
          <div className="space-y-4">
            <h3 className="font-semibold text-green-300">Colaboradores</h3>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('partners')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Socios Estratégicos
              </button>
              <button 
                onClick={() => onNavigate('volunteers')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Voluntarios
              </button>
              <button 
                onClick={() => onNavigate('faq')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                FAQ / Soporte
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Contacto
              </button>
            </div>
          </div>

          {/* Políticas y redes sociales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-green-300">Legal y Redes</h3>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('privacy')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Política de Privacidad
              </button>
              <button 
                onClick={() => onNavigate('terms')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Términos de Uso
              </button>
              <button 
                onClick={() => onNavigate('cookies')}
                className="block text-green-200 hover:text-green-100 text-sm transition-colors"
              >
                Política de Cookies
              </button>
            </div>
            
            {/* Redes sociales */}
            <div className="flex space-x-3 pt-2">
              <button className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-colors">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-colors">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="p-2 bg-green-800 rounded-full hover:bg-green-700 transition-colors">
                <Instagram className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Contacto y copyright */}
        <div className="border-t border-green-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 text-sm text-green-200">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>arbolitos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span> 78987865</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-green-300">
            © 2025 Arbolitos. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}