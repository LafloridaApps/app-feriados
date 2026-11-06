const normalizarRut = (rutIngresado) =>
    String(rutIngresado ?? '').replaceAll('.', '').trim().toUpperCase();

const calcularDigitoVerificador = (cuerpo) => {
    let suma = 0;
    let factor = 2;
    for (const digito of [...cuerpo].reverse()) {
        suma += Number(digito) * factor;
        factor = factor === 7 ? 2 : factor + 1;
    }
    const valor = 11 - (suma % 11);
    if (valor === 11) return '0';
    return valor === 10 ? 'K' : String(valor);
};

export const validarRut = (rutIngresado) => {
    const match = /^(\d{1,8})(?:-([\dK]))?$/.exec(normalizarRut(rutIngresado));
    if (!match || Number(match[1]) <= 0) {
        return { cuerpo: null, error: 'Ingresa un RUT válido, con o sin dígito verificador.' };
    }
    if (match[2] && calcularDigitoVerificador(match[1]) !== match[2]) {
        return { cuerpo: null, error: 'El dígito verificador del RUT es incorrecto.' };
    }
    return { cuerpo: Number(match[1]), error: null };
};

export const mensajeErrorConsulta = (errorConsulta) => {
    const mensaje = errorConsulta.response?.data?.message;
    if (mensaje) return mensaje;
    const status = errorConsulta.response?.status;
    return status === 404 || status === 204
        ? 'No se encontraron datos para el RUT ingresado. Verifica el RUT del solicitante.'
        : 'No fue posible consultar los datos del solicitante. Intenta nuevamente en unos momentos.';
};

