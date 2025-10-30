import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ArrowLeft, Save, Calendar as CalendarIcon, Users } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Explorer {
  id: string;
  nombre: string;
  apellidos: string;
  foto?: string;
}

interface AttendanceRecord {
  explorerId: string;
  attended: boolean;
  justification?: string;
}

// Datos de ejemplo de exploradores
const mockExplorers: Explorer[] = [
  { id: "1", nombre: "Juan Carlos", apellidos: "Pérez García" },
  { id: "2", nombre: "Ana Sofía", apellidos: "Martínez López" },
  { id: "3", nombre: "Diego Alejandro", apellidos: "Rodríguez Hernández" },
  { id: "4", nombre: "María Fernanda", apellidos: "González Ruiz" },
  { id: "5", nombre: "Luis Eduardo", apellidos: "Sánchez Torres" },
];

const meetingTypes = [
  { id: "1", name: "Reunión General" },
  { id: "2", name: "Célula de Niños" },
  { id: "3", name: "Actividad Especial" },
  { id: "4", name: "Campamento" },
];

interface AttendanceTakingProps {
  onBack: () => void;
}

export function AttendanceTaking({ onBack }: AttendanceTakingProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [meetingType, setMeetingType] = useState("");
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [explorers] = useState<Explorer[]>(mockExplorers);

  const handleAttendanceChange = (explorerId: string, attended: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [explorerId]: {
        explorerId,
        attended,
        justification: prev[explorerId]?.justification || "",
      }
    }));
  };

  const handleJustificationChange = (explorerId: string, justification: string) => {
    setAttendance(prev => ({
      ...prev,
      [explorerId]: {
        ...prev[explorerId],
        explorerId,
        attended: prev[explorerId]?.attended || false,
        justification,
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetingType) {
      toast.error("Por favor selecciona el tipo de reunión");
      return;
    }

    // Aquí se guardaría la asistencia en la base de datos
    console.log({
      date: selectedDate,
      meetingType,
      attendance,
    });

    toast.success("Asistencia guardada exitosamente");
  };

  const getInitials = (nombre: string, apellidos: string) => {
    return `${nombre.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  const attendedCount = Object.values(attendance).filter(a => a.attended).length;
  const absentCount = Object.values(attendance).filter(a => !a.attended && a.explorerId in attendance).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <p className="text-base bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Toma de Asistencia
              </p>
              <p className="text-xs text-muted-foreground">
                Registra la asistencia
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-5 pb-safe">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Configuración de la Reunión */}
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm">Fecha de la Reunión *</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingType" className="text-sm">Tipo de Reunión *</Label>
                <Select value={meetingType} onValueChange={setMeetingType} required>
                  <SelectTrigger id="meetingType" className="h-11">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        Reunión {type.id} - {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resumen */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs border-0">
                  Asistieron: {attendedCount}
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs border-0">
                  Faltaron: {absentCount}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs border-0">
                  Total: {explorers.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Exploradores */}
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Users className="w-4 h-4 mr-2" />
                Lista de Exploradores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {explorers.map((explorer) => {
                  const isAttended = attendance[explorer.id]?.attended || false;
                  const justification = attendance[explorer.id]?.justification || "";

                  return (
                    <div
                      key={explorer.id}
                      className="p-4"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Avatar y nombre */}
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={explorer.foto} alt={explorer.nombre} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                            {getInitials(explorer.nombre, explorer.apellidos)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm flex-1 min-w-0 mr-2 font-medium">
                              {explorer.nombre} {explorer.apellidos}
                            </p>

                            {/* Checkbox de asistencia */}
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Checkbox
                                id={`attendance-${explorer.id}`}
                                checked={isAttended}
                                onCheckedChange={(checked) =>
                                  handleAttendanceChange(explorer.id, checked as boolean)
                                }
                                className="h-5 w-5"
                              />
                              <Label
                                htmlFor={`attendance-${explorer.id}`}
                                className="cursor-pointer text-xs"
                              >
                                {isAttended ? (
                                  <span className="text-green-600 font-medium">Asistió</span>
                                ) : (
                                  <span className="text-red-600 font-medium">Faltó</span>
                                )}
                              </Label>
                            </div>
                          </div>

                          {/* Campo de justificación (solo si no asistió) */}
                          {!isAttended && explorer.id in attendance && (
                            <div className="space-y-2 mt-3">
                              <Label htmlFor={`justification-${explorer.id}`} className="text-xs">
                                Justificación
                              </Label>
                              <Textarea
                                id={`justification-${explorer.id}`}
                                placeholder="Motivo de la ausencia (opcional)"
                                value={justification}
                                onChange={(e) =>
                                  handleJustificationChange(explorer.id, e.target.value)
                                }
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3 sticky bottom-0 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pt-4 pb-safe">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
