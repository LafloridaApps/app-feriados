// context/FeriadosProvider.jsx
import { useState, useEffect } from "react";
import { FeriadosContext } from "./FeriadosContext";
import PropTypes from "prop-types";
import { getTablaFeriados } from "../services/tablaFeriados";

export const FeriadosProvider = ({ children }) => {
	const [tablaFeriados, setTablaFeriados] = useState([]);

	useEffect(() => {
		const fetchFeriados = async () => {
			try {
				const data = await getTablaFeriados();
				// Temporary fix: Filter out the incorrect holiday
				const filteredData = data.filter(feriado => feriado.fecha.trim() !== '2025-09-08');
				setTablaFeriados(filteredData);
			} catch (error) {
				console.error("Error al obtener feriados:", error);
			}
		};

		fetchFeriados();
	}, []);

	return (
		<FeriadosContext.Provider value={tablaFeriados}>
			{children}
		</FeriadosContext.Provider>
	);
};

FeriadosProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
