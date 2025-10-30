import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { ArrowLeft, Upload, User } from "lucide-react";

interface PersonalDataFormProps {
  onBack: () => void;
}

export function PersonalDataForm({ onBack }: PersonalDataFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [recetaPreview, setRecetaPreview] = useState<string | null>(null);
  const [permisoPreview, setPermisoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Datos Personales
    codigoExplorador: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
    alergias: "",
    medicinaControlada: "",
    estudia: "",
    nivelEducativo: "",
    
    // Datos Familiares
    nombreResponsable: "",
    telefonoResponsable: "",
    
    // Datos Eclesiásticos
    aceptoCristo: "",
    bautizado: "",
    asisteCelula: "",
    nombreLiderCelula: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecetaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePermisoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPermisoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí puedes agregar la lógica para enviar los datos
    alert("Formulario enviado exitosamente");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <p className="text-sm">Registro de Datos</p>
              <p className="text-xs text-muted-foreground">Complete los campos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="px-4 py-4 pb-safe">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SECCIÓN: DATOS PERSONALES */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Datos Personales</CardTitle>
              <CardDescription className="text-xs">Información básica del miembro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Foto */}
              <div className="space-y-2">
                <Label className="text-sm">Fotografía</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('photo')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Subir foto
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="codigoExplorador" className="text-sm">Código de Explorador *</Label>
                  <Input
                    id="codigoExplorador"
                    value={formData.codigoExplorador}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9-]/g, '');
                      const formatted = value
                        .replace(/-/g, '')
                        .substring(0, 6)
                        .replace(/^(\d{3})(\d)/, '$1-$2');
                      handleInputChange("codigoExplorador", formatted);
                    }}
                    placeholder="000-000"
                    maxLength={7}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Formato: 000-000</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingrese el nombre"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos" className="text-sm">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange("apellidos", e.target.value)}
                    placeholder="Ingrese los apellidos"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento" className="text-sm">Fecha de Nacimiento *</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-sm">Teléfono *</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-sm">Dirección *</Label>
                  <Textarea
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange("direccion", e.target.value)}
                    placeholder="Calle, número, colonia, ciudad"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alergias" className="text-sm">Alergias</Label>
                  <Textarea
                    id="alergias"
                    value={formData.alergias}
                    onChange={(e) => handleInputChange("alergias", e.target.value)}
                    placeholder="Especifique alergias"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicinaControlada" className="text-sm">Medicina Controlada</Label>
                  <Textarea
                    id="medicinaControlada"
                    value={formData.medicinaControlada}
                    onChange={(e) => handleInputChange("medicinaControlada", e.target.value)}
                    placeholder="Medicamentos regulares"
                    rows={2}
                  />
                </div>

                {/* Foto de Receta */}
                {formData.medicinaControlada && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm">Foto de Receta Médica</Label>
                      <div className="space-y-3">
                        {recetaPreview && (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-slate-200">
                            <img src={recetaPreview} alt="Receta" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            id="receta"
                            accept="image/*"
                            onChange={handleRecetaChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('receta')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {recetaPreview ? 'Cambiar foto de receta' : 'Subir foto de receta'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Documento de Permiso */}
                    <div className="space-y-2">
                      <Label className="text-sm">Documento de Permiso Firmado</Label>
                      <p className="text-xs text-muted-foreground">
                        Permiso del padre/tutor para manejo de medicina controlada
                      </p>
                      <div className="space-y-3">
                        {permisoPreview && (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-slate-200">
                            <img src={permisoPreview} alt="Permiso" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            id="permiso"
                            accept="image/*,application/pdf"
                            onChange={handlePermisoChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('permiso')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {permisoPreview ? 'Cambiar documento' : 'Subir documento firmado'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Información Educativa */}
                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm">¿Estudia actualmente? *</Label>
                  <RadioGroup
                    value={formData.estudia}
                    onValueChange={(value) => handleInputChange("estudia", value)}
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="estudia-si" />
                      <Label htmlFor="estudia-si" className="cursor-pointer text-sm">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="estudia-no" />
                      <Label htmlFor="estudia-no" className="cursor-pointer text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.estudia === "si" && (
                  <div className="space-y-3">
                    <Label className="text-sm">Nivel Educativo *</Label>
                    <RadioGroup
                      value={formData.nivelEducativo}
                      onValueChange={(value) => handleInputChange("nivelEducativo", value)}
                      required={formData.estudia === "si"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parvularia" id="nivel-parvularia" />
                        <Label htmlFor="nivel-parvularia" className="cursor-pointer text-sm">Parvularia</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basica" id="nivel-basica" />
                        <Label htmlFor="nivel-basica" className="cursor-pointer text-sm">Básica</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="media" id="nivel-media" />
                        <Label htmlFor="nivel-media" className="cursor-pointer text-sm">Media</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="superior" id="nivel-superior" />
                        <Label htmlFor="nivel-superior" className="cursor-pointer text-sm">Superior</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SECCIÓN: DATOS FAMILIARES */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Datos Familiares</CardTitle>
              <CardDescription className="text-xs">Contacto de emergencia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="nombreResponsable" className="text-sm">Nombre del Responsable *</Label>
                <Input
                  id="nombreResponsable"
                  value={formData.nombreResponsable}
                  onChange={(e) => handleInputChange("nombreResponsable", e.target.value)}
                  placeholder="Nombre completo"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefonoResponsable" className="text-sm">Teléfono del Responsable *</Label>
                <Input
                  id="telefonoResponsable"
                  type="tel"
                  value={formData.telefonoResponsable}
                  onChange={(e) => handleInputChange("telefonoResponsable", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECCIÓN: DATOS ECLESIÁSTICOS */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Datos Eclesiásticos</CardTitle>
              <CardDescription className="text-xs">Información espiritual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm">¿Aceptó a Cristo en su corazón? *</Label>
                <RadioGroup
                  value={formData.aceptoCristo}
                  onValueChange={(value) => handleInputChange("aceptoCristo", value)}
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="aceptoCristo-si" />
                    <Label htmlFor="aceptoCristo-si" className="cursor-pointer text-sm">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="aceptoCristo-no" />
                    <Label htmlFor="aceptoCristo-no" className="cursor-pointer text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm">¿Bautizado en agua? *</Label>
                <RadioGroup
                  value={formData.bautizado}
                  onValueChange={(value) => handleInputChange("bautizado", value)}
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="bautizado-si" />
                    <Label htmlFor="bautizado-si" className="cursor-pointer text-sm">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="bautizado-no" />
                    <Label htmlFor="bautizado-no" className="cursor-pointer text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm">¿Asiste a célula? *</Label>
                <RadioGroup
                  value={formData.asisteCelula}
                  onValueChange={(value) => handleInputChange("asisteCelula", value)}
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id="asisteCelula-si" />
                    <Label htmlFor="asisteCelula-si" className="cursor-pointer text-sm">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="asisteCelula-no" />
                    <Label htmlFor="asisteCelula-no" className="cursor-pointer text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.asisteCelula === "si" && (
                <div className="space-y-2">
                  <Label htmlFor="nombreLiderCelula" className="text-sm">Nombre del Líder de Célula *</Label>
                  <Input
                    id="nombreLiderCelula"
                    value={formData.nombreLiderCelula}
                    onChange={(e) => handleInputChange("nombreLiderCelula", e.target.value)}
                    placeholder="Nombre completo del líder"
                    required={formData.asisteCelula === "si"}
                    className="h-11"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3 sticky bottom-0 bg-gradient-to-br from-slate-50 to-slate-100 pt-4 pb-safe">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-11">
              Guardar
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}