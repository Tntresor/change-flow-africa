
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Database, 
  Mail,
  Smartphone,
  Download,
  Upload,
  Key,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  newTransaction: boolean;
  dailyReport: boolean;
  weeklyReport: boolean;
  securityAlerts: boolean;
}

interface GeneralSettings {
  companyName: string;
  defaultCurrency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  numberFormat: string;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    newTransaction: true,
    dailyReport: true,
    weeklyReport: true,
    securityAlerts: true
  });

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    companyName: "ExchangeHub",
    defaultCurrency: "EUR",
    timezone: "Europe/Paris",
    language: "fr",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1 234,56"
  });

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const updateGeneralSetting = (key: keyof GeneralSettings, value: string) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-2">Configurez votre application et préférences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter config
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Intégrations
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Sauvegarde
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Configuration de base de votre application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) => updateGeneralSetting('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                  <Select
                    value={generalSettings.defaultCurrency}
                    onValueChange={(value) => updateGeneralSetting('defaultCurrency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dollar US (USD)</SelectItem>
                      <SelectItem value="GBP">Livre Sterling (GBP)</SelectItem>
                      <SelectItem value="CAD">Dollar Canadien (CAD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => updateGeneralSetting('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                      <SelectItem value="America/Toronto">America/Toronto (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => updateGeneralSetting('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formats d'affichage</CardTitle>
              <CardDescription>Personnalisez l'affichage des dates et nombres</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Format de date</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) => updateGeneralSetting('dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberFormat">Format des nombres</Label>
                  <Select
                    value={generalSettings.numberFormat}
                    onValueChange={(value) => updateGeneralSetting('numberFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 234,56">1 234,56 (Français)</SelectItem>
                      <SelectItem value="1,234.56">1,234.56 (Anglais)</SelectItem>
                      <SelectItem value="1.234,56">1.234,56 (Allemand)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canaux de notification</CardTitle>
              <CardDescription>Choisissez comment recevoir vos notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-gray-600">Recevez les alertes par email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => updateNotification('email', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-gray-600">Alertes en temps réel dans l'application</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => updateNotification('push', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Notifications SMS</p>
                    <p className="text-sm text-gray-600">Messages texte pour les alertes critiques</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => updateNotification('sms', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types de notifications</CardTitle>
              <CardDescription>Sélectionnez les événements qui déclenchent des notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouvelles transactions</p>
                    <p className="text-sm text-gray-600">Alerte pour chaque nouvelle transaction</p>
                  </div>
                  <Switch
                    checked={notifications.newTransaction}
                    onCheckedChange={(checked) => updateNotification('newTransaction', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rapport quotidien</p>
                    <p className="text-sm text-gray-600">Résumé des activités du jour</p>
                  </div>
                  <Switch
                    checked={notifications.dailyReport}
                    onCheckedChange={(checked) => updateNotification('dailyReport', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rapport hebdomadaire</p>
                    <p className="text-sm text-gray-600">Analyse des performances de la semaine</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => updateNotification('weeklyReport', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes de sécurité</p>
                    <p className="text-sm text-gray-600">Notifications pour les événements de sécurité</p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => updateNotification('securityAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentification</CardTitle>
              <CardDescription>Gérez vos paramètres de sécurité et accès</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authentification à deux facteurs (2FA)</p>
                    <p className="text-sm text-gray-600">Sécurité renforcée avec code SMS</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sessions multiples</p>
                    <p className="text-sm text-gray-600">Autorise plusieurs connexions simultanées</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Déconnexion automatique</p>
                    <p className="text-sm text-gray-600">Après 30 minutes d'inactivité</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clés API</CardTitle>
              <CardDescription>Gérez vos clés d'accès API pour les intégrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Clé de production</p>
                    <p className="text-sm text-gray-600 font-mono">••••••••••••••••••••••••abcd1234</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Régénérer</Button>
                  <Button variant="outline" size="sm">Copier</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Clé de test</p>
                    <p className="text-sm text-gray-600 font-mono">••••••••••••••••••••••••test5678</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Régénérer</Button>
                  <Button variant="outline" size="sm">Copier</Button>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Créer nouvelle clé
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations actives</CardTitle>
              <CardDescription>Connectez ExchangeHub à vos outils externes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-gray-600">Traitement des paiements</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">SendGrid</p>
                    <p className="text-sm text-gray-600">Service d'envoi d'emails</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Webhook</p>
                    <p className="text-sm text-gray-600">Notifications en temps réel</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-800">Non configuré</Badge>
                  <Button variant="outline" size="sm">Connecter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thème et affichage</CardTitle>
              <CardDescription>Personnalisez l'apparence de votre interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Densité d'affichage</Label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Confortable</SelectItem>
                      <SelectItem value="spacious">Espacé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Couleur d'accent</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-blue-200"></div>
                    <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                    <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                    <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                    <div className="w-8 h-8 bg-orange-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sauvegarde automatique</CardTitle>
              <CardDescription>Configurez la sauvegarde de vos données</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sauvegarde quotidienne</p>
                  <p className="text-sm text-gray-600">Sauvegarde automatique chaque jour à 2h00</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Dernière sauvegarde</p>
                      <p className="text-sm text-green-700">Aujourd'hui à 02:00 - 2.3 GB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restauration</CardTitle>
              <CardDescription>Restaurez vos données à partir d'une sauvegarde</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  La restauration remplacera toutes les données actuelles. Cette action est irréversible.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger sauvegarde
                </Button>
                <Button variant="outline" className="flex-1">
                  <Database className="w-4 h-4 mr-2" />
                  Restaurer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
