
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MakerCheckerTest } from "@/components/test/MakerCheckerTest";
import { TransactionCancellationTest } from "@/components/test/TransactionCancellationTest";
import { LedgerTest } from "@/components/test/LedgerTest";
import { TestingGuide } from "@/components/test/TestingGuide";

export default function TestNew() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test des nouvelles fonctionnalités</h1>
        <p className="text-gray-600">
          Testez les fonctionnalités Maker-Checker, Annulation de transactions et Micro-Ledger
        </p>
      </div>

      <TestingGuide />

      <Tabs defaultValue="maker-checker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="maker-checker">Maker-Checker</TabsTrigger>
          <TabsTrigger value="cancellation">Annulation</TabsTrigger>
          <TabsTrigger value="ledger">Micro-Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="maker-checker">
          <MakerCheckerTest />
        </TabsContent>

        <TabsContent value="cancellation">
          <TransactionCancellationTest />
        </TabsContent>

        <TabsContent value="ledger">
          <LedgerTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
