document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inscripcion");
  const confirmacionSection = document.getElementById("confirmacion");

  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - 16);

  // 1. Objeto de reglas y validaciones
  const reglas = {
    nombre: {
      validar: (val) => {
        const palabras = val.trim().split(/\s+/).filter(Boolean);
        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(val);
        return palabras.length >= 2 && soloLetras && val.length >= 5 && val.length <= 60;
      },
      mensaje: "Escribe tu nombre y apellido (solo letras, entre 5 y 60 caracteres)."
    },
    nacimiento: {
      validar: (val) => {
        if (!val) return false;
        return new Date(val) <= limite;
      },
      mensaje: "Debes tener al menos 16 años."
    },
    curso: {
      validar: (val) => val !== "",
      mensaje: "Elige un curso."
    },
    cedula: {
      validar: (val) => {
        const regex = /^([1-9]|1[0-3]|PE|E|N)-[0-9]{1,4}-[0-9]{1,5}$/i;
        return regex.test(val.trim());
      },
      mensaje: "Usa el formato 8-123-4567."
    },
    correo: {
      validar: (val) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(val.trim());
      },
      mensaje: "Usa un correo como nombre@dominio.com."
    },
    celular: {
      validar: (val) => {
        const regex = /^6[0-9]{3}-?[0-9]{4}$/;
        return regex.test(val.trim());
      },
      mensaje: "El celular debe tener 8 dígitos y empezar con 6."
    },
    modalidad: {
      validar: () => form.querySelector('input[name="modalidad"]:checked') !== null,
      mensaje: "Elige una modalidad."
    },
    sede: {
      validar: (val) => {
        const presencial = form.querySelector('input[name="modalidad"][value="presencial"]');
        if (presencial && presencial.checked) return val !== "";
        return true;
      },
      mensaje: "Elige una sede."
    },
    clave: {
      validar: (val) => {
        return val.length >= 8 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val);
      },
      mensaje: "Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
    },
    clave2: {
      validar: (val) => val === document.getElementById("clave").value && val !== "",
      mensaje: "Las contraseñas no coinciden."
    },
    comentarios: {
      validar: (val) => val.length <= 200,
      mensaje: "Máximo 200 caracteres."
    },
    terminos: {
      validar: (val, el) => el.checked,
      mensaje: "Debes aceptar los términos."
    }
  };

  // Función requerida: evalúa la regla, actualiza aria-invalid y escribe el mensaje con textContent
  function validarCampo(input) {
    const name = input.name || input.id;
    const regla = reglas[name];
    if (!regla) return true;

    let valor = input.type === "checkbox" ? input.checked : (input.type === "radio" ? "" : input.value);
    
    if (name === "sede") {
      const presencial = form.querySelector('input[name="modalidad"][value="presencial"]');
      if (!presencial || !presencial.checked) {
        limpiarError(input);
        return true;
      }
    }

    const esValido = name === "modalidad" ? regla.validar() : regla.validar(valor, input);
    const errorEl = document.getElementById(`${name}-error`) || document.getElementById(`sede-error`);

    if (!esValido) {
      input.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = regla.mensaje;
      return false;
    } else {
      limpiarError(input);
      return true;
    }
  }

  function limpiarError(input) {
    input.removeAttribute("aria-invalid");
    const name = input.name || input.id;
    const errorEl = document.getElementById(`${name}-error`) || document.getElementById(`sede-error`);
    if (errorEl) errorEl.textContent = "";
  }

  // Flujo de eventos: blur (primera vez con Set) e input (en vivo)
  const tocados = new Set();
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      tocados.add(input);
      validarCampo(input);
    });

    input.addEventListener("input", () => {
      if (tocados.has(input)) validarCampo(input);
    });

    input.addEventListener("change", () => {
      if (tocados.has(input)) validarCampo(input);
    });
  });

  // Interacción dinámica: Modalidad y Sede condicional
  const radiosModalidad = form.querySelectorAll('input[name="modalidad"]');
  const campoSede = document.getElementById("campo-sede");
  const selectSede = document.getElementById("sede");

  radiosModalidad.forEach(radio => {
    radio.addEventListener("change", () => {
      tocados.add(radio);
      if (radio.value === "presencial" && radio.checked) {
        campoSede.hidden = false;
      } else {
        campoSede.hidden = true;
        selectSede.value = "";
        limpiarError(selectSede);
      }
      validarCampo(radio);
    });
  });

  // Interacción dinámica: Fuerza de contraseña
  const inputClave = document.getElementById("clave");
  const meterLbl = document.getElementById("meter-lbl");

  inputClave.addEventListener("input", () => {
    const val = inputClave.value;
    let fuerza = 0;
    let falta = [];

    if (val.length >= 8) fuerza++; else falta.push("8 caracteres");
    if (/[A-Z]/.test(val)) fuerza++; else falta.push("mayúscula");
    if (/[a-z]/.test(val)) fuerza++; else falta.push("minúscula");
    if (/[0-9]/.test(val)) fuerza++; else falta.push("número");
    if (/[^A-Za-z0-9]/.test(val)) fuerza++; else falta.push("símbolo");

    if (val.length === 0) {
      if (meterLbl) meterLbl.textContent = "Fuerza: —";
    } else if (fuerza < 5) {
      if (meterLbl) meterLbl.textContent = `Te falta: ${falta[0]}.`;
    } else {
      if (meterLbl) meterLbl.textContent = "Contraseña segura";
    }

    const inputClave2 = document.getElementById("clave2");
    if (tocados.has(inputClave2) && inputClave2.value !== "") validarCampo(inputClave2);
  });

  // Interacción dinámica: Contador de comentarios
  const comentarios = document.getElementById("comentarios");
  const contadorComentarios = document.getElementById("contador-comentarios");

  comentarios.addEventListener("input", () => {
    const len = comentarios.value.length;
    if (contadorComentarios) {
      contadorComentarios.textContent = `${len} / 200`;
      contadorComentarios.style.color = len > 180 ? "var(--error)" : "var(--texto-secundario)";
    }
  });

  // Validación al enviar (Submit)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    inputs.forEach(input => tocados.add(input));

    let invalidos = [];

    inputs.forEach(input => {
      if (input.id === "sede") {
        const presencial = form.querySelector('input[name="modalidad"][value="presencial"]');
        if (!presencial || !presencial.checked) return;
      }
      if (input.type === "radio" && input.name === "modalidad") return;

      if (!validarCampo(input)) invalidos.push(input);
    });

    if (!reglas.modalidad.validar()) invalidos.push(radiosModalidad[0]);

    if (invalidos.length > 0) {
      invalidos[0].focus(); // Foco en el primer error
    } else {
      // Generar tarjeta de confirmación sin recargar y sin mostrar contraseña
      confirmacionSection.innerHTML = "";

      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta-exito";
      tarjeta.style.cssText = "background: #ffffff; padding: 24px; border-radius: 12px; border: 2px solid var(--verde-acento); margin-top: 20px;";

      const h3 = document.createElement("h3");
      h3.textContent = "¡Inscripción Exitosa!";
      tarjeta.appendChild(h3);

      const ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.padding = "0";

      const formData = new FormData(form);
      const excluir = ["clave", "clave2", "terminos"];

      for (let [key, value] of formData.entries()) {
        if (!excluir.includes(key) && value.trim() !== "") {
          const li = document.createElement("li");
          li.style.margin = "6px 0";
          li.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
          ul.appendChild(li);
        }
      }

      tarjeta.appendChild(ul);
      confirmacionSection.appendChild(tarjeta);

      form.reset();
      tocados.clear();
      campoSede.hidden = true;
      if (meterLbl) meterLbl.textContent = "Fuerza: —";
      if (contadorComentarios) contadorComentarios.textContent = "0 / 200";
    }
  });
});