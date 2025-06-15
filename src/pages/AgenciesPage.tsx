
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgencyVolumeDisplay } from "@/components/agencies/AgencyVolumeDisplay";
import { EmployeeManager } from "@/components/employees/EmployeeManager";
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  manager: string;
  isActive: boolean;
  employeeCount: number;
}

const mockAgencies: Agency[] = [
  {
    id: "1",
    name: "ExchangeHub Paris",
    address: "123 Avenue des Champs-Élysées",
    city: "Paris",
    country: "France",
    phone: "+33 1 23 45 67 89",
    email: "paris@exchangehub.com",
    manager: "Marie Dubois",
    isActive: true,
    employeeCount: 15
  },
  {
    id: "2", 
    name: "ExchangeHub Londres",
    address: "456 Oxford Street",
    city: "Londres",
    country: "Royaume-Uni",
    phone: "+44 20 7123 4567",
    email: "london@exchangehub.com",
    manager: "John Smith",
    isActive: true,
    employeeCount: 12
  },
  {
    id: "3",
    name: "ExchangeHub Casablanca",
    address: "789 Boulevard Mohammed V",
    city: "Casablanca", 
    country: "Maroc",
    phone: "+212 522 123 456",
    email: "casablanca@exchangehub.com",
    manager: "Ahmed El Fassi",
    isActive: true,
    employeeCount: 18
  }
];

const mockAgencyVolumes = [
  {
    agencyName: "ExchangeHub Paris",
    location: "Paris, France",
    monthlyVolume: 1250000,
    previousMonthVolume: 1100000,
    transactionCount: 2847
  },
  {
    agencyName: "ExchangeHub Londres", 
    location: "Londres, UK",
    monthlyVolume: 980000,
    previousMonthVolume: 1050000,
    transactionCount: 2156
  },
  {
    agencyName: "ExchangeHub Casablanca",
    location: "Casablanca, Maroc", 
    monthlyVolume: 750000,
    previousMonthVolume: 680000,
    transactionCount: 1923
  }
];

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>(mockAgencies);
  const [primaryCurrency] = useState("XOF");
  const [secondaryCurrency] = useState("MAD");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Agences</h1>
          <p className="text-gray-600 mt-2">Gérez votre réseau d'agences et surveillez leurs performances</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Agence
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="management">Gestion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <Card key={agency.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {agency.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={agency.isActive ? "default" : "secondary"}>
                      {agency.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{agency.city}, {agency.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{agency.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{agency.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{agency.employeeCount} employés</span>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600">Manager: {agency.manager}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="volumes" className="space-y-6">
          <AgencyVolumeDisplay
            primaryCurrency={primaryCurrency}
            secondaryCurrency={secondaryCurrency}
            agencies={mockAgencyVolumes}
          />
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <EmployeeManager />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Agences</CardTitle>
              <CardDescription>Gérez les informations de vos agences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agencies.map((agency) => (
                  <div key={agency.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{agency.name}</h4>
                      <p className="text-sm text-gray-600">{agency.address}</p>
                      <p className="text-sm text-gray-600">{agency.city}, {agency.country}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
