// context/AppContextProvider.jsx
import { UsuarioProvider } from "./UsuarioProvider";
import { FeriadosProvider } from "./FeriadosProvider";
import PropTypes from "prop-types";
import { SolicitudesNoLeidasProvider } from "./SolicitudesNoLeidasProvider";

export const AppContextProvider = ({ children }) => {
    return (
        <UsuarioProvider>
            <SolicitudesNoLeidasProvider>
                <FeriadosProvider>
                    {children}
                </FeriadosProvider>
            </SolicitudesNoLeidasProvider>
        </UsuarioProvider>
    );
};

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
