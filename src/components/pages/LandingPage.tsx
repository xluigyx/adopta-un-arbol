import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { TreePine, Heart, Users, Leaf, Award, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const benefits = [
    {
      icon: <Heart className="h-12 w-12 text-green-600" />,
      title: "Contribuye al Medio Ambiente",
      description: "Cada árbol adoptado ayuda a mejorar la calidad del aire y reduce la huella de carbono urbana."
    },
    {
      icon: <Users className="h-12 w-12 text-green-600" />,
      title: "Conecta con tu Comunidad",
      description: "Únete a una red de ciudadanos comprometidos con el cuidado del medio ambiente urbano."
    },
    {
      icon: <Leaf className="h-12 w-12 text-green-600" />,
      title: "Haz un Impacto Real",
      description: "Recibe actualizaciones sobre el crecimiento y salud de tu árbol adoptado con reportes detallados."
    },
    {
      icon: <Award className="h-12 w-12 text-green-600" />,
      title: "Reconocimiento por tu Aporte",
      description: "Obtén certificados digitales y reconocimientos por tu contribución al cuidado urbano."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-green-900 leading-tight">
                  Adopta un Árbol,
                  <span className="text-green-600"> Cuida tu Ciudad</span>
                </h1>
                <p className="text-xl text-green-700 leading-relaxed">
                  Únete al proyecto Arbolitos y ayuda a crear una ciudad más verde y sostenible. 
                  Adopta, cuida y haz seguimiento a árboles urbanos en tu comunidad.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => onNavigate('register')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Registrarse Ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onNavigate('map')}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Explorar Árboles
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-green-700">
                <div className="text-center">
                  <div className="text-2xl font-bold">2,450</div>
                  <div className="text-sm">Árboles Adoptados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1,200</div>
                  <div className="text-sm">Usuarios Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm">Especies Disponibles</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1644380344134-c8986ef44b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRyZWVzJTIwdXJiYW4lMjBmb3Jlc3R8ZW58MXx8fHwxNTc3MjU1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Bosque urbano"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <TreePine className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
              ¿Por qué Adoptar un Árbol?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre todos los beneficios de formar parte de nuestra comunidad verde
            </p>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {benefits.map((benefit, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-green-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="flex justify-center">{benefit.icon}</div>
                      <h3 className="text-xl font-semibold text-green-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-green-600 border-green-200" />
            <CarouselNext className="text-green-600 border-green-200" />
          </Carousel>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para Hacer la Diferencia?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Comienza tu viaje hacia una ciudad más verde. Explora nuestro mapa interactivo 
            y encuentra el árbol perfecto para adoptar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onNavigate('map')}
              className="bg-white text-green-600 border-white hover:bg-green-50"
            >
              <TreePine className="mr-2 h-5 w-5" />
              Explorar Árboles Disponibles
            </Button>
            <Button 
              size="lg"
              onClick={() => onNavigate('register')}
              className="bg-green-700 hover:bg-green-800 text-white border-green-700"
            >
              Crear Cuenta Gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-700">2,450</div>
              <div className="text-green-600">Árboles Plantados</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-700">1,200</div>
              <div className="text-green-600">Familias Adoptantes</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-700">15</div>
              <div className="text-green-600">Especies Nativas</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-700">95%</div>
              <div className="text-green-600">Tasa de Supervivencia</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}