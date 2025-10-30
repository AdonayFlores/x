import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Users, 
  BarChart3, 
  Settings, 
  ClipboardCheck,
  DollarSign,
  LogOut,
  UserPlus,
  Clock
} from "lucide-react";

interface HomeProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const menuOptions = [
  {
    id: 1,
    title: "Datos Personales",
    description: "Registro y actualización de información",
    icon: UserPlus,
    color: "from-blue-500 to-blue-600",
    page: "personal-data",
  },
  {
    id: 2,
    title: "Exploradores",
    description: "Ver listado de exploradores",
    icon: Users,
    color: "from-green-500 to-green-600",
    page: "explorers-list",
  },
  {
    id: 3,
    title: "Tomar Asistencia",
    description: "Registrar asistencia de reunión",
    icon: ClipboardCheck,
    color: "from-purple-500 to-purple-600",
    page: "attendance-taking",
  },
  {
    id: 4,
    title: "Ver Asistencia",
    description: "Reporte de asistencia por reunión",
    icon: BarChart3,
    color: "from-orange-500 to-orange-600",
    page: "attendance-report",
  },
  {
    id: 5,
    title: "Horario de Servicio",
    description: "Gestión de grupos de servicio",
    icon: Clock,
    color: "from-indigo-500 to-indigo-600",
    page: "service-schedule",
  },
  {
    id: 6,
    title: "Finanzas",
    description: "Gestión de ingresos y gastos",
    icon: DollarSign,
    color: "from-emerald-500 to-emerald-600",
    page: "finance-manager",
  },
  {
    id: 7,
    title: "Configuración",
    description: "Ajustes de la aplicación",
    icon: Settings,
    color: "from-teal-500 to-teal-600",
    page: "configuracion",
  },
];

export function Home({ onLogout, onNavigate }: HomeProps) {
  const handleMenuClick = (page: string) => {
    onNavigate(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Exploradores
              </h1>
              <p className="text-xs text-muted-foreground">Panel de control</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-safe">
        <div className="mb-6">
          <h2 className="text-xl mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Bienvenido
          </h2>
          <p className="text-sm text-muted-foreground">
            Selecciona una opción para continuar
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4">
          {menuOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className="cursor-pointer border"
                onClick={() => handleMenuClick(option.page)}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`bg-gradient-to-br ${option.color} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm mb-1 font-medium">{option.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}