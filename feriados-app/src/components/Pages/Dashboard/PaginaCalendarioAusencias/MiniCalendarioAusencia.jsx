const MiniCalendarioAusencia = ({ periodo, feriadosSet }) => {
    if (!periodo?.fechaInicio || !periodo?.fechaFin) return null;
    const inicioParts = periodo.fechaInicio.split(/[-/]/);
    const inicio = new Date(inicioParts[0], inicioParts[1] - 1, inicioParts[2]);
    const finParts = periodo.fechaFin.split(/[-/]/);
    const fin = new Date(finParts[0], finParts[1] - 1, finParts[2]);
    const dias = [];
    let fechaTemporal = new Date(inicio);

    while (fechaTemporal <= fin) {
        const dayOfWeek = fechaTemporal.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const cadenaFecha = `${fechaTemporal.getFullYear()}-${(fechaTemporal.getMonth() + 1).toString().padStart(2, '0')}-${fechaTemporal.getDate().toString().padStart(2, '0')}`;
        const isFeriado = feriadosSet.has(cadenaFecha);

        if (!isWeekend && !isFeriado) {
            dias.push(new Date(fechaTemporal));
        }
        fechaTemporal = new Date(fechaTemporal.getFullYear(), fechaTemporal.getMonth(), fechaTemporal.getDate() + 1);
    }

    const inicioMes = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
    const finMes = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);

    const diasMiniCalendario = [];
    const primerDiaSemana = inicioMes.getDay();

    for (let i = 0; i < primerDiaSemana; i++) {
        diasMiniCalendario.push(
            <div key={`mini-empty-${i}`} className="col p-1">
                <div className="w-100 h-100 rounded bg-light" style={{ minHeight: '38px' }}></div>
            </div>
        );
    }

    for (let dia = 1; dia <= finMes.getDate(); dia++) {
        const diaActual = new Date(inicio.getFullYear(), inicio.getMonth(), dia);
        const estaResaltado = dias.some(d => d.toDateString() === diaActual.toDateString());

        const diaVacio = new Date(diaActual).setHours(0, 0, 0, 0);
        const inicioVacio = new Date(inicio).setHours(0, 0, 0, 0);
        const finVacio = new Date(fin).setHours(0, 0, 0, 0);
        const enPeriodo = diaVacio >= inicioVacio && diaVacio <= finVacio;

        let clasesCelda = 'bg-white border text-secondary opacity-50';
        if (estaResaltado) {
            clasesCelda = 'bg-primary text-white shadow-sm fw-bold';
        } else if (enPeriodo) {
            clasesCelda = 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle';
        }

        diasMiniCalendario.push(
            <div key={`mini-day-${dia}`} className="col p-1">
                <div className={`w-100 h-100 rounded d-flex align-items-center justify-content-center fw-medium user-select-none transition-all ${clasesCelda}`} style={{ minHeight: '38px', fontSize: '0.9rem' }}>
                    {dia}
                </div>
            </div>
        );
    }

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const nombreMes = meses[inicio.getMonth()];
    const anio = inicio.getFullYear();

    const fechaInicioStr = `${inicio.getDate().toString().padStart(2, '0')}/${(inicio.getMonth() + 1).toString().padStart(2, '0')}/${inicio.getFullYear()}`;
    const fechaFinStr = `${fin.getDate().toString().padStart(2, '0')}/${(fin.getMonth() + 1).toString().padStart(2, '0')}/${fin.getFullYear()}`;

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <span className="fw-bold text-dark fs-5 text-capitalize">{nombreMes} {anio}</span>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-medium">
                    {dias.length} día{dias.length === 1 ? '' : 's'} hábil{dias.length === 1 ? '' : 'es'}
                </span>
            </div>

            <div className="row row-cols-7 text-center g-0 mb-3">
                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map((dia) => (
                    <div key={dia} className="col fw-bold text-muted small pb-2 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>{dia}</div>
                ))}
                {diasMiniCalendario}
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-2 gap-sm-4 text-secondary small fw-medium bg-light rounded-3 p-2 border border-light-subtle">
                <div><span className="text-muted">Inicio:</span> <span className="text-dark fw-bold ms-1">{fechaInicioStr}</span></div>
                <div><span className="text-muted">Fin:</span> <span className="text-dark fw-bold ms-1">{fechaFinStr}</span></div>
            </div>
        </div>
    );
};


export default MiniCalendarioAusencia;
