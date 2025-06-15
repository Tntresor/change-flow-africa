
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MapPin, Phone, Mail, Users, TrendingUp, Edit, Trash2 } from "lucide-react";

interface Agency {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: "active" | "inactive" | "pending";
  totalTransactions: number;
  monthlyVolume: number;
  commissionRate: number;
}

const mockAgencies: Agency[] = [
  {
    id: "1",
    name: "ExchangeHub Paris",
    country: "France",
    city: "Paris",
    address: "123 Rue de Rivoli, 75001 Paris",
    phone: "+33 1 42 36 78 90",
    email: "paris@exchangehub.com",
    manager: "Marie Dubois",
    status: "active",
    totalTransactions: 1245,
    monthlyVolume: 850000,
    commissionRate: 2.5
  },
  {
    id: "2",
    name: "ExchangeHub Londres",
    country: "Royaume-Uni",
    city: "Londres",
    address: "456 Oxford Street, London W1C 1AP",
    phone: "+44 20 7123 4567",
    email: "london@exchangehub.com",
    manager: "James Smith",
    status: "active",
    totalTransactions: 987,
    monthlyVolume: 1200000,
    commissionRate: 2.8
  },
  {
    id: "3",
    name: "ExchangeHub New York",
    country: "États-Unis",
    city: "New York",
    address: "789 5th Avenue, New York NY 10022",
    phone: "+1 212 555 0123",
    email: "newyork@exchangehub.com",
    manager: "Sarah Johnson",
    status: "pending",
    totalTransactions: 0,
    monthlyVolume: 0,
    commissionRate: 3.0
  }
];

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>(mockAgencies);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Agency["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agences</h1>
          <p className="text-gray-600 mt-2">Gérez votre réseau d'agences de change</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle agence
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle agence</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'agence</Label>
                <Input id="name" placeholder="ExchangeHub..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="uk">Royaume-Uni</SelectItem>
                    <SelectItem value="usa">États-Unis</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" placeholder="Paris, Londres..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Responsable</Label>
                <Input id="manager" placeholder="Nom du responsable" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea id="address" placeholder="Adresse complète de l'agence" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+33 1 23 45 67 89" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="agence@exchangehub.com" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Créer l'agence
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total agences</p>
                <p className="text-2xl font-bold">{agencies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Agences actives</p>
                <p className="text-2xl font-bold">
                  {agencies.filter(a => a.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pays couverts</p>
                <p className="text-2xl font-bold">
                  {new Set(agencies.map(a => a.country)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Volume mensuel</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(agencies.reduce((sum, a) => sum + a.monthlyVolume, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une agence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => (
          <Card key={agency.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {agency.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{agency.name}</CardTitle>
                    <CardDescription>{agency.city}, {agency.country}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(agency.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{agency.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{agency.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{agency.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Responsable: {agency.manager}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Transactions</p>
                    <p className="font-semibold">{agency.totalTransactions}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Volume mensuel</p>
                    <p className="font-semibold">{formatCurrency(agency.monthlyVolume)}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">Commission</p>
                  <p className="font-semibold">{agency.commissionRate}%</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
