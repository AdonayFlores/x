import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Calendar, Users, CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText } from "lucide-react";

interface ServiceScheduleReportProps {
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
}

interface AttendanceRecord {
  groupId: string;
  date: string;
  attendees: string[];
  absentees: string[];
  takenAt: string;
  serviceNotes?: string;
  explorerNotes?: { [explorerId: string]: string };
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

export function ServiceScheduleReport({ onBack }: ServiceScheduleReportProps) {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  // Obtener datos
  const serviceGroups: ServiceGroup[] = (() => {
    const stored = localStorage.getItem("serviceGroups");
    return stored ? JSON.parse(stored) : [];
  })();

  const attendanceRecords: AttendanceRecord[] = (() => {
    const stored = localStorage.getItem("serviceAttendance");
    return stored ? JSON.parse(stored) : [];
  })();

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

  const toggleExpand = (recordId: string) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const getExplorerName = (explorerId: string): string => {
    const explorer = explorers.find((e) => e.id === explorerId);
    return explorer ? explorer.name : "Desconocido";
  };

  const getExplorerCode = (explorerId: string): string => {
    const explorer = explorers.find((e) => e.id === explorerId);
    return explorer ? explorer.code : "";
  };

  const getGroupInfo = (groupId: string) => {
    return serviceGroups.find((g) => g.id === groupId);
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
                  Historial de Asistencia
                </h1>
                <p className="text-xs text-muted-foreground">
                  Registros de horarios de servicio
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-safe">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl mb-1">{attendanceRecords.length}</p>
                <p className="text-xs text-muted-foreground">Registros Totales</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl mb-1">{serviceGroups.length}</p>
                <p className="text-xs text-muted-foreground">Grupos Creados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Registros */}
        <div className="space-y-3">
          <h2 className="text-base">Registros de Asistencia</h2>

          {attendanceRecords.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center">
                  No hay registros de asistencia
                </p>
              </CardContent>
            </Card>
          ) : (
            attendanceRecords
              .sort(
                (a, b) =>
                  new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
              )
              .map((record) => {
                const group = getGroupInfo(record.groupId);
                const isExpanded = expandedRecord === record.takenAt;
                const attendancePercentage = Math.round(
                  (record.attendees.length /
                    (record.attendees.length + record.absentees.length)) *
                    100
                );

                return (
                  <Card key={record.takenAt}>
                    <CardContent className="p-4">
                      {/* Encabezado del Registro */}
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleExpand(record.takenAt)}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              <p className="text-sm">
                                {new Date(record.date).toLocaleDateString("es-ES", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            {group && (
                              <p className="text-xs text-muted-foreground mb-2">
                                {group.day}
                              </p>
                            )}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{record.attendees.length}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm">{record.absentees.length}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {attendancePercentage}% asistencia
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {/* Barra de progreso */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${attendancePercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Detalles Expandidos */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          {/* Exploradores Presentes */}
                          {record.attendees.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <h3 className="text-sm">
                                  Presentes ({record.attendees.length})
                                </h3>
                              </div>
                              <div className="space-y-2 pl-6">
                                {record.attendees.map((explorerId) => (
                                  <div
                                    key={explorerId}
                                    className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
                                  >
                                    <Users className="w-4 h-4 text-green-600" />
                                    <div className="flex-1">
                                      <p className="text-sm">
                                        {getExplorerName(explorerId)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {getExplorerCode(explorerId)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Exploradores Ausentes */}
                          {record.absentees.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <h3 className="text-sm">
                                  Ausentes ({record.absentees.length})
                                </h3>
                              </div>
                              <div className="space-y-2 pl-6">
                                {record.absentees.map((explorerId) => (
                                  <div
                                    key={explorerId}
                                    className="flex items-center gap-2 p-2 bg-red-50 rounded-lg"
                                  >
                                    <Users className="w-4 h-4 text-red-600" />
                                    <div className="flex-1">
                                      <p className="text-sm">
                                        {getExplorerName(explorerId)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {getExplorerCode(explorerId)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Información adicional */}
                          <div className="pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-3">
                              Registrado el{" "}
                              {new Date(record.takenAt).toLocaleString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            
                            {/* Notas del Servicio */}
                            {record.serviceNotes && record.serviceNotes.trim() !== "" && (
                              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-purple-600" />
                                  <p className="text-sm text-purple-900">Notas del Servicio</p>
                                </div>
                                <p className="text-sm text-gray-700">{record.serviceNotes}</p>
                              </div>
                            )}
                            
                            {/* Notas de Exploradores */}
                            {record.explorerNotes && Object.keys(record.explorerNotes).length > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-indigo-600" />
                                  <p className="text-sm text-indigo-900">Notas de Exploradores</p>
                                </div>
                                <div className="space-y-2">
                                  {Object.entries(record.explorerNotes)
                                    .filter(([_, note]) => note && note.trim() !== "")
                                    .map(([explorerId, note]) => (
                                      <div key={explorerId} className="p-2 bg-indigo-50 rounded border border-indigo-200">
                                        <p className="text-xs text-indigo-900 mb-1">
                                          {getExplorerName(explorerId)}
                                        </p>
                                        <p className="text-sm text-gray-700">{note}</p>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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