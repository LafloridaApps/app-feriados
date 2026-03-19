// context/AppContextProvider.jsx
import { FirmaDigitalProvider } from "./FirmaDigitalProvider";
import { UsuarioProvider } from "./UsuarioProvider";
import { FeriadosProvider } from "./FeriadosProvider";
import PropTypes from "prop-types";
import { SolicitudesNoLeidasProvider } from "./SolicitudesNoLeidasProvider";

import { DepartamentoProvider } from "./DepartamentoProvider";

export const AppContextProvider = ({ children }) => {
    return (
        <UsuarioProvider>
            <DepartamentoProvider>
                <FirmaDigitalProvider>
                    <SolicitudesNoLeidasProvider>
                        <FeriadosProvider>
                            {children}
                        </FeriadosProvider>
                    </SolicitudesNoLeidasProvider>
                </FirmaDigitalProvider>
            </DepartamentoProvider>
        </UsuarioProvider>
    );
};

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
