import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Heart,
  Users,
  Church,
  Edit,
  Save,
  X,
  CheckCircle2,
  XCircle,
  ClipboardCheck
} from "lucide-react";
import { toast } from "sonner@2.0.3";

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

interface AttendanceRecord {
  id: string;
  date: string;
  meetingType: string;
  meetingTypeName: string;
  attended: boolean;
  justification?: string;
}

// Datos de ejemplo (deben coincidir con ExplorersList)
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

// Mock de asistencias por explorador
const mockAttendanceByExplorer: Record<string, AttendanceRecord[]> = {
  "1": [
    { id: "1", date: "2025-10-15", meetingType: "1", meetingTypeName: "Reunión General", attended: true },
    { id: "2", date: "2025-10-12", meetingType: "2", meetingTypeName: "Célula de Niños", attended: true },
    { id: "3", date: "2025-10-08", meetingType: "1", meetingTypeName: "Reunión General", attended: true },
    { id: "4", date: "2025-10-05", meetingType: "3", meetingTypeName: "Actividad Especial", attended: false, justification: "Enfermedad" },
    { id: "5", date: "2025-10-01", meetingType: "1", meetingTypeName: "Reunión General", attended: true },
  ],
  "2": [
    { id: "1", date: "2025-10-15", meetingType: "1", meetingTypeName: "Reunión General", attended: true },
    { id: "2", date: "2025-10-12", meetingType: "2", meetingTypeName: "Célula de Niños", attended: true },
    { id: "3", date: "2025-10-08", meetingType: "1", meetingTypeName: "Reunión General", attended: false },
  ],
  "3": [
    { id: "1", date: "2025-10-15", meetingType: "1", meetingTypeName: "Reunión General", attended: false, justification: "Enfermedad" },
    { id: "2", date: "2025-10-12", meetingType: "2", meetingTypeName: "Célula de Niños", attended: true },
    { id: "3", date: "2025-10-08", meetingType: "1", meetingTypeName: "Reunión General", attended: true },
  ],
  "4": [
    { id: "1", date: "2025-10-15", meetingType: "1", meetingTypeName: "Reunión General", attended: true },
    { id: "2", date: "2025-10-12", meetingType: "2", meetingTypeName: "Célula de Niños", attended: false, justification: "Compromiso escolar" },
    { id: "3", date: "2025-10-08", meetingType: "1", meetingTypeName: "Reunión General", attended: true },
  ],
  "5": [
    { id: "1", date: "2025-10-15", meetingType: "1", meetingTypeName: "Reunión General", attended: false, justification: "Viaje familiar" },
    { id: "2", date: "2025-10-12", meetingType: "2", meetingTypeName: "Célula de Niños", attended: true },
    { id: "3", date: "2025-10-08", meetingType: "1", meetingTypeName: "Reunión General", attended: true },
  ],
};

interface ExplorerDetailProps {
  explorerId: string;
  onBack: () => void;
}

