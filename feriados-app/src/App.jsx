import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import AdministrativosPage from "./components/Pages/Administrativos/AdministrativosPage";
import FeriadosPage from "./components/Pages/Feriados/FeriadosPage";
import PaginaSolicitudes from "./components/Pages/Solicitudes/PaginaSolicitudes";
import AsistenciaPage from "./components/Pages/Asistencia/AsistenciaPage";
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
import { GestionSolicitudes } from "./components/Pages/Administracion/Gestion/GestionSolicitudes";

function App() {
    return (
        <AppContextProvider>
            <div className="d-flex min-vh-100">
                <Sidebar />
                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <main className="container-fluid px-4 py-4 flex-grow-1">
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" />} />
                            <Route path="/home" element={<Inicio />} />
                            <Route path="/administrativos" element={<AdministrativosPage />} />
                            <Route path="/feriados" element={<FeriadosPage />} />
                            <Route path="/solicitudes" element={<PaginaSolicitudes />} />
                            <Route path="/asistencia" element={<AsistenciaPage />} />
                            <Route path="/inbox" element={<InboxSolicitudes />} />
                            <Route path="/deptos" element={<DepartamentosPage />} />
                            <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
                            <Route path="/rrhh" element={<RRHHPage />} />
                            <Route path="/parametros/documentos" element={<ParametrosPage />} />
                            <Route path="/dashboard" element={<PaginaDashboard />} />
                            <Route path="/rrhh/subrogancia" element={<IngresoSubrogancia />} />
                            <Route path="/administracion/usuarios" element={<GestionUsuariosPage />} />
                            <Route path="/administracion/modulos" element={<GestionModulosPage />} />
                            <Route path="/administracion/adm-solicitudes" element={<GestionSolicitudes />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </div>
        </AppContextProvider>
    );
}

export default App;
