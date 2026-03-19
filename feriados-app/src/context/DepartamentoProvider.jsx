import { useState, useEffect, useMemo } from "react";
import { DepartamentoContext } from "./DepartamentoContext";
import PropTypes from "prop-types";
import { getDepartamentosList } from "../services/departamentosService";

export const DepartamentoProvider = ({ children }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const response = await getDepartamentosList();
                const data = response.data;
                setDepartamentos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al obtener departamentos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartamentos();
    }, []);

    const contextValue = useMemo(() => ({ departamentos, loading }), [departamentos, loading]);

    return (
        <DepartamentoContext.Provider value={contextValue}>
            {children}
        </DepartamentoContext.Provider>
    );
};

DepartamentoProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
