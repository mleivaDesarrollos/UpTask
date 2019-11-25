import axios from 'axios'
import Swal from 'sweetalert2'

// Recolectamos el boton
let btnEliminar = document.querySelector('#btnEliminarProyecto');

// Validamos que el boton haya sido encontrado (como el bundle es para todo uso del layout, es posible que en ciertas vistas no este)
if(btnEliminar) {    
    // Agregamos un manejador de eventos para el click
    btnEliminar.addEventListener('click', (e) => {
        // Obtenemos el id del proyecto
        const nombre = e.target.dataset.nombre;
        Swal.fire({
            title: '¿Estas seguro?',
            text: `¿Quieres eliminar el proyecto "${nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: "No, cancelar"
          }).then((result) => {
            if (result.value) {
                // Construimos la URL para eliminación
                const url = `http://${location.host}${location.pathname}`;                
                // Hacemos una peticion sobre axios para eliminar el proyecto
                axios.delete(url).then(resultado => {
                    if(resultado.status == 200) {                        
                        // Informamos que el proyecto a sido eliminado
                        Swal.fire(
                            'Eliminado',
                            `El proyecto "${nombre}" has ido eliminado`,
                            'success'
                        );
                    }
                }).catch(error => {                    
                    Swal.fire(
                        'Error',
                        `Ha ocurrido un error al eliminar el proyecto`,
                        'error'
                    );
                });                
            }
          })
    })
}