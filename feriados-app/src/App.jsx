import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Nabbar";
import AdministrativosPage from "./components/Pages/Administrativos/AdministrativosPage";
import FeriadosPage from "./components/Pages/Feriados/FeriadosPage";
import SolicitudesPage from "./components/Pages/Solicitudes/SolicitudesPage";
import { AppContextProvider } from "./context/AppContextProvider";
import InboxSolicitudes from "./components/Pages/Inbox/InboxSolicitudes";
import DepartamentosPage from "./components/Pages/Departamentos/DepartamentosPage";
import MisSolicitudes from "./components/Pages/MisSolicitudes/MisSolicitudes";
import RRHHPage from "./components/Pages/RRHH/RRHHPage";
import ParametrosPage from "./components/Pages/Parametros/ParametrosPage";
import PaginaDashboard from "./components/Pages/Dashboard/PaginaDashboard";
import Inicio from "./components/Pages/Inicio/Inicio";
import IngresoSubrogancia from "./components/Pages/RRHH/IngresoSubrogancia";
import GestionUsuariosPage from "./components/Pages/Administracion/Usuarios/GestionUsuariosPage";
import GestionModulosPage from "./components/Pages/Administracion/Modulos/GestionModulosPage";
import Footer from "./components/footer/Footer";

function App() {
    return (
        <AppContextProvider>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="container mt-4 flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<Inicio />} />
                        <Route path="/administrativos" element={<AdministrativosPage />} />
                        <Route path="/feriados" element={<FeriadosPage />} />
                        <Route path="/solicitudes" element={<SolicitudesPage />} />
                        <Route path="/inbox" element={<InboxSolicitudes />} />
                        <Route path="/deptos" element={<DepartamentosPage />} />
                        <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
                        <Route path="/rrhh" element={<RRHHPage />} />
                        <Route path="/parametros/documentos" element={<ParametrosPage />} />
                        <Route path="/dashboard" element={<PaginaDashboard />} />
                        <Route path="/rrhh/subrogancia" element={<IngresoSubrogancia />} />
                        <Route path="/administracion/usuarios" element={<GestionUsuariosPage />} />
                        <Route path="/administracion/modulos" element={<GestionModulosPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </AppContextProvider>
    );
}

export default App;
