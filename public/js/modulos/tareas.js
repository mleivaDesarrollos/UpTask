import axios from 'axios'
import Swal from 'sweetalert2'
import { actualizarAvance } from '../funciones/avance';

// Recolectamos el boton
let btnEliminar = document.querySelector('#btnEliminarProyecto');

let tasks = document.querySelectorAll('li.tarea');

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
                        // Hacemos redireccion del sitio
                        setTimeout(() => {
                            window.location = `http://${location.host}`
                        }, 2000);
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

if(tasks) {
    // Iteramos sobre todas las tasks
    tasks.forEach(task => {           
        // Levantamos el id
        let id = task.dataset.tarea;
        // Subscribimos el evento click del item que tiene el circle
        let checkItem = task.querySelector('i.fa-check-circle');
        // Subscribimos el evento click
        checkItem.addEventListener('click', e => { 
            // Preparamos la url para enviar la petición
            let url = `http://${location.host}/tareas/${id}`; 
            // Enviamos la petición por axios
            axios.post(url)
            .then(respuesta => {
                if(respuesta.status == 200) {            
                    // Cambiamos el color del estado de la tarea
                    checkItem.classList.toggle('completo');
                    // Actualizamos el avance
                    actualizarAvance();
                }
            }).catch(error => {
                console.log(error);
                Swal.fire(
                    'Error',
                    `Ha ocurrido un error al cambiar el estado de la tarea`,
                    'error'
                );
            });            
        });
        // Levantamos el ícono de tacho para procesar las peticiones para eliminación
        let deleteIcon = task.querySelector('i.fa-trash-alt');
        // Subscribimos el click al ícono 
        deleteIcon.addEventListener('click', e => {
            Swal.fire({
                title: '¿Estas seguro?',
                text: `¿Quieres eliminar la tarea?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: "No, cancelar"
              }).then((result) => {
                  // Validamos el resultado
                  if(result.value) {
                      // Ejecutamos axios usando la url de eliminación y el método de eliminación
                      const url = `http://${location.host}/tareas/${id}`;
                      axios.delete(url)
                      .then(respuesta => {                          
                        // Mostramos un mensaje de exito
                        Swal.fire(
                            'Exito',
                            respuesta.data,
                            'success'
                        );                        
                        // Eliminamos La tarea del listado del dom
                        task.parentNode.removeChild(task);
                        // Validamos que el listado de pendientes tenga algún elemento
                        let pendientes = document.querySelector('.listado-pendientes').querySelector("ul");
                        let li_tasks = pendientes.querySelectorAll('li');                        
                        // Si no hay mas elementos en tareas rellenamos el campo 
                        if(li_tasks.length == 0) {
                            // Agregamos un parrafo al listado de pendientes
                            let p = document.createElement("p");
                            p.innerHTML = "No hay tareas en el proyecto";
                            // Agregamos el item al listado de pendientes
                            pendientes.appendChild(p);
                        }
                        // Actualizamos el avance
                        actualizarAvance();                        
                      }).catch(error => {
                        Swal.fire(
                            'Ups!',
                            'Hubo un problema al eliminar la tarea, reintenta nuevamente',
                            'error'
                        );
                      });
                  }
              });
        });
    });
}