export function ExplorerDetail({ explorerId, onBack }: ExplorerDetailProps) {
  const [explorer, setExplorer] = useState<Explorer | undefined>(
    mockExplorers.find(e => e.id === explorerId)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Explorer | null>(null);
  const attendanceRecords = mockAttendanceByExplorer[explorerId] || [];

  if (!explorer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Explorador no encontrado</p>
            <Button onClick={onBack} className="w-full mt-4">
              Volver al Listado
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getInitials = (nombre: string, apellidos: string) => {
    return `${nombre.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  const handleEdit = () => {
    setEditForm({ ...explorer });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setExplorer(editForm);
      setIsEditing(false);
      setEditForm(null);
      toast.success("Datos actualizados correctamente");
    }
  };

  const handleInputChange = (field: keyof Explorer, value: string | boolean) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const attended = attendanceRecords.filter(r => r.attended).length;
    const absent = total - attended;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
    return { total, attended, absent, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-0">
                <p className="text-sm truncate">Detalles del Explorador</p>
              </div>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 pb-safe">
        {/* Profile Header */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar className="w-24 h-24 mb-3">
                <AvatarImage src={explorer.foto} alt={explorer.nombre} />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-2xl">
                  {getInitials(explorer.nombre, explorer.apellidos)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg mb-1">{explorer.nombre} {explorer.apellidos}</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {calculateAge(explorer.fechaNacimiento)} años
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {explorer.aceptoCristo && (
                  <Badge className="bg-green-100 text-green-800 text-xs border-0">
                    Aceptó a Cristo
                  </Badge>
                )}
                {explorer.bautizado && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs border-0">
                    Bautizado en Agua
                  </Badge>
                )}
                {explorer.asisteCelula && (
                  <Badge className="bg-purple-100 text-purple-800 text-xs border-0">
                    Asiste a Célula
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="datos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="datos">Datos</TabsTrigger>
            <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
          </TabsList>

          {/* Tab de Datos */}
          <TabsContent value="datos" className="space-y-4">
            {isEditing && editForm ? (
              // Modo de edición
              <>
                {/* Datos Personales */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <User className="w-4 h-4 mr-2" />
                      Datos Personales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Nombre</Label>
                      <Input
                        value={editForm.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Apellidos</Label>
                      <Input
                        value={editForm.apellidos}
                        onChange={(e) => handleInputChange("apellidos", e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Fecha de Nacimiento</Label>
                      <Input
                        type="date"
                        value={editForm.fechaNacimiento}
                        onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Teléfono</Label>
                      <Input
                        value={editForm.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Dirección</Label>
                      <Textarea
                        value={editForm.direccion}
                        onChange={(e) => handleInputChange("direccion", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Información Médica */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Heart className="w-4 h-4 mr-2" />
                      Información Médica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Alergias</Label>
                      <Textarea
                        value={editForm.alergias || ""}
                        onChange={(e) => handleInputChange("alergias", e.target.value)}
                        rows={2}
                        placeholder="Especifica las alergias"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Medicina Controlada</Label>
                      <Textarea
                        value={editForm.medicinaControlada || ""}
                        onChange={(e) => handleInputChange("medicinaControlada", e.target.value)}
                        rows={2}
                        placeholder="Especifica medicamentos"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Datos Familiares */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Users className="w-4 h-4 mr-2" />
                      Datos Familiares
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Responsable</Label>
                      <Input
                        value={editForm.nombreResponsable}
                        onChange={(e) => handleInputChange("nombreResponsable", e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Teléfono del Responsable</Label>
                      <Input
                        value={editForm.telefonoResponsable}
                        onChange={(e) => handleInputChange("telefonoResponsable", e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Datos Eclesiásticos */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Church className="w-4 h-4 mr-2" />
                      Datos Eclesiásticos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">¿Aceptó a Cristo?</Label>
                      <RadioGroup
                        value={editForm.aceptoCristo ? "si" : "no"}
                        onValueChange={(value) => handleInputChange("aceptoCristo", value === "si")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="si" id="cristo-si" />
                          <Label htmlFor="cristo-si" className="text-sm">Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="cristo-no" />
                          <Label htmlFor="cristo-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">¿Bautizado?</Label>
                      <RadioGroup
                        value={editForm.bautizado ? "si" : "no"}
                        onValueChange={(value) => handleInputChange("bautizado", value === "si")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="si" id="bautizado-si" />
                          <Label htmlFor="bautizado-si" className="text-sm">Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="bautizado-no" />
                          <Label htmlFor="bautizado-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">¿Asiste a Célula?</Label>
                      <RadioGroup
                        value={editForm.asisteCelula ? "si" : "no"}
                        onValueChange={(value) => handleInputChange("asisteCelula", value === "si")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="si" id="celula-si" />
                          <Label htmlFor="celula-si" className="text-sm">Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="celula-no" />
                          <Label htmlFor="celula-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {editForm.asisteCelula && (
                      <div className="space-y-2">
                        <Label className="text-xs">Líder de Célula</Label>
                        <Input
                          value={editForm.nombreLiderCelula || ""}
                          onChange={(e) => handleInputChange("nombreLiderCelula", e.target.value)}
                          className="h-10"
                          placeholder="Nombre del líder"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              // Modo de visualización
              <>
                {/* Datos Personales */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <User className="w-4 h-4 mr-2" />
                      Datos Personales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Fecha de Nacimiento</p>
                        <p className="text-sm">{formatDate(explorer.fechaNacimiento)}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Teléfono</p>
                        <p className="text-sm">{explorer.telefono}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Dirección</p>
                        <p className="text-sm break-words">{explorer.direccion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Información Médica */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Heart className="w-4 h-4 mr-2" />
                      Información Médica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Alergias</p>
                        <p className="text-sm break-words">{explorer.alergias || "No registra alergias"}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Medicina Controlada</p>
                        <p className="text-sm break-words">{explorer.medicinaControlada || "No requiere medicamentos"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Datos Familiares */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Users className="w-4 h-4 mr-2" />
                      Datos Familiares
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Responsable</p>
                        <p className="text-sm">{explorer.nombreResponsable}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Teléfono del Responsable</p>
                        <p className="text-sm">{explorer.telefonoResponsable}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Datos Eclesiásticos */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Church className="w-4 h-4 mr-2" />
                      Datos Eclesiásticos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Aceptó a Cristo</p>
                        <p className={`text-sm ${explorer.aceptoCristo ? "text-green-600" : "text-slate-600"}`}>
                          {explorer.aceptoCristo ? "Sí" : "No"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bautizado</p>
                        <p className={`text-sm ${explorer.bautizado ? "text-blue-600" : "text-slate-600"}`}>
                          {explorer.bautizado ? "Sí" : "No"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-xs text-muted-foreground">Asiste a Célula</p>
                      <p className={`text-sm ${explorer.asisteCelula ? "text-purple-600" : "text-slate-600"}`}>
                        {explorer.asisteCelula ? "Sí" : "No"}
                      </p>
                    </div>

                    {explorer.asisteCelula && explorer.nombreLiderCelula && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-xs text-muted-foreground">Líder de Célula</p>
                          <p className="text-sm break-words">{explorer.nombreLiderCelula}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Tab de Asistencia */}
          <TabsContent value="asistencia" className="space-y-4">
            {/* Estadísticas de Asistencia */}
            <div className="grid grid-cols-4 gap-2">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-base">{stats.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Asistió</p>
                  <p className="text-base text-green-600">{stats.attended}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Faltó</p>
                  <p className="text-base text-red-600">{stats.absent}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">%</p>
                  <p className="text-base">{stats.percentage}%</p>
                </CardContent>
              </Card>
            </div>

            {/* Historial de Asistencias */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Historial de Asistencias
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {attendanceRecords.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No hay registros de asistencia
                      </p>
                    </div>
                  ) : (
                    attendanceRecords.map((record) => (
                      <div key={record.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
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
                              <Badge variant="outline" className="text-xs">
                                Tipo {record.meetingType}
                              </Badge>
                            </div>
                            <p className="text-sm mb-1">{record.meetingTypeName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(record.date)}
                            </p>
                            {record.justification && (
                              <p className="text-xs text-muted-foreground mt-2 bg-amber-50 p-2 rounded">
                                <span className="font-medium">Justificación:</span> {record.justification}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
