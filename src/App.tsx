import { DataTable } from "./components/data-table/data-table";

function App() {
  return (
    <main className="bg-background min-h-screen font-['Geist']">
      <div className="py-4 px-6 pb-0">
        <h3 className="text-2xl font-bold">Table Rules</h3>
      </div>
      <DataTable />
    </main>
  );
}

export default App;
