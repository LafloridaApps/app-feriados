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


function parseDateAsLocal(dateString) {
	const [year, month, day] = dateString.split('-').map(Number);
	return new Date(year, month - 1, day);
}

export function calculoDiasAusar(fechaInicio, fechaFin, tipoSolicitud, fechasFeriadas, jornadaInicio = null, jornadaFin = null, diasCorridos = false) {
	if (!fechaInicio || !fechaFin) return 0;
	const inicio = parseDateAsLocal(fechaInicio);
	const fin = parseDateAsLocal(fechaFin);

	if (inicio > fin) return 0;

	const feriados = fechasFeriadas || [];
	const totalDays = calcularTotalDias(inicio, fin);

	if (diasCorridos) {
		return calcularDiasCorridos(totalDays, tipoSolicitud, jornadaInicio, jornadaFin);
	}

	const diasHabiles = contarDiasHabiles(inicio, totalDays, feriados);
	if (tipoSolicitud !== "ADMINISTRATIVO") return diasHabiles;

	return calcularDiasAdministrativo(
		diasHabiles,
		inicio,
		fin,
		feriados,
		jornadaInicio,
		jornadaFin,
		fechaInicio === fechaFin
	);
}

function calcularTotalDias(inicio, fin) {
	const oneDay = 1000 * 60 * 60 * 24;
	return Math.round(Math.abs((fin.getTime() - inicio.getTime()) / oneDay)) + 1;
}

function calcularDiasCorridos(totalDays, tipoSolicitud, jornadaInicio, jornadaFin) {
	const esAdministrativo = tipoSolicitud === "ADMINISTRATIVO";
	const ajusteInicio = obtenerAjusteJornada(jornadaInicio, "PM", esAdministrativo);
	const ajusteFin = obtenerAjusteJornada(jornadaFin, "AM", esAdministrativo);
	return totalDays - ajusteInicio - ajusteFin;
}

function contarDiasHabiles(inicio, totalDays, feriados) {
	let count = 0;
	let current = new Date(inicio);

	for (let i = 0; i < totalDays; i++) {
		if (esDiaHabil(current, feriados)) {
			count++;
		}
		current.setDate(current.getDate() + 1);
	}

	return count;
}

function calcularDiasAdministrativo(diasHabiles, inicio, fin, feriados, jornadaInicio, jornadaFin, esMismoDia) {
	if (esMismoDia) {
		return calcularDiasAdministrativoMismoDia(jornadaInicio, jornadaFin);
	}

	const ajusteInicio = obtenerAjusteJornada(jornadaInicio, "PM", esDiaHabil(inicio, feriados));
	const ajusteFin = obtenerAjusteJornada(jornadaFin, "AM", esDiaHabil(fin, feriados));

	return diasHabiles - ajusteInicio - ajusteFin;
}

function obtenerAjusteJornada(jornada, jornadaEsperada, aplicaAjuste) {
	return jornada === jornadaEsperada && aplicaAjuste ? 0.5 : 0;
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

export const obtenerFeriados = async () => {
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

export const validarRut = (rut) => {
	if (!/^\d+[\dkK]$/.test(rut)) {
		return false;
	}
	const rutLimpio = rut.replaceAll(/[^\dkK]/g, '').toUpperCase();
	const cuerpo = rutLimpio.slice(0, -1);
	const dv = rutLimpio.slice(-1);

	let suma = 0;
	let multiplo = 2;

	for (let i = cuerpo.length - 1; i >= 0; i--) {
		suma += multiplo * cuerpo.charAt(i);
		if (multiplo < 7) {
			multiplo++;
		} else {
			multiplo = 2;
		}
	}

	const dvEsperado = 11 - (suma % 11);
	let dvCalculado;

	if (dvEsperado === 11) {
		dvCalculado = '0';
	} else if (dvEsperado === 10) {
		dvCalculado = 'K';
	} else {
		dvCalculado = dvEsperado.toString();
	}

	return dv === dvCalculado;
};

export function calcularPrimerDiaDelMes() {

	const fechaActual = new Date();
	fechaActual.setDate(1);
	fechaActual.setHours(0);
	const anio = fechaActual.getFullYear();
	const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
	const dia = fechaActual.getDate().toString().padStart(2, '0');
	return `${anio}-${mes}-${dia}`;

}

export function calcularPrimerDiaDelMesEnSantiago() {
	const partes = new Intl.DateTimeFormat('es-CL', {
		timeZone: 'America/Santiago',
		year: 'numeric',
		month: '2-digit',
	}).formatToParts(new Date());
	const anio = partes.find(({ type }) => type === 'year').value;
	const mes = partes.find(({ type }) => type === 'month').value;
	return `${anio}-${mes}-01`;
}

export function calcularPrimerDiaMesAnterior() {
	const fechaActual = new Date();
	fechaActual.setDate(1);
	fechaActual.setMonth(fechaActual.getMonth() - 1);
	fechaActual.setHours(0, 0, 0, 0);
	const anio = fechaActual.getFullYear();
	const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
	const dia = fechaActual.getDate().toString().padStart(2, '0');
	return `${anio}-${mes}-${dia}`;

}

import ExcelJS from 'exceljs';

export const exportToExcel = async (data, filename) => {
	try {

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Decretos");

		if (data.length === 0) {
			console.log('No data to export.');
			return;
		}

		const headers = Object.keys(data[0]);
		worksheet.addRow(headers);

		const isDateString = (value) => {
			return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value);
		};

		data.forEach(row => {
			const rowData = headers.map(header => {
				const value = row[header];
				if (isDateString(value)) {
					return formatFechaString(value);
				}
				return value;
			});
			worksheet.addRow(rowData);
		});

		// Write to file
		const buffer = await workbook.xlsx.writeBuffer();

		const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
		const url = globalThis.URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `${filename}.xlsx`;
		document.body.appendChild(a); // Append to body to ensure it's clickable
		a.click();
		a.remove(); // Clean up
		globalThis.URL.revokeObjectURL(url);

	} catch (error) {
		console.error('Error in exportToExcel:', error);
		// Re-throw the error so it can be caught by the caller (handleGenerarDecreto)
		throw error;
	}
};