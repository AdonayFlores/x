import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Calendar, Users, CheckCircle2, XCircle, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface ServiceScheduleAttendanceProps {
  onBack: () => void;
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

interface AttendanceRecord {
  groupId: string;
  date: string;
  attendees: string[];
  absentees: string[];
  takenAt: string;
  serviceNotes: string;
  explorerNotes: { [explorerId: string]: string };
}

// Datos mock de exploradores
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

export function ServiceScheduleAttendance({ onBack }: ServiceScheduleAttendanceProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [presentMembers, setPresentMembers] = useState<string[]>([]);
  const [serviceNotes, setServiceNotes] = useState("");
  const [explorerNotes, setExplorerNotes] = useState<{ [explorerId: string]: string }>({});
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

  // Refrescar grupos cuando el componente se monta o se enfoca
  const refreshGroups = () => {
    const stored = localStorage.getItem("serviceGroups");
    if (stored) {
      setServiceGroups(JSON.parse(stored));
    }
  };

  // Escuchar cambios en localStorage
  useEffect(() => {
    refreshGroups();
    
    const handleStorageChange = () => {
      refreshGroups();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // Filtrar grupos de hoy y futuros
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const availableGroups = serviceGroups.filter((group) => {
    const groupDate = new Date(group.date);
    groupDate.setHours(0, 0, 0, 0);
    return groupDate >= today;
  });

  const selectedGroup = availableGroups.find((g) => g.id === selectedGroupId);

  const handleToggleAttendance = (explorerId: string) => {
    setPresentMembers((prev) =>
      prev.includes(explorerId)
        ? prev.filter((id) => id !== explorerId)
        : [...prev, explorerId]
    );
  };

  const handleMarkAllPresent = () => {
    if (!selectedGroup) return;
    setPresentMembers(selectedGroup.members);
  };

  const handleMarkAllAbsent = () => {
    setPresentMembers([]);
  };

  const handleSaveAttendance = () => {
    if (!selectedGroup) return;

    const absentMembers = selectedGroup.members.filter(
      (id) => !presentMembers.includes(id)
    );

    const attendanceRecord: AttendanceRecord = {
      groupId: selectedGroup.id,
      date: selectedGroup.date,
      attendees: presentMembers,
      absentees: absentMembers,
      takenAt: new Date().toISOString(),
      serviceNotes: serviceNotes,
      explorerNotes: explorerNotes,
    };

    // Guardar registro de asistencia
    const stored = localStorage.getItem("serviceAttendance");
    const records: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
    records.push(attendanceRecord);
    localStorage.setItem("serviceAttendance", JSON.stringify(records));

    toast.success("Asistencia guardada exitosamente");

    // Limpiar selección
    setSelectedGroupId(null);
    setPresentMembers([]);
    setServiceNotes("");
    setExplorerNotes({});
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setPresentMembers([]);
    setServiceNotes("");
    setExplorerNotes({});
  };

  // Si hay un grupo seleccionado, mostrar formulario de asistencia
  if (selectedGroup) {
    const groupMembers = explorers.filter((e) =>
      selectedGroup.members.includes(e.id)
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        {/* Header Sticky */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedGroupId(null);
                    setPresentMembers([]);
                    setServiceNotes("");
                    setExplorerNotes({});
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Tomar Asistencia
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedGroup.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-6 pb-safe">
          {/* Información del Grupo */}
          <Card className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <p className="text-sm">{selectedGroup.day}</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <p className="text-sm">{groupMembers.length} exploradores en este servicio</p>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción rápida */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="outline"
              className="h-auto py-3"
              onClick={handleMarkAllPresent}
            >
              <div className="flex flex-col items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-xs">Todos Presentes</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-3"
              onClick={handleMarkAllAbsent}
            >
              <div className="flex flex-col items-center gap-1">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-xs">Todos Ausentes</span>
              </div>
            </Button>
          </div>

          {/* Lista de Exploradores */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base">Marcar Asistencia</h2>
                <div className="text-sm text-muted-foreground">
                  {presentMembers.length}/{groupMembers.length}
                </div>
              </div>

              <div className="space-y-4">
                {groupMembers.map((explorer) => {
                  const isPresent = presentMembers.includes(explorer.id);
                  return (
                    <div key={explorer.id} className="space-y-2">
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                          isPresent
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <Checkbox
                          id={`attendance-${explorer.id}`}
                          checked={isPresent}
                          onCheckedChange={() => handleToggleAttendance(explorer.id)}
                        />
                        <label
                          htmlFor={`attendance-${explorer.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <p className="text-sm">{explorer.name}</p>
                          <p className="text-xs text-muted-foreground">{explorer.code}</p>
                        </label>
                        {isPresent ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="pl-10">
                        <Textarea
                          placeholder={`Notas para ${explorer.name.split(' ')[0]}...`}
                          className="w-full h-16 text-sm"
                          value={explorerNotes[explorer.id] || ""}
                          onChange={(e) =>
                            setExplorerNotes((prev) => ({
                              ...prev,
                              [explorer.id]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Notas del Servicio */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <Label htmlFor="service-notes">Notas Generales del Servicio</Label>
              </div>
              <Textarea
                id="service-notes"
                placeholder="Escribe notas generales sobre el servicio de hoy..."
                className="w-full h-24"
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Botón Guardar */}
          <Button
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={handleSaveAttendance}
          >
            Guardar Asistencia ({presentMembers.length} presentes)
          </Button>
        </main>
      </div>
    );
  }

  // Vista de selección de grupo
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
                  Tomar Asistencia
                </h1>
                <p className="text-xs text-muted-foreground">Selecciona un grupo de servicio</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-safe">
        <div className="space-y-3">
          <h2 className="text-base">Grupos Disponibles ({availableGroups.length})</h2>

          {availableGroups.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center">
                  No hay grupos de servicio programados para hoy o fechas futuras
                </p>
              </CardContent>
            </Card>
          ) : (
            availableGroups
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((group) => {
                const groupMembers = explorers.filter((e) =>
                  group.members.includes(e.id)
                );

                return (
                  <Card
                    key={group.id}
                    className="cursor-pointer hover:border-purple-300 transition-colors"
                    onClick={() => handleSelectGroup(group.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
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
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" />
                            <p className="text-sm">
                              {group.day} ({groupMembers.length} exploradores)
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Seleccionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </div>
      </main>
    </div>
  );
}