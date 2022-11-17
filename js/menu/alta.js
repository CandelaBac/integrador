class FormularioAlta {
    inputs = null
    form = null
    button = null
    camposValido = [false, false, false, false, false, false, false]
    regExpValidar = [
        /^.+$/, // regexp nombre
        /^.+$/, // regexp precio
        /^[0-9]+$/, // regexp colores
        /^.+$/, // regexp dimensiones
        /^.+$/, // regexp categoria
        /^.+$/, // regexp detalles
        /^.+$/, // regexp foto
    ]


    constructor(renderTablaAlta, guardarProducto) { 
        this.inputs = document.querySelectorAll("main form input")
        this.form = document.querySelector("main form")
        this.button = document.querySelector("main form button")

        this.button.disabled = true

        this.inputs.forEach((input, index) => {
            if(input.type != "checkbox") {
                input.addEventListener("input", () => {
                   this.validar(input.value, this.regExpValidar[index], index)
                   if(renderTablaAlta) renderTablaAlta (!this.algunCampoValido(), productoController.productos)
                })
            }
        })

        this.form.addEventListener("submit", (e) => {
            e.preventDefault()

            const producto = this.leerProductoIngresado()
            this.limpiarFormulario()

            if(guardarProducto) guardarProducto(producto)
       
        })

    }


    /* Para comprobar la validez de los campos */
    algunCampoValido() {
        let valido = 
            camposValidos[0] && 
            camposValidos[1] &&
            camposValidos[2] &&
            camposValidos[3] &&
            camposValidos[4] &&
            camposValidos[5] &&
            camposValidos[6] 
    
        return !valido    
    
    }


    /* Validar campos */
    validar(valor, validador, index) {
    //console.log(valor, validador, index)
    
        if(!validador.test(valor)) {
            this.setCustomValidityJS("Este campo no es válido", index)
            this.camposValidos[index] = false
            this.button.disabled = true
            return null // break
        }

        this.camposValidos[index] = true
        this.button.disabled = this.algunCampoValido() // boolean

        this.setCustomValidityJS("", index)
        return valor

    }

    /* Mostrar u ocultar el mensaje */
    setCustomValidityJS(mensaje, index) {
        let divs = document.querySelectorAll("form div")
        divs[index].innerHTML = mensaje
        divs[index].style.display = mensaje ? "block" : "none"
    }

    // Producto ingresado en el formulario
    leerProductoIngresado() {
        return {
            nombre: this.inputs[0].value,
            precio: this.inputs[1].value,
            colores: this.inputs[2].value,
            dimensiones: this.inputs[3].value,
            categoria: this.inputs[4].value,
            detalles: this.inputs[5].value,
            foto: this.inputs[6].value,
            envio: this.inputs[7].checked
            
        }
    }

    // Limpiamos los inputs del formulario
    limpiarFormulario() {

        // borro todos los inputs
        this.inputs.forEach(input => {
            if(input.type != "checkbox") input.value = ""
            else if(input.type == "checkbox") input.checked = false
        })

        this.button.disabled = true
        this.camposValidos = [false, false, false, false, false, false, false]
    }

}


// Rendereamos la plantilla
const renderTablaAlta = (validos, productos) => {
    
    const xhr = new XMLHttpRequest()
    xhr.open("get", "plantillas/listado.hbs") // TODO: revisar
    xhr.addEventListener("load", () => {
        if(xhr.status === 200) {
            let plantillasHbs = xhr.response
            
            let template = Handlebars.compile(plantillasHbs)

            console.warn(productos)
            let html = template({productos, validos})
            document.getElementById("listado-productos").innerHTML = html
        }
    })    

    xhr.send()
}




/* ----------------------------------------------- */
/* Inicializamos para el funcionamiento del modulo */
/* ----------------------------------------------- */

let formularioAlta = null



async function initAlta() {
    console.warn("initAlta()")

    formularioAlta = new FormularioAlta(renderTablaAlta, productoController.guardarProducto)

    const productos = await productoController.obtenerProductos()
    renderTablaAlta(null, productos)

}

