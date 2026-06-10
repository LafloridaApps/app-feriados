// context/AppContextProvider.jsx
import { UsuarioProvider } from "./UsuarioProvider";
import { FeriadosProvider } from "./FeriadosProvider";
import PropTypes from "prop-types";
import { SolicitudesNoLeidasProvider } from "./SolicitudesNoLeidasProvider";

import { DepartamentoProvider } from "./DepartamentoProvider";

export const AppContextProvider = ({ children }) => {
    return (
        <UsuarioProvider>
            <DepartamentoProvider>
                <SolicitudesNoLeidasProvider>
                    <FeriadosProvider>
                        {children}
                    </FeriadosProvider>
                </SolicitudesNoLeidasProvider>
            </DepartamentoProvider>
        </UsuarioProvider>
    );
};

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
