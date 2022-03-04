const templateProducts = document.getElementById("template-products").content;
const templateBill = document.getElementById("template-bill").content;
const sectionProducts = document.getElementById("section-products");
const sectionBill = document.getElementById("section-bill");
const bill = document.getElementById("bill")
const form = document.getElementById("form")
let productsCart = JSON.parse(localStorage.getItem("listaProductos"));
console.log(productsCart)
let quantityCart = JSON.parse(localStorage.getItem("#productosComprados"));
const fragment = document.createDocumentFragment();


/*Estas son las funciones que se ejecutan a la carga completa del DOM*/
document.addEventListener("DOMContentLoaded", e =>{
    /*Esta validación ejecuta la funcion purchaseComplete con el fin de que si el usuario recarga la página al final de la compra 
    se muestre el mensaje de despedida*/
    if(productsCart === null){
        purchaseComplete()
    }
    renderProducts();
    renderBill();
    sumarCantidadesKg();
    restarCantidadesKg();
    sumarCantidadesUnd();
    restarCantidadesUnd();
    deleteProducts();
    validationForm();
})

/*Esta funcion carga los elementos dinamicos en el DOM */

const renderProducts = () =>{
    Object.values(productsCart).forEach(e => {
        templateProducts.querySelector("#product").textContent = e.nombre;
        templateProducts.querySelector("#quantity").textContent = e.cantidad;
        templateProducts.querySelector("#type").textContent = e.unidad;
        templateProducts.querySelector("#price").textContent = e.precio;
        templateProducts.querySelector("#product-item").dataset.id = e.id;
        templateProducts.querySelector("#product-item").dataset.unidades = e.unidad;
        templateProducts.querySelector("#quantity").dataset.quantityItem = `cantidad${e.id}`;
        templateProducts.querySelector("#productToDelete").dataset.deleteId = `id${e.id}`;
        const clone = templateProducts.cloneNode(true);
        fragment.appendChild(clone);
    });
    sectionProducts.appendChild(fragment);
}

/*Esta funcíon suma cantidades de los productos medidos en kilos el usuario desea hacerlo desde la página de despacho de domicilios*/

const sumarCantidadesKg = ()=>{   
    const btnsIncreased = document.querySelectorAll("#btn-add");
    btnsIncreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnIncreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnIncreased = document.querySelector(`#quantity[data-quantity-Item=cantidad${idBtnIncreased}]`);
            const valueIncreased = parseFloat(quantityBtnIncreased.textContent);
            //Aqui se valida el tipo de unidad de peso, si el producto esta en KG se ejecuta la suma de 1 libra.
            if(idUnidades === "Kg") quantityBtnIncreased.textContent = valueIncreased + 0.5; 
            productsCart[idBtnIncreased].cantidad = quantityBtnIncreased.textContent;
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            /*Se ejecuta esta funcion con el fín de actualizar los elementos pertinentes en la factura en pantalla*/
            updateBill();
        })
    })  
}

/*Esta funcíon resta cantidades de los productos medidos en kilos el usuario desea hacerlo desde la página de despacho de domicilios*/

const restarCantidadesKg = ()=>{   
    const btnsDecreased = document.querySelectorAll("#btn-less");
    btnsDecreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnDecreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnDecreased = document.querySelector(`#quantity[data-quantity-Item=cantidad${idBtnDecreased}]`);
            const productToDelete = document.querySelector(`#productToDelete[data-delete-Id=id${idBtnDecreased}]`);
            const valueDecreased = parseFloat(quantityBtnDecreased.textContent);
            //Aqui se valida el tipo de unidad de peso, si el producto esta en KG se ejecuta la suma de 1 libra.
            if(idUnidades === "Kg"){
                if(quantityBtnDecreased.textContent > 0){
                    quantityBtnDecreased.textContent = valueDecreased - 0.5;
                    productsCart[idBtnDecreased].cantidad = quantityBtnDecreased.textContent;
                };
                /*Esta validación permite eliminar el producto si el usuario resta cantidades y llega a 0 */
                if(quantityBtnDecreased.textContent == 0){
                    sectionProducts.removeChild(productToDelete);
                    //Esta sentencia elimina el producto del objeto en el localStorage
                    delete productsCart[idBtnDecreased];
                    quantityCart -= 1;
                }  
            };
            /*Aquí se actualiza el localStorage según las acciones realizadas en las lineas anteriores*/
            localStorage.setItem("#productosComprados", quantityCart);
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            /*Se ejecuta esta funcion con el fín de actualizar los elementos pertinentes en la factura en pantalla*/
            updateBill();
        })
    })  
}

/*Esta funcíón elimina el producto del carrito si el usuario así lo desea*/

const deleteProducts = () =>{
    const btnsDelete = document.querySelectorAll("#btn-delete");
    btnsDelete.forEach(btn =>{
        btn.addEventListener("click", e =>{
            const idBtnDelete = e.target.parentNode.dataset.id;
            const productToDelete = document.querySelector(`#productToDelete[data-delete-Id=id${idBtnDelete}]`);
            if(e.target){
                sectionProducts.removeChild(productToDelete)
                delete productsCart[idBtnDelete];
                quantityCart -= 1;
                /*Aquí se actualiza el localStorage según las acciones realizadas en las lineas anteriores*/
                localStorage.setItem("#productosComprados", quantityCart);
                localStorage.setItem("listaProductos", JSON.stringify(productsCart));
                /*Se ejecuta esta funcion con el fín de actualizar los elementos pertinentes en la factura en pantalla*/
                updateBill();
            }
            
        })
    })
}

/*Esta funcíon suma cantidades de los productos medidos en unidades el usuario desea hacerlo desde la página de despacho de domicilios*/

const sumarCantidadesUnd = ()=>{   
    const btnsIncreased = document.querySelectorAll("#btn-add");
    btnsIncreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnIncreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnIncreased = document.querySelector(`#quantity[data-quantity-Item=cantidad${idBtnIncreased}]`);
            const valueIncreased = parseFloat(quantityBtnIncreased.textContent);
            //Aqui se valida el tipo de unidad de peso, si el producto esta en Und se ejecuta la suma de 1 libra.
            if(idUnidades === "Und") quantityBtnIncreased.textContent = valueIncreased + 1; 
            productsCart[idBtnIncreased].cantidad = quantityBtnIncreased.textContent;
            /*Aquí se actualiza el localStorage según las acciones realizadas en las lineas anteriores*/
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            /*Se ejecuta esta funcion con el fín de actualizar los elementos pertinentes en la factura en pantalla*/
            updateBill();
        })
    })  
}

/*Esta funcíon resta cantidades de los productos medidos en unidades el usuario desea hacerlo desde la página de despacho de domicilios*/


const restarCantidadesUnd = ()=>{   
    const btnsDecreased = document.querySelectorAll("#btn-less");
    btnsDecreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnDecreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnDecreased = document.querySelector(`#quantity[data-quantity-Item=cantidad${idBtnDecreased}]`);
            const productToDelete = document.querySelector(`#productToDelete[data-delete-Id=id${idBtnDecreased}]`);
            const valueDecreased = parseFloat(quantityBtnDecreased.textContent);
            //Aqui se valida el tipo de unidad de peso, si el producto esta en Und se ejecuta la suma de 1 libra.
            if(idUnidades === "Und"){
                if(quantityBtnDecreased.textContent > 0){
                    quantityBtnDecreased.textContent = valueDecreased - 1;
                    productsCart[idBtnDecreased].cantidad = quantityBtnDecreased.textContent;
                }; 
                if(quantityBtnDecreased.textContent == 0){
                    sectionProducts.removeChild(productToDelete);
                    delete productsCart[idBtnDecreased];
                    quantityCart -= 1;
                }  
            };
            /*Aquí se actualiza el localStorage según las acciones realizadas en las lineas anteriores*/
            localStorage.setItem("#productosComprados", quantityCart);
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            /*Se ejecuta esta funcion con el fín de actualizar los elemento spertinentes en la factura en pantalla*/
            updateBill();
        })
    })  
}

/*Esta función realiza el subtotal de la compra*/
const subTotal = () =>{
    const sumaTotal = Object.values(productsCart).reduce((acc, {precio, cantidad}) => acc + precio*cantidad, 0);
    return sumaTotal.toFixed(3);
}; 

/*Esta función calcula el IVA segun el subtotal caluclado en la función anterior */
const ivaCalculado = ()=>{
    const resultadoIva = (subTotal() * 19) / 100;
    return resultadoIva.toFixed(3);
}    

/*Esta función calcula el gran total segun los resultados de subTotal() e ivaCalculado() */

const granTotal = ()=>{
    const granTotal = parseFloat(parseFloat(subTotal())) + parseFloat(ivaCalculado());
    return granTotal.toFixed(3);
}

/*Está función renderiza en el DOM los elemento dinamicos de resumen de compra*/
const renderBill = () =>{
    templateBill.querySelector("#subTotal").textContent = subTotal();
    templateBill.querySelector("#iva").textContent = ivaCalculado();
    templateBill.querySelector("#total").textContent = granTotal();
    const clone = templateBill.cloneNode(true);
    fragment.appendChild(clone);
    sectionBill.appendChild(fragment);
}

/*Esta funciçon actualiza el resúmen de compra su existe alguna alteración dentro del carrito de compras  */
const updateBill = () =>{
    sectionBill.querySelector("#subTotal").textContent = subTotal();
    sectionBill.querySelector("#iva").textContent = ivaCalculado();
    sectionBill.querySelector("#total").textContent = granTotal();
}

/*Esta funcion valida que la información ingresada por el usuario para realizar el domicilio sea correcta */
const validationForm = () => {
    const name = document.getElementById("name");
    const lastName = document.getElementById("lastname");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const regExNumbers = /^[0-9]+$/;
    const regExLetters = /^[a-zA-ZñÑ]+$/;
    const regExAddress = /^[a-zA-Z#0-9]+$/;

    /*Si el usuario intenta realizar un pedido con el carrito vacio se ejecuta la funcion de toastify interna */
    form.addEventListener("submit", e =>{
        if(Object.keys(productsCart).length === 0){
            e.preventDefault();
            Toastify({
                text: "No has ingresado ningún producto",
                duration: 3000,
                close: false,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #FF4848, #f5ac6d)",
                },
                onClick: function(){} // Callback after click
            }).showToast();
            return;
        } 
        /*Si el usuario intenta ingresar numeros en un campo de letras se considera un nombre invalido */
        if(!regExLetters.test(name.value) || name.value === null){
            e.preventDefault()
            name.style.border = "thick solid #ff7b7b"
            Toastify({
                text: "Debes ingresar un nombre valido",
                duration: 3000,
                close: false,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #FF4848, #f5ac6d)",
                },
                onClick: function(){} // Callback after click
            }).showToast();
            return;
        }else{
            name.style.border = "none";
        } 
        
        /*Si el usuario intenta ingresar numeros en el campo de apellido se considera invalido */
        if(!regExLetters.test(lastName.value)){
            e.preventDefault()
            lastName.style.border = "thick solid #ff7b7b"
            Toastify({
                text: "Debes ingresar un apellido valido",
                duration: 3000,
                close: false,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #FF4848, #f5ac6d)",
                },
                onClick: function(){} // Callback after click
            }).showToast();
            return;
        }else{
            lastName.style.border = "none";
            
        } 

        /*Si el usuario intenta ingresar letras en un campo numerico se considera invalido (Esta validación podria eliminarse ya que desde
        el HTML se esta desplegando el teclado numerico al explicitarse que es un input de tipo numero) */

        if(!regExNumbers.test(phone.value)){
            e.preventDefault()
            phone.style.border = "thick solid #ff7b7b"
            Toastify({
                text: "Debes ingresar un teléfono valido",
                duration: 3000,
                close: false,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #FF4848, #f5ac6d)",
                },
                onClick: function(){} // Callback after click
            }).showToast();
            return;
        }else{
            phone.style.border = "none";
           
        }
        
        /*Si el usuario intenta realizar un pedido si rellenar este campo se ejecuta la funcion toastify() */
        if(!regExAddress.test(address.value)){
            e.preventDefault()
            address.style.border = "thick solid #ff7b7b"
            Toastify({
                text: "Debes ingresar una dirección de envío",
                duration: 3000,
                close: false,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #FF4848, #f5ac6d)",
                },
                onClick: function(){} // Callback after click
            }).showToast();
            return;
        }else{
            address.style.border = "none";
        }
        e.preventDefault(); 
        purchaseComplete();
    })
}

/*Esta función realiza cambios en el css para desplegar el mensaje de confirmación de que el pedido fue despachado con éxito */
const purchaseComplete = e =>{
    localStorage.setItem("listaProductos", JSON.stringify(null));
    localStorage.setItem("#productosComprados", JSON.stringify(0));
    const purchaseComplete = document.getElementById("purchase-complete");
    const sectionForm = document.getElementById("section-form");
    sectionForm.style.display = "none";
    sectionBill.style.display = "none";
    sectionProducts.style.display = "none";
    purchaseComplete.classList.replace("hidden", "flex");
}


