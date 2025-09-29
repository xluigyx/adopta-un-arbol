import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TreePine, Users, TrendingUp, Award, Target, Leaf, 
  Heart, MapPin, Calendar, DollarSign
} from 'lucide-react';

interface User {
  name: string;
  role?: string;
}

interface StatisticsPageProps {
  onNavigate: (view: string) => void;
  user?: User; // Ahora sí acepta user
}

export function StatisticsPage({ onNavigate, user }: StatisticsPageProps) {
  const monthlyData = [
    { month: 'Ene', planted: 45, adopted: 38, revenue: 1200 },
    { month: 'Feb', planted: 52, adopted: 45, revenue: 1400 },
    { month: 'Mar', planted: 68, adopted: 58, revenue: 1800 },
    { month: 'Apr', planted: 73, adopted: 65, revenue: 2100 },
    { month: 'May', planted: 85, adopted: 78, revenue: 2400 },
    { month: 'Jun', planted: 92, adopted: 85, revenue: 2800 },
    { month: 'Jul', planted: 98, adopted: 89, revenue: 3100 },
    { month: 'Ago', planted: 105, adopted: 95, revenue: 3500 },
    { month: 'Sep', planted: 88, adopted: 82, revenue: 2900 }
  ];

  const speciesData = [
    { name: 'Roble', value: 35, count: 850 },
    { name: 'Pino', value: 25, count: 610 },
    { name: 'Cerezo', value: 15, count: 365 },
    { name: 'Sauce', value: 12, count: 292 },
    { name: 'Naranjo', value: 8, count: 195 },
    { name: 'Otros', value: 5, count: 138 }
  ];

  const zoneData = [
    { zone: 'Centro', trees: 890, adopted: 780, percentage: 87.6 },
    { zone: 'Norte', trees: 650, adopted: 580, percentage: 89.2 },
    { zone: 'Sur', trees: 420, adopted: 350, percentage: 83.3 },
    { zone: 'Este', trees: 380, adopted: 320, percentage: 84.2 },
    { zone: 'Oeste', trees: 280, adopted: 230, percentage: 82.1 }
  ];

  const COLORS = ['#22c55e', '#16a34a', '#15803d', '#84cc16', '#65a30d', '#a3a3a3'];

  const stats = {
    totalTrees: 2450,
    totalUsers: 1247,
    totalRevenue: 28750,
    adoptionRate: 89.2,
    monthlyGrowth: 15.3,
    survivalRate: 95.8,
    totalSpecies: 15,
    activeZones: 5,
    co2Absorption: 125.5,
    volunteersActive: 45
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && (
          <p className="text-gray-700 mb-4">
            Bienvenido, {user.name} {user.role ? `(${user.role})` : ''}
          </p>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Estadísticas del Proyecto</h1>
          <p className="text-gray-600">Métricas y análisis del impacto de Arbolitos</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Árboles Plantados</p>
                  <p className="text-3xl font-bold">{stats.totalTrees.toLocaleString()}</p>
                </div>
                <TreePine className="h-10 w-10 text-green-200" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-100">+{stats.monthlyGrowth}% este mes</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Usuarios Activos</p>
                  <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Heart className="h-4 w-4 text-blue-200 mr-1" />
                <span className="text-blue-100">{stats.adoptionRate}% adopción</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Ingresos Totales</p>
                  <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-10 w-10 text-purple-200" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Calendar className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-100">Este año</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">CO₂ Absorbido</p>
                  <p className="text-3xl font-bold">{stats.co2Absorption} T</p>
                </div>
                <Leaf className="h-10 w-10 text-orange-200" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Target className="h-4 w-4 text-orange-200 mr-1" />
                <span className="text-orange-100">Impacto ambiental</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Growth & Species Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Crecimiento Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="planted" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Plantados" />
                  <Area type="monotone" dataKey="adopted" stackId="2" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} name="Adoptados" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-green-600" />
                Distribución por Especies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={speciesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {speciesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Zone Performance & KPI */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Rendimiento por Zonas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={zoneData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="trees" fill="#94a3b8" name="Total" />
                  <Bar dataKey="adopted" fill="#22c55e" name="Adoptados" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Indicadores Clave
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tasa de Adopción</span>
                  <span className="font-medium">{stats.adoptionRate}%</span>
                </div>
                <Progress value={stats.adoptionRate} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tasa de Supervivencia</span>
                  <span className="font-medium">{stats.survivalRate}%</span>
                </div>
                <Progress value={stats.survivalRate} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Crecimiento Mensual</span>
                  <span className="font-medium">+{stats.monthlyGrowth}%</span>
                </div>
                <Progress value={stats.monthlyGrowth * 5} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.totalSpecies}</div>
                    <div className="text-xs text-gray-600">Especies</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.volunteersActive}</div>
                    <div className="text-xs text-gray-600">Voluntarios</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone Statistics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Detalladas por Zona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Zona</th>
                    <th className="text-center py-3 px-4">Total Árboles</th>
                    <th className="text-center py-3 px-4">Adoptados</th>
                    <th className="text-center py-3 px-4">Disponibles</th>
                    <th className="text-center py-3 px-4">Tasa de Adopción</th>
                    <th className="text-center py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {zoneData.map((zone, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-green-900">{zone.zone}</td>
                      <td className="text-center py-3 px-4">{zone.trees}</td>
                      <td className="text-center py-3 px-4 text-green-600">{zone.adopted}</td>
                      <td className="text-center py-3 px-4">{zone.trees - zone.adopted}</td>
                      <td className="text-center py-3 px-4">
                        <Badge 
                          className={
                            zone.percentage >= 85 
                              ? 'bg-green-100 text-green-800' 
                              : zone.percentage >= 80 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {zone.percentage}%
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant={zone.percentage >= 85 ? 'default' : 'secondary'}>
                          {zone.percentage >= 85 ? 'Excelente' : 
                           zone.percentage >= 80 ? 'Bueno' : 'Necesita mejora'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Impacto Ambiental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.co2Absorption} T</div>
                <div className="text-sm text-gray-600">CO₂ Absorbido Anualmente</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">18.5 M</div>
                <div className="text-sm text-gray-600">Litros O₂ Producidos</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-2">450</div>
                <div className="text-sm text-gray-600">Especies de Aves Protegidas</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">2.8°C</div>
                <div className="text-sm text-gray-600">Reducción Temperatura</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
