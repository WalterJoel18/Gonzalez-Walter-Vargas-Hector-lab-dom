# Laboratorio DOM y Validación de Formularios
**Ingeniería Web — Tarea 4**  
**Facultad de Ingeniería de Sistemas Computacionales (FISC)**  
**Universidad Tecnológica de Panamá**

---

### Integrantes
* **Walter Gonzalez** 
* **Hector Vargas** 

---

### Enlaces de Entrega
* **Repositorio de GitHub:**  
  `https://github.com/WalterJoel18/Gonzalez-Walter-Vargas-Hector-lab-dom`
* **Despliegue GitHub Pages:**  
  `https://walterjoel18.github.io/Gonzalez-Walter-Vargas-Hector-lab-dom/Inscripcion/`

---

### Evidencias de Funcionamiento

#### 1. Formulario con Errores de Validación Activos
> Resaltado visual en rojo de los campos que incumplen las reglas.

![Validaciones con Error](capturas/error.png)

---

#### 2. Envío Exitoso y Confirmación
> Tarjeta de confirmación en el DOM con los datos registrados tras una validación exitosa (sin que se vean las contraseñas).

![Envío Exitoso](capturas/caso%20exitoso.png)

---

### Respuestas a las Preguntas de Control

1. **¿Qué devuelve `document.querySelector('.inexistente')` y qué pasa si luego escribes `.textContent = 'x'`?**
   Devuelve `null` porque no encuentra el elemento. Si después intentamos usar `.textContent = 'x'`, JavaScript da un error `TypeError`, ya que estamos intentando modificar algo que no existe. Para evitarlo, primero se debe comprobar si el elemento existe o usar encadenamiento opcional.

2. **Si agregas 100 tareas nuevas a la lista, ¿cuántos manejadores de clic tiene la página con delegación? ¿Y sin delegación?**
   Con delegación solo habría un listener en el `<ul>`, que se encarga de detectar los clics usando la propagación de eventos y `event.target.closest()`. Sin delegación, habría que colocar un listener diferente para cada una de las 100 tareas.

3. **¿Por qué el manejador de `blur` se registra con `true` como tercer argumento?**
   Porque `blur` no funciona con la propagación por burbujeo. El `true` hace que el evento se detecte en la fase de captura, permitiendo que el formulario se dé cuenta cuando cualquier campo pierde el foco sin tener que poner un evento en cada `input`.

