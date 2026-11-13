import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UsuarioContext } from '../context/UsuarioContext';
import { consultarPermisoAsociacion } from '../services/departamentosService';

export default function AvisoDepartamento() {
    const funcionario = useContext(UsuarioContext);
    const [administrador, setAdministrador] = useState(false);
    const config = funcionario?.configuracionDepartamento;
    const pendiente = Boolean(funcionario) && config?.estado !== 'VALIDADO';
    useEffect(() => {
        let activo = true;
        if (pendiente) consultarPermisoAsociacion().then(data => {
            if (activo) setAdministrador(data.permitido);
        }).catch(() => { if (activo) setAdministrador(false); });
        return () => { activo = false; };
    }, [pendiente]);
    if (!pendiente) return null;
    const estado = config?.estado || 'SIN_DIAGNOSTICO';
    const mensajes = {
        SIN_ASOCIACION: 'No existe una asociación para el código de SMC en codigos_externos. Un administrador debe asociarlo al departamento interno correcto.',
        SIN_CODIGO_ORIGEN: 'SMC no informa un código de departamento. Hay que corregir el dato de origen.',
        SIN_ID_INTERNO: 'El funcionario tiene idDepto interno nulo, aunque el código de SMC sí tiene una asociación. Reintenta la sincronización y revisa el registro del funcionario si persiste.',
        ASOCIACION_INVALIDA: 'La consulta de asociación respondió sin un ID de departamento válido. Revisa codigos_externos y el departamento relacionado.',
        ASOCIACION_INCONSISTENTE: 'El ID interno del funcionario no coincide con el departamento asociado al código de SMC. Reintenta la sincronización y revisa la asociación.',
        SERVICIO_NO_DISPONIBLE: 'No se pudo completar la consulta al servicio. No es posible confirmar si existe la asociación. Reintenta la validación.',
        NO_VERIFICADO: 'Se usaron datos locales de respaldo y no se pudo validar el departamento actual con el origen. Reintenta la consulta.',
        SIN_DIAGNOSTICO: 'La API no entregó el diagnóstico de asociación. Comprueba que api-funcionarios y newsolicitudes estén actualizados; el ID interno nulo por sí solo no confirma que falte una asociación.'
    };
    const mostrar = valor => valor == null || valor === '' ? 'null (sin informar)' : valor;
    const idInterno = config && Object.hasOwn(config, 'idDeptoInterno') ? config.idDeptoInterno : funcionario.codDepto;
    const parametros = new URLSearchParams({ codigoEx: config?.codigoExterno || '', nombreExterno: config?.nombreExterno || '' });
    return <div className="alert alert-warning" role="alert">
        <h2 className="h5">{estado === 'SIN_ASOCIACION' ? 'Departamento sin asociación' : 'Departamento pendiente de validación'}</h2>
        <p className="mb-2"><strong>Departamento informado por smcapis: </strong>
            {config?.nombreExterno || 'No disponible en la respuesta recibida'}
            {' — Código SMC: '}{config?.codigoExterno || 'No informado'}
        </p>
        <p>{mensajes[estado] || `La API informó un estado de validación no reconocido: ${estado}.`}</p>
        <dl className="row mb-2">
            <dt className="col-sm-5">ID interno del funcionario (idDepto)</dt><dd className="col-sm-7">{mostrar(idInterno)}</dd>
            <dt className="col-sm-5">ID asociado en Departamentos</dt><dd className="col-sm-7">{mostrar(config?.idDeptoAsociado)}{['SERVICIO_NO_DISPONIBLE', 'NO_VERIFICADO', 'SIN_DIAGNOSTICO'].includes(estado) && ' — no verificado'}</dd>
            <dt className="col-sm-5">Estado de diagnóstico</dt><dd className="col-sm-7">{estado}</dd>
        </dl>
        {idInterno == null && <p><strong>El funcionario no tiene un ID de departamento interno informado (idDepto = null).</strong></p>}
        <p>Puedes consultar tu información. Las nuevas solicitudes estarán disponibles cuando se valide el departamento.</p>
        <button className="btn btn-outline-dark btn-sm me-2" onClick={() => window.dispatchEvent(new Event('validar-departamento'))}>Reintentar validación</button>
        {administrador && estado === 'SIN_ASOCIACION' && <Link className="btn btn-primary btn-sm" to={`/deptos?${parametros}`}>Corregir asociación</Link>}
    </div>;
}
