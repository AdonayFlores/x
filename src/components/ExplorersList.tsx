import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ArrowLeft, Search, UserPlus, Eye } from "lucide-react";

interface Explorer {
  id: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string;
  direccion: string;
  alergias?: string;
  medicinaControlada?: string;
  foto?: string;
  nombreResponsable: string;
  telefonoResponsable: string;
  aceptoCristo: boolean;
  bautizado: boolean;
  asisteCelula: boolean;
  nombreLiderCelula?: string;
}

// Datos de ejemplo
const mockExplorers: Explorer[] = [
  {
    id: "1",
    nombre: "Juan Carlos",
    apellidos: "Pérez García",
    fechaNacimiento: "2010-05-15",
    telefono: "+1 (555) 123-4567",
    direccion: "Calle Principal 123, Ciudad de México",
    alergias: "Alergia al polen",
    medicinaControlada: "Ninguna",
    nombreResponsable: "María García",
    telefonoResponsable: "+1 (555) 123-4568",
    aceptoCristo: true,
    bautizado: true,
    asisteCelula: true,
    nombreLiderCelula: "Pastor Roberto Sánchez",
  },
  {
    id: "2",
    nombre: "Ana Sofía",
    apellidos: "Martínez López",
    fechaNacimiento: "2011-08-22",
    telefono: "+1 (555) 234-5678",
    direccion: "Avenida Reforma 456, Guadalajara",
    alergias: "Alergia a frutos secos",
    nombreResponsable: "Carlos Martínez",
    telefonoResponsable: "+1 (555) 234-5679",
    aceptoCristo: true,
    bautizado: false,
    asisteCelula: true,
    nombreLiderCelula: "Hermana Laura González",
  },
  {
    id: "3",
    nombre: "Diego Alejandro",
    apellidos: "Rodríguez Hernández",
    fechaNacimiento: "2012-03-10",
    telefono: "+1 (555) 345-6789",
    direccion: "Boulevard Central 789, Monterrey",
    medicinaControlada: "Inhalador para asma",
    nombreResponsable: "Patricia Hernández",
    telefonoResponsable: "+1 (555) 345-6790",
    aceptoCristo: true,
    bautizado: true,
    asisteCelula: false,
  },
  {
    id: "4",
    nombre: "María Fernanda",
    apellidos: "González Ruiz",
    fechaNacimiento: "2010-11-30",
    telefono: "+1 (555) 456-7890",
    direccion: "Calle Juárez 321, Puebla",
    nombreResponsable: "Fernando González",
    telefonoResponsable: "+1 (555) 456-7891",
    aceptoCristo: false,
    bautizado: false,
    asisteCelula: true,
    nombreLiderCelula: "Pastor Miguel Ángel",
  },
  {
    id: "5",
    nombre: "Luis Eduardo",
    apellidos: "Sánchez Torres",
    fechaNacimiento: "2011-07-18",
    telefono: "+1 (555) 567-8901",
    direccion: "Avenida Hidalgo 654, Querétaro",
    alergias: "Intolerancia a la lactosa",
    nombreResponsable: "Elena Torres",
    telefonoResponsable: "+1 (555) 567-8902",
    aceptoCristo: true,
    bautizado: true,
    asisteCelula: true,
    nombreLiderCelula: "Hermano José Luis",
  },
];

interface ExplorersListProps {
  onBack: () => void;
  onViewExplorer: (explorerId: string) => void;
  onAddNew: () => void;
}

export function ExplorersList({ onBack, onViewExplorer, onAddNew }: ExplorersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [explorers] = useState<Explorer[]>(mockExplorers);

  const filteredExplorers = explorers.filter((explorer) => {
    const fullName = `${explorer.nombre} ${explorer.apellidos}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getInitials = (nombre: string, apellidos: string) => {
    return `${nombre.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-0">
                <p className="text-base bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent truncate">
                  Exploradores
                </p>
                <p className="text-xs text-muted-foreground">
                  {filteredExplorers.length} encontrado{filteredExplorers.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={onAddNew} 
              className="flex-shrink-0 bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-5 pb-safe">
        {/* Search Bar */}
        <div className="mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Explorers Grid */}
        <div className="space-y-4">
          {filteredExplorers.map((explorer) => (
            <Card 
              key={explorer.id}
              className="cursor-pointer border"
              onClick={() => onViewExplorer(explorer.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="w-14 h-14 flex-shrink-0">
                    <AvatarImage src={explorer.foto} alt={explorer.nombre} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                      {getInitials(explorer.nombre, explorer.apellidos)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-1 truncate font-medium">
                      {explorer.nombre} {explorer.apellidos}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {calculateAge(explorer.fechaNacimiento)} años
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1 text-xs mb-3 bg-gray-50 p-3 rounded-lg">
                  <p className="truncate">
                    <span className="text-muted-foreground font-medium">Tel:</span> {explorer.telefono}
                  </p>
                  <p className="truncate">
                    <span className="text-muted-foreground font-medium">Responsable:</span> {explorer.nombreResponsable}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {explorer.aceptoCristo && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs border-0">
                      Cristo
                    </Badge>
                  )}
                  {explorer.bautizado && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs border-0">
                      Bautizado
                    </Badge>
                  )}
                  {explorer.asisteCelula && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs border-0">
                      Célula
                    </Badge>
                  )}
                  {(explorer.alergias || explorer.medicinaControlada) && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs border-0">
                      ⚠️ Info médica
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredExplorers.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No se encontraron exploradores</p>
          </div>
        )}
      </main>
    </div>
  );
}

export type { Explorer };
