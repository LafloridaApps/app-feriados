import { useEffect, useState } from "react";
import { getFuncionarioByRut } from "../services/funcionarioService";
import PropTypes from "prop-types";
import { UsuarioContext } from "./UsuarioContext";

export const UsuarioProvider = ({ children }) => {
	const [funcionario, setFuncionario] = useState(null);

	useEffect(() => {
		const fetchFuncionario = async () => {
			try {
				const data = await getFuncionarioByRut(10397956);
				setFuncionario(data);
			} catch (error) {
				console.error("Error al obtener funcionario:", error);
			}
		};

		fetchFuncionario();
	}, []);

	return (
		<UsuarioContext.Provider value={funcionario}>
			{children}
		</UsuarioContext.Provider>
	);
};


UsuarioProvider.propTypes = {
	children: PropTypes.node.isRequired,
};