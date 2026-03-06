import Swal from 'sweetalert2';
import { getDocDecreto } from '../services/docService.js';

export const useDecretoDocument = () => {
  const handleViewDocument = async (idDecreto, download = false) => {
    Swal.fire({
      title: 'Procesando documento',
      text: 'Por favor, espera un momento...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await getDocDecreto(idDecreto);
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = globalThis.URL.createObjectURL(blob);

      if (download) {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `decreto_${idDecreto}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        globalThis.open(url, '_blank');
      }

      globalThis.URL.revokeObjectURL(url);
      Swal.close();
    } catch (error) {
      Swal.close();
      Swal.fire(
        'Error',
        'No se pudo obtener el documento. Por favor, inténtalo de nuevo.',
        'error'
      );
      console.error("Error en handleViewDocument:", error);
    }
  };

  return { handleViewDocument };
};
