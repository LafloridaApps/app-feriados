import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Nabbar";
import AdministrativosPage from "./components/Pages/Administrativos/AdministrativosPage";
import FeridosPage from "./components/Pages/Feriados/FeriadosPage";
import SolicitudesPage from "./components/Pages/Solicitudes/SolicitudesPage ";
import { AppContextProvider } from "./context/AppContextProvider";
import InboxSolicitudes from "./components/Pages/Inbox/InboxSolicitudes";
import DepartamentosPage from "./components/Pages/Departamentos/DepartamentosPage";
import MisSolicitudes from "./components/Pages/MisSolicitudes/MisSolicitudes";
import RRHHPage from "./components/Pages/RRHH/RRHHPage";
import ParametrosPage from "./components/Pages/Parametros/ParametrosPage";
import PaginaDashboard from "./components/Pages/Dashboard/PaginaDashboard";
import Inicio from "./components/Pages/Inicio/Inicio";
import IngresoSubrogancia from "./components/Pages/RRHH/IngresoSubrogancia";

function App() {
    return (
        <BrowserRouter>
            <AppContextProvider>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/administrativos" element={<AdministrativosPage />} />
                        <Route path="/feriados" element={<FeridosPage />} />
                        <Route path="/solicitudes" element={<SolicitudesPage />} />
                        <Route path="/inbox" element={<InboxSolicitudes />} />
                        <Route path="/deptos" element={<DepartamentosPage />} />
                        <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
                        <Route path="/rrhh" element={<RRHHPage />} />
                        <Route path="/parametros/documentos" element={<ParametrosPage />} />
                        <Route path="/dashboard" element={<PaginaDashboard />} />
                        <Route path="/rrhh/subrogancia" element={<IngresoSubrogancia />} />
                    </Routes>
                </div>
            </AppContextProvider>
        </BrowserRouter>
    );
}

export default App;
