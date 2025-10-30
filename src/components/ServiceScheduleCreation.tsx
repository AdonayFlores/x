import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Checkbox } from "./ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface ServiceScheduleCreationProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface Explorer {
  id: string;
  code: string;
  name: string;
}

interface ServiceGroup {
  id: string;
  date: string;
  day: string;
  members: string[];
  createdAt: string;
}

// Datos mock de exploradores (mismos que en ExplorersList)
const mockExplorers = [
  {
    id: "1",
    nombre: "Juan Carlos",
    apellidos: "Pérez García",
    codigoExplorador: "001-001",
  },
  {
    id: "2",
    nombre: "Ana Sofía",
    apellidos: "Martínez López",
    codigoExplorador: "001-002",
  },
  {
    id: "3",
    nombre: "Diego Alejandro",
    apellidos: "Rodríguez Hernández",
    codigoExplorador: "001-003",
  },
  {
    id: "4",
    nombre: "María Fernanda",
    apellidos: "González Ruiz",
    codigoExplorador: "001-004",
  },
  {
    id: "5",
    nombre: "Luis Eduardo",
    apellidos: "Sánchez Torres",
    codigoExplorador: "001-005",
  },
];

export function ServiceScheduleCreation({ onBack, onNavigate }: ServiceScheduleCreationProps) {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>(() => {
    const stored = localStorage.getItem("serviceGroups");
    return stored ? JSON.parse(stored) : [];
  });

  // Obtener exploradores del localStorage o usar mock
  const explorers: Explorer[] = (() => {
    const stored = localStorage.getItem("explorers");
    let data = [];
    
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch (e) {
        data = mockExplorers;
      }
    } else {
      data = mockExplorers;
    }
    
    return data.map((explorer: any) => ({
      id: explorer.id,
      code: explorer.codigoExplorador || explorer.code || "000-000",
      name: `${explorer.nombre} ${explorer.apellidos}`,
    }));
  })();

  const handleToggleMember = (explorerId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(explorerId)
        ? prev.filter((id) => id !== explorerId)
        : [...prev, explorerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === explorers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(explorers.map((e) => e.id));
    }
  };

  const handleCreateGroup = () => {
    if (!date || !day) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Debes seleccionar al menos un explorador");
      return;
    }

    const newGroup: ServiceGroup = {
      id: Date.now().toString(),
      date,
      day,
      members: selectedMembers,
      createdAt: new Date().toISOString(),
    };

    const updatedGroups = [...serviceGroups, newGroup];
    setServiceGroups(updatedGroups);
    localStorage.setItem("serviceGroups", JSON.stringify(updatedGroups));

    toast.success("Grupo de servicio creado exitosamente");

    // Limpiar formulario
    setDate("");
    setDay("");
    setSelectedMembers([]);
    setIsFormOpen(false);
  };

  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = serviceGroups.filter((g) => g.id !== groupId);
    setServiceGroups(updatedGroups);
    localStorage.setItem("serviceGroups", JSON.stringify(updatedGroups));
    toast.success("Grupo eliminado");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header Sticky */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Horario de Servicio
                </h1>
                <p className="text-xs text-muted-foreground">Crear grupos de servicio</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-safe">
        {/* Botones de navegación */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => onNavigate("service-schedule-attendance")}
          >
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-xs">Tomar Asistencia</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => onNavigate("service-schedule-report")}
          >
            <div className="flex flex-col items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Ver Historial</span>
            </div>
          </Button>
        </div>

        {/* Formulario de Creación */}
        <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen} className="mb-6">
          <Card>
            <CardContent className="p-4">
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-14 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>Crear Nuevo Grupo de Servicio</span>
                  </div>
                  {isFormOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="day">Día</Label>
                    <Input
                      id="day"
                      type="text"
                      placeholder="Ej: Domingo"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                    />
                  </div>
                </div>

                {/* Selección de Exploradores */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Seleccionar Exploradores ({selectedMembers.length})</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedMembers.length === explorers.length ? "Deseleccionar" : "Seleccionar"} Todos
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3 max-h-64 overflow-y-auto">
                    {explorers.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay exploradores registrados
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {explorers.map((explorer) => (
                          <div
                            key={explorer.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
                          >
                            <Checkbox
                              id={`explorer-${explorer.id}`}
                              checked={selectedMembers.includes(explorer.id)}
                              onCheckedChange={() => handleToggleMember(explorer.id)}
                            />
                            <label
                              htmlFor={`explorer-${explorer.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <p className="text-sm">{explorer.name}</p>
                              <p className="text-xs text-muted-foreground">{explorer.code}</p>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleCreateGroup}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Crear Grupo de Servicio
                </Button>
              </CollapsibleContent>
            </CardContent>
          </Card>
        </Collapsible>

        {/* Lista de Grupos Creados */}
        <div className="space-y-3">
          <h2 className="text-base">Grupos Programados ({serviceGroups.length})</h2>

          {serviceGroups.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center">
                  No hay grupos de servicio creados
                </p>
              </CardContent>
            </Card>
          ) : (
            serviceGroups
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <p className="text-sm">
                            {new Date(group.date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-indigo-600" />
                          <p className="text-sm">{group.day}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <p className="text-sm">{group.members.length} exploradores</p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </main>
    </div>
  );
}