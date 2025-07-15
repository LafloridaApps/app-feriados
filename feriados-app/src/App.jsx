import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./components/Inicio";
import Navbar from "./components/navbar/Nabbar";
import AdministrativosPage from "./components/Pages/Administrativos/AdministrativosPage";
import FeridosPage from "./components/Pages/Feriados/FeriadosPage";
import SolicitudesPage from "./components/Pages/Solicitudes/SolicitudesPage ";
import { AppContextProvider } from "./context/AppContextProvider";
import InboxSolicitudes from "./components/Pages/Inbox/InboxSolicitudes";
import DepartamentosPage from "./components/Pages/Departamentos/DepartamentosPage";

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
                    </Routes>
                </div>
            </AppContextProvider>
        </BrowserRouter>
    );
}

export default App;