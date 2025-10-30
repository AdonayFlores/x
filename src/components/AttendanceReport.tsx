import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Users, 
  CheckCircle2, 
  XCircle,
  FileText,
  TrendingUp
} from "lucide-react";

interface AttendanceRecord {
  explorerId: string;
  explorerName: string;
  attended: boolean;
  justification?: string;
  foto?: string;
}

interface Meeting {
  id: string;
  date: string;
  meetingType: string;
  meetingTypeName: string;
  attendanceRecords: AttendanceRecord[];
}

// Datos de ejemplo de reuniones con asistencia
const mockMeetings: Meeting[] = [
  {
    id: "1",
    date: "2025-10-15",
    meetingType: "1",
    meetingTypeName: "Reunión General",
    attendanceRecords: [
      {
        explorerId: "1",
        explorerName: "Juan Carlos Pérez García",
        attended: true,
      },
      {
        explorerId: "2",
        explorerName: "Ana Sofía Martínez López",
        attended: true,
      },
      {
        explorerId: "3",
        explorerName: "Diego Alejandro Rodríguez Hernández",
        attended: false,
        justification: "Enfermedad",
      },
      {
        explorerId: "4",
        explorerName: "María Fernanda González Ruiz",
        attended: true,
      },
      {
        explorerId: "5",
        explorerName: "Luis Eduardo Sánchez Torres",
        attended: false,
        justification: "Viaje familiar",
      },
    ],
  },
  {
    id: "2",
    date: "2025-10-12",
    meetingType: "2",
    meetingTypeName: "Célula de Niños",
    attendanceRecords: [
      {
        explorerId: "1",
        explorerName: "Juan Carlos Pérez García",
        attended: true,
      },
      {
        explorerId: "2",
        explorerName: "Ana Sofía Martínez López",
        attended: true,
      },
      {
        explorerId: "3",
        explorerName: "Diego Alejandro Rodríguez Hernández",
        attended: true,
      },
      {
        explorerId: "4",
        explorerName: "María Fernanda González Ruiz",
        attended: false,
        justification: "Compromiso escolar",
      },
      {
        explorerId: "5",
        explorerName: "Luis Eduardo Sánchez Torres",
        attended: true,
      },
    ],
  },
  {
    id: "3",
    date: "2025-10-08",
    meetingType: "1",
    meetingTypeName: "Reunión General",
    attendanceRecords: [
      {
        explorerId: "1",
        explorerName: "Juan Carlos Pérez García",
        attended: true,
      },
      {
        explorerId: "2",
        explorerName: "Ana Sofía Martínez López",
        attended: false,
      },
      {
        explorerId: "3",
        explorerName: "Diego Alejandro Rodríguez Hernández",
        attended: true,
      },
      {
        explorerId: "4",
        explorerName: "María Fernanda González Ruiz",
        attended: true,
      },
      {
        explorerId: "5",
        explorerName: "Luis Eduardo Sánchez Torres",
        attended: true,
      },
    ],
  },
];

interface AttendanceReportProps {
  onBack: () => void;
}

export function AttendanceReport({ onBack }: AttendanceReportProps) {
  const [meetings] = useState<Meeting[]>(mockMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getAttendanceStats = (meeting: Meeting) => {
    const attended = meeting.attendanceRecords.filter(r => r.attended).length;
    const absent = meeting.attendanceRecords.filter(r => !r.attended).length;
    const total = meeting.attendanceRecords.length;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
    
    return { attended, absent, total, percentage };
  };

  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    return `${names[0].charAt(0)}${names[1]?.charAt(0) || ''}`.toUpperCase();
  };

  if (selectedMeeting) {
    const stats = getAttendanceStats(selectedMeeting);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedMeeting(null)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <p className="text-base bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent truncate">
                  Detalle de Asistencia
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {new Date(selectedMeeting.date).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-5 pb-safe">
          {/* Estadísticas - Grid optimizado para móvil */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Card className="border">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Tipo de Reunión</p>
                  <p className="text-sm truncate font-medium">
                    {selectedMeeting.meetingTypeName}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Asistencia</p>
                  <p className="text-sm text-green-600 font-medium">
                    {stats.attended} / {stats.total}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Ausencias</p>
                  <p className="text-sm text-red-600 font-medium">
                    {stats.absent}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-1">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium">
                    {stats.percentage}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Asistencia - Tarjetas en lugar de tabla */}
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Registro de Asistencia</CardTitle>
              <CardDescription className="text-xs">
                Detalles de cada explorador
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {selectedMeeting.attendanceRecords.map((record) => (
                  <div key={record.explorerId} className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={record.foto} alt={record.explorerName} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                          {getInitials(record.explorerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm mb-2 break-words font-medium">{record.explorerName}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          {record.attended ? (
                            <Badge className="bg-green-100 text-green-800 text-xs border-0">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Asistió
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 text-xs border-0">
                              <XCircle className="w-3 h-3 mr-1" />
                              No asistió
                            </Badge>
                          )}
                        </div>
                        {record.justification && (
                          <p className="text-xs text-muted-foreground break-words bg-amber-50 p-2 rounded-md">
                            <span className="font-medium">Justificación:</span> {record.justification}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <p className="text-base bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Reporte de Asistencia
              </p>
              <p className="text-xs text-muted-foreground">
                Historial de reuniones
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-5 pb-safe">
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const stats = getAttendanceStats(meeting);

            return (
              <Card 
                key={meeting.id}
                className="cursor-pointer border"
                onClick={() => setSelectedMeeting(meeting)}
              >
                <CardContent className="p-4">
                  {/* Header de la tarjeta */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm truncate font-medium">{meeting.meetingTypeName}</p>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          Tipo {meeting.meetingType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(meeting.date).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Estadísticas en línea */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Asistencia</p>
                      <p className="text-sm text-green-600 font-medium">
                        {stats.attended}/{stats.total}
                      </p>
                    </div>

                    <div className="h-8 w-px bg-border" />

                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Porcentaje</p>
                      <p className="text-sm font-medium">
                        {stats.percentage}%
                      </p>
                    </div>

                    <div className="h-8 w-px bg-border" />

                    <div className="flex-1 flex justify-center">
                      <Button variant="ghost" size="sm" className="h-8">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {meetings.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay registros de asistencia disponibles
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
