import { useEffect, useState } from "react";
import { getFuncionarioApi, getFuncionarioByRutAndVrut } from "../services/funcionarioService";
import PropTypes from "prop-types";
import { UsuarioContext } from "./UsuarioContext";

export const UsuarioProvider = ({ children }) => {
	const [funcionario, setFuncionario] = useState(null);
	const [rut, setRut] = useState(null);


	useEffect(() => {
		const getFuncionarioRut = async () => {
			try {
				const response = await getFuncionarioApi();
				if (response) {
					setRut(response.id_user);
				}
			} catch (error) {
				console.error("Error al obtener el rut del funcionario:", error);
			}
		}

		const urlParams = new URLSearchParams(globalThis.location.search);
		const rutFromUrl = urlParams.get('rut');
		if (rutFromUrl) {
			setRut(rutFromUrl);
			return; // Si encontramos el rut en la URL, no continuamos
		}

		getFuncionarioRut()
	}, []);

	useEffect(() => {
		const fetchFuncionario = async () => {
			if (rut) { // Solo ejecutar si el rut no es null
				try {
					const data = await getFuncionarioByRutAndVrut(rut);
					setFuncionario(data);
				} catch (error) {
					console.error("Error al obtener funcionario:", error);
				}
			}
		};
		fetchFuncionario();
	}, [rut]);

	return (
		<UsuarioContext.Provider value={funcionario}>
			{children}
		</UsuarioContext.Provider>
	);
};


UsuarioProvider.propTypes = {
	children: PropTypes.node.isRequired,
};