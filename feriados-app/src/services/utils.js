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

export function calculoDiasAusar(fechaInicio, fechaFin, tipoSolicitud, fechasFeriadas, jornadaInicio = null, jornadaFin = null) {
	const inicio = parseDateAsLocal(fechaInicio);
	const fin = parseDateAsLocal(fechaFin);

	if (inicio > fin) return 0;

	let count = 0;
	const feriados = fechasFeriadas || [];

    const oneDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.round(Math.abs((fin.getTime() - inicio.getTime()) / oneDay)) + 1;

    let current = new Date(inicio); // Start with the beginning date
    for (let i = 0; i < totalDays; i++) {
        // Check the current day
        const dia = current.getDay(); // 0 = domingo, 6 = sábado
        const fechaStr = current.toISOString().split("T")[0];
        if (dia !== 0 && dia !== 6 && !feriados.includes(fechaStr)) {
            count++;
        }
        // Move to the next day for the next iteration
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
	if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) {
		return false;
	}
	const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
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
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.xlsx`;
        document.body.appendChild(a); // Append to body to ensure it's clickable
        a.click();
        document.body.removeChild(a); // Clean up
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error in exportToExcel:', error);
        // Re-throw the error so it can be caught by the caller (handleGenerarDecreto)
        throw error;
    }
};