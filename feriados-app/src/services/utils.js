import { getTablaFeriados } from "./tablaFeriados";

export function formatFecha(fechaIso) {
	const fecha = new Date(fechaIso + "T00:00:00");
	const dia = String(fecha.getDate()).padStart(2, '0');
	const mes = String(fecha.getMonth() + 1).padStart(2, '0');
	const anio = fecha.getFullYear();
	return `${dia}-${mes}-${anio}`;
}



export function fechaActual() {
	const ahora = new Date();
	const fechaLocal = new Date(ahora.getTime() - (ahora.getTimezoneOffset() * 60 * 1000));

	const year = fechaLocal.getFullYear();
	const month = String(fechaLocal.getMonth() + 1).padStart(2, '0');
	const day = String(fechaLocal.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}


export async function calculoDiasAusar(fechaInicio, fechaFin, tipoSolicitud, jornadaInicio = null, jornadaFin = null) {
	const inicio = new Date(fechaInicio + "T00:00:00");
	const fin = new Date(fechaFin + "T00:00:00");

	if (inicio > fin) return 0;

	let count = 0;
	let current = new Date(inicio);

	const feriadosResponse = await obtenerFeriados();
	const feriados = feriadosResponse.map(f => f.fecha);

	while (current <= fin) {
		if (esDiaHabil(current, feriados)) {
			count++;
		}
		current.setDate(current.getDate() + 1);
	}

	if (tipoSolicitud === "ADMINISTRATIVO") {
		if (fechaInicio === fechaFin) {
			return calcularDiasAdministrativoMismoDia(jornadaInicio, jornadaFin);
		}

		let ajusteInicio = 0;
		let ajusteFin = 0;

		if (esDiaHabil(inicio, feriados) && jornadaInicio === "PM") {
			ajusteInicio = 0.5;
		}
		if (esDiaHabil(fin, feriados) && jornadaFin === "AM") {
			ajusteFin = 0.5;
		}

		return count - ajusteInicio - ajusteFin;
	}

	return count;
}

function calcularDiasAdministrativoMismoDia(jornadaInicio, jornadaFin) {
	if (jornadaInicio === "AM" && jornadaFin === "PM") {
		return 1;
	} else if (jornadaInicio === "AM" || jornadaFin === "PM") {
		return 0.5;
	} else {
		return 0;
	}
}

function esDiaHabil(date, feriados) {
	const dia = date.getDay(); // 0 = domingo, 6 = sábado
	const fechaStr = date.toISOString().split("T")[0];
	return dia !== 0 && dia !== 6 && !feriados.includes(fechaStr);
}

const obtenerFeriados = async () => {
	try {
		const response = await getTablaFeriados();
		return response;
	} catch (error) {
		console.error('Error al obtener los feriados:', error);
		throw error;
	}
};
export function formatFechaString(fecha) {

	const fechaString = fecha.substring(0, 10)

	const anio = fechaString.substring(0, 4);
	const mes = fechaString.substring(5, 7);
	const dia = fechaString.substring(8, 10);

	return `${dia}-${mes}-${anio}`;
}



