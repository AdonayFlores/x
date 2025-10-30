import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Plus,
  Calendar as CalendarIcon,
  Filter,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Movement {
  id: string;
  type: "entrada" | "salida";
  amount: number;
  category: string;
  description: string;
  date: string;
  recipient: string;
}

// Datos de ejemplo
const mockMovements: Movement[] = [
  {
    id: "1",
    type: "entrada",
    amount: 5000,
    category: "Donaciones",
    description: "Ofrenda general del domingo",
    date: "2025-10-15",
    recipient: "Iglesia",
  },
  {
    id: "2",
    type: "salida",
    amount: 1200,
    category: "Material",
    description: "Compra de material didáctico",
    date: "2025-10-14",
    recipient: "Proveedor",
  },
  {
    id: "3",
    type: "entrada",
    amount: 3000,
    category: "Eventos",
    description: "Pago de campamento",
    date: "2025-10-12",
    recipient: "Organizador",
  },
  {
    id: "4",
    type: "salida",
    amount: 800,
    category: "Alimentos",
    description: "Snacks para reunión",
    date: "2025-10-10",
    recipient: "Supermercado",
  },
  {
    id: "5",
    type: "entrada",
    amount: 2500,
    category: "Donaciones",
    description: "Donación especial",
    date: "2025-10-08",
    recipient: "Donante",
  },
  {
    id: "6",
    type: "salida",
    amount: 1500,
    category: "Transporte",
    description: "Renta de autobús",
    date: "2025-10-05",
    recipient: "Empresa de Transporte",
  },
  {
    id: "7",
    type: "entrada",
    amount: 1800,
    category: "Eventos",
    description: "Inscripción retiro juvenil",
    date: "2025-09-28",
    recipient: "Participantes",
  },
  {
    id: "8",
    type: "salida",
    amount: 950,
    category: "Material",
    description: "Biblia para nuevos miembros",
    date: "2025-09-20",
    recipient: "Librería",
  },
];

const categories = [
  "Donaciones",
  "Eventos",
  "Material",
  "Alimentos",
  "Transporte",
  "Servicios",
  "Otros",
];

interface FinanceManagerProps {
  onBack: () => void;
}

