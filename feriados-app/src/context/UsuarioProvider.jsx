import { useEffect, useState } from "react";
import { getFuncionarioByRutAndVrut } from "../services/funcionarioService";
import PropTypes from "prop-types";
import { UsuarioContext } from "./UsuarioContext";

export const UsuarioProvider = ({ children }) => {
	const [funcionario, setFuncionario] = useState(null);

	useEffect(() => {
		const fetchFuncionario = async () => {
			try {
				const data = await getFuncionarioByRutAndVrut(15721809,3);
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

//13890844, 5 gonzalo
//10397956, 0
//18117330,0 simon