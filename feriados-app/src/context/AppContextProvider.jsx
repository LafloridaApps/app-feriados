// context/AppContextProvider.jsx
import { FirmaDigitalProvider } from "./FirmaDigitalProvider";
import { UsuarioProvider } from "./UsuarioProvider";
import { FeriadosProvider } from "./FeriadosProvider";
import PropTypes from "prop-types";
import { SolicitudesNoLeidasProvider } from "./SolicitudesNoLeidasProvider";

export const AppContextProvider = ({ children }) => {
    return (
        <UsuarioProvider>
            <FirmaDigitalProvider>
                <SolicitudesNoLeidasProvider>
                    <FeriadosProvider>
                        {children}
                    </FeriadosProvider>
                </SolicitudesNoLeidasProvider>
            </FirmaDigitalProvider>
        </UsuarioProvider>
    );
};

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