export function FinanceManager({ onBack }: FinanceManagerProps) {
  const [movements, setMovements] = useState<Movement[]>(mockMovements);
  const [filterType, setFilterType] = useState<"all" | "entrada" | "salida">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reciboPreview, setReciboPreview] = useState<string | null>(null);
  
  // Form state
  const [newMovement, setNewMovement] = useState({
    type: "entrada" as "entrada" | "salida",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    recipient: "",
  });

  // Filtrar movimientos por fecha y tipo
  const filteredMovements = movements
    .filter(m => filterType === "all" || m.type === filterType)
    .filter(m => {
      if (!startDate && !endDate) return true;
      const movementDate = new Date(m.date);
      const start = startDate ? new Date(startDate) : new Date("1900-01-01");
      const end = endDate ? new Date(endDate) : new Date("2100-12-31");
      return movementDate >= start && movementDate <= end;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calcular balance (con filtros aplicados)
  const totalEntradas = filteredMovements
    .filter(m => m.type === "entrada")
    .reduce((sum, m) => sum + m.amount, 0);
  
  const totalSalidas = filteredMovements
    .filter(m => m.type === "salida")
    .reduce((sum, m) => sum + m.amount, 0);
  
  const balance = totalEntradas - totalSalidas;

  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault();
    
    const movement: Movement = {
      id: Date.now().toString(),
      type: newMovement.type,
      amount: parseFloat(newMovement.amount),
      category: newMovement.category,
      description: newMovement.description,
      date: newMovement.date,
      recipient: newMovement.recipient,
    };

    setMovements([movement, ...movements]);
    
    // Reset form
    setNewMovement({
      type: "entrada",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      recipient: "",
    });
    
    setReciboPreview(null);
    setIsDialogOpen(false);
    toast.success("Movimiento agregado exitosamente");
  };

  const handleReciboChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReciboPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <p className="text-base bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Finanzas
                </p>
                <p className="text-xs text-muted-foreground">Gestión de ingresos y gastos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-5 pb-safe">
        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Card className="border">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Entradas</p>
                <p className="text-sm text-green-600 font-medium">{formatCurrency(totalEntradas)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-2">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Salidas</p>
                <p className="text-sm text-red-600 font-medium">{formatCurrency(totalSalidas)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl flex items-center justify-center mb-2`}>
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className={`text-sm font-medium ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-5">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600">
                <Plus className="w-5 h-5 mr-2" />
                Agregar Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nuevo Movimiento</DialogTitle>
                <DialogDescription className="text-xs">
                  Registra un ingreso o gasto
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMovement} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm">Tipo *</Label>
                  <Select
                    value={newMovement.type}
                    onValueChange={(value: "entrada" | "salida") =>
                      setNewMovement({ ...newMovement, type: value })
                    }
                  >
                    <SelectTrigger id="type" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada (Ingreso)</SelectItem>
                      <SelectItem value="salida">Salida (Gasto)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm">Cantidad *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newMovement.amount}
                    onChange={(e) =>
                      setNewMovement({ ...newMovement, amount: e.target.value })
                    }
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm">Categoría *</Label>
                  <Select
                    value={newMovement.category}
                    onValueChange={(value) =>
                      setNewMovement({ ...newMovement, category: value })
                    }
                  >
                    <SelectTrigger id="category" className="h-11">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newMovement.date}
                    onChange={(e) =>
                      setNewMovement({ ...newMovement, date: e.target.value })
                    }
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el movimiento"
                    value={newMovement.description}
                    onChange={(e) =>
                      setNewMovement({ ...newMovement, description: e.target.value })
                    }
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-sm">Destinatario/Origen *</Label>
                  <Input
                    id="recipient"
                    placeholder="Nombre del destinatario/origen"
                    value={newMovement.recipient}
                    onChange={(e) =>
                      setNewMovement({ ...newMovement, recipient: e.target.value })
                    }
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recibo" className="text-sm">Recibo (Opcional)</Label>
                  <Input
                    id="recibo"
                    type="file"
                    accept="image/*"
                    onChange={handleReciboChange}
                    className="h-11"
                  />
                </div>

                {reciboPreview && (
                  <div className="space-y-2">
                    <Label className="text-sm">Vista Previa del Recibo</Label>
                    <img
                      src={reciboPreview}
                      alt="Recibo"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 h-11"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 h-11">
                    Guardar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros de Tipo */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className="flex-1 h-10"
          >
            <Filter className="w-4 h-4 mr-1" />
            Todos
          </Button>
          <Button
            variant={filterType === "entrada" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("entrada")}
            className="flex-1 h-10"
          >
            Entradas
          </Button>
          <Button
            variant={filterType === "salida" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("salida")}
            className="flex-1 h-10"
          >
            Salidas
          </Button>
        </div>

        {/* Filtros de Fecha */}
        <Card className="border mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Filtrar por Fecha
              </span>
              {(startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDateFilters}
                  className="h-8 text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs">Fecha Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs">Fecha Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
            {(startDate || endDate) && (
              <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded-md">
                {filteredMovements.length} movimiento(s) encontrado(s)
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Movimientos */}
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Movimientos Recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredMovements.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay movimientos para mostrar
                  </p>
                </div>
              ) : (
                filteredMovements.map((movement) => (
                  <div key={movement.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className={
                              movement.type === "entrada"
                                ? "bg-green-100 text-green-800 text-xs"
                                : "bg-red-100 text-red-800 text-xs"
                            }
                          >
                            {movement.type === "entrada" ? "Entrada" : "Salida"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {movement.category}
                          </Badge>
                        </div>
                        <p className="text-sm mb-1 break-words font-medium">
                          {movement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {movement.recipient}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{formatDate(movement.date)}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-base font-medium ${
                            movement.type === "entrada"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {movement.type === "entrada" ? "+" : "-"}
                          {formatCurrency(movement.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
