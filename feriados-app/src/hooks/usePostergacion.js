import Swal from "sweetalert2";
import "./usePostergacion.css";
import { savePostergacion } from "../services/postergacionService";
import { useAlertaSweetAlert } from "./useAlertaSweetAlert";

export const usePostergacion = (
  solicitud,
  rutFuncionario,
  onActualizarSolicitud,
) => {
  const { mostrarAlertaError, mostrarAlertaExito } = useAlertaSweetAlert();

  const handlePostergar = () => {
    const motivoPredefinido = "POSTERGADA POR RAZONES DE BUEN SERVICIO";
    let motivoPersonalizado = "";

    void Swal.fire({
      title: "¿Está seguro de postergar?",
      html: `
        <p class="postergacion-dialog__ayuda">Seleccione la frase predefinida o escriba otro motivo.</p>
        <label class="postergacion-dialog__opcion" for="motivo-predefinido">
          <input id="motivo-predefinido" type="checkbox" />
          <span>${motivoPredefinido}</span>
        </label>
      `,
      customClass: {
        popup: "postergacion-dialog",
        htmlContainer: "postergacion-dialog__contenido",
        input: "postergacion-dialog__motivo",
      },
      didOpen: () => {
        const checkbox = Swal.getHtmlContainer().querySelector("#motivo-predefinido");
        const input = Swal.getInput();
        input.setAttribute("aria-label", "Motivo de la postergación");
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            motivoPersonalizado = input.value;
            input.value = motivoPredefinido;
          } else {
            input.value = motivoPersonalizado;
          }
          input.readOnly = checkbox.checked;
          Swal.resetValidationMessage();
          if (!checkbox.checked) input.focus();
        });
      },
      input: "textarea",
      inputAttributes: { maxlength: 255 },
      inputPlaceholder: "Escriba el motivo aquí...",
      showCancelButton: true,
      confirmButtonText: "Sí, postergar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value.trim()) {
          return "¡Necesita escribir un motivo!";
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const datosPostergacion = {
            idSolicitud: solicitud.id,
            motivo: result.value.trim(),
            postergadoPor: rutFuncionario,
          };
          void Swal.fire({
            title: solicitud.derivaciones?.[0]?.tipoMovimiento === 'FIRMA'
              ? 'Firmando la postergación' : 'Derivando la postergación',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          await savePostergacion(datosPostergacion);
          mostrarAlertaExito(
            "Éxito",
            solicitud.derivaciones?.[0]?.tipoMovimiento === 'FIRMA'
              ? 'La postergación fue firmada. El PDF está disponible en la solicitud.'
              : 'La solicitud mantiene el estado POSTERGADA y continúa su tramitación hasta la firma.',
          );
          onActualizarSolicitud();
        } catch (error) {
          console.error("Error al postergar la solicitud:", error);
          mostrarAlertaError("No se pudo postergar la solicitud.");
        }
      }
    });
  };

  return { handlePostergar };
};
