import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    // Levantamos todas las tareas del proyecto
    const tareas = document.querySelectorAll('li.tarea');
    // Validamos si hay valores cargados, en caso de no haber ninguna tarea no realizará acción
    if(tareas.length){
        // Levantamos todas las I con clase completo
        const tareasCompletadas = document.querySelectorAll('i.completo');
        // Calculamos el total de porcentaje
        const porcentaje = Math.round((tareasCompletadas.length * 100) / tareas.length);
        // Capturamos la barra porcentual
        const barraPorcentaje = document.querySelector("#porcentaje");
        // Cambiamos el tamaño de la barra porcentual
        barraPorcentaje.style.width = `${porcentaje}%`;
        // Validamos si llegamos al 100%
        if(porcentaje >= 100) {
            // Informamos la completación del proyecto
            Swal.fire('¡Felicidades!', '¡Has completado todas las tareas del proyecto!', 'success');
        }
    }
}