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


/*These are the functions that are executed at full load of the DOM*/
document.addEventListener("DOMContentLoaded", e =>{
    /*This validation executes the purchaseComplete function so that if the user reloads the page at the end of the purchase
    the goodbye message is displayed*/
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

/*This function loads the dynamic elements into the DOM */
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

/*This function adds quantities of the products measured in KG if the user wishes to do from the home delivery page*/
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


/*This function subtracts quantities of the products measured in KG if the user wishes to do from the home delivery page*/
const restarCantidadesKg = ()=>{   
    const btnsDecreased = document.querySelectorAll("#btn-less");
    btnsDecreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnDecreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnDecreased = document.querySelector(`#quantity[data-quantity-Item=cantidad${idBtnDecreased}]`);
            const productToDelete = document.querySelector(`#productToDelete[data-delete-Id=id${idBtnDecreased}]`);
            const valueDecreased = parseFloat(quantityBtnDecreased.textContent);
            //Here the type of weight unit is validated, if the product is in KG, the sum of 1 pound is executed.
            if(idUnidades === "Kg"){
                if(quantityBtnDecreased.textContent > 0){
                    quantityBtnDecreased.textContent = valueDecreased - 0.5;
                    productsCart[idBtnDecreased].cantidad = quantityBtnDecreased.textContent;
                };
                /*This validation allows to delete the product if the user subtracts quantities and reaches 0 */
                if(quantityBtnDecreased.textContent == 0){
                    sectionProducts.removeChild(productToDelete);
                    //This statement removes the product from the object in the localStorage
                    delete productsCart[idBtnDecreased];
                    quantityCart -= 1;
                }  
            };
            /* Here the localStorage is updated according to the actions carried out in the previous lines */
            localStorage.setItem("#productosComprados", quantityCart);
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            /*This function is executed in order to update the pertinent elements in the invoice on the screen*/
            updateBill();
        })
    })  
}

/*This function removes the product from the cart if the user clicks the trash icon*/
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
                /* Here the localStorage is updated according to the actions carried out in the previous lines */
                localStorage.setItem("#productosComprados", quantityCart);
                localStorage.setItem("listaProductos", JSON.stringify(productsCart));
                /*Se ejecuta esta funcion con el fín de actualizar los elementos pertinentes en la factura en pantalla*/
                updateBill();
            }
            
        })
    })
}

/*This function adds quantities of the products measured in units the user wishes to do from the home delivery page*/
const sumarCantidadesUnd = ()=>{   
    const btnsIncreased = document.querySelectorAll("#btn-add");
    btnsIncreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnIncreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnIncreased = document.querySelector(`#quantity[data-quantity-Item=cantidad${idBtnIncreased}]`);
            const valueIncreased = parseFloat(quantityBtnIncreased.textContent);
            //Here the type of weight unit is validated, if the product is in Und, the sum of 1 unit is executed.
            if(idUnidades === "Und") quantityBtnIncreased.textContent = valueIncreased + 1; 
            productsCart[idBtnIncreased].cantidad = quantityBtnIncreased.textContent;
            /* Here the localStorage is updated according to the actions carried out in the previous lines */
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            /*This function is executed in order to update the pertinent elements in the invoice on the screen*/
            updateBill();
        })
    })  
}

/*This function subtracts quantities of the products measured in units the user wishes to do from the home delivery page*/
const restarCantidadesUnd = ()=>{   
    const btnsDecreased = document.querySelectorAll("#btn-less");
    btnsDecreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnDecreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnDecreased = document.querySelector(`#quantity[data-quantity-Item=cantidad${idBtnDecreased}]`);
            const productToDelete = document.querySelector(`#productToDelete[data-delete-Id=id${idBtnDecreased}]`);
            const valueDecreased = parseFloat(quantityBtnDecreased.textContent);
            //Here the type of weight unit is validated, if the product is in Und, the subtract of 1 unit is executed.
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
            /* Here the localStorage is updated according to the actions carried out in the previous lines */
            localStorage.setItem("#productosComprados", quantityCart);
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            /* This function is executed in order to update the pertinent elements in the invoice on the screen */
            updateBill();
        })
    })  
}

/*This function subtotals the purchase*/
const subTotal = () =>{
    const sumaTotal = Object.values(productsCart).reduce((acc, {precio, cantidad}) => acc + precio*cantidad, 0);
    return sumaTotal.toFixed(3);
}; 

/*This function calculates the VAT according to the subtotal calculated in the previous function */
const ivaCalculado = ()=>{
    const resultadoIva = (subTotal() * 19) / 100;
    return resultadoIva.toFixed(3);
}    

/*This function calculates the grand total according to the results of subTotal() and ivaCalculado() */
const granTotal = ()=>{
    const granTotal = parseFloat(parseFloat(subTotal())) + parseFloat(ivaCalculado());
    return granTotal.toFixed(3);
}

/*This function renders in the DOM the dynamic elements of the purchase summary*/
const renderBill = () =>{
    templateBill.querySelector("#subTotal").textContent = subTotal();
    templateBill.querySelector("#iva").textContent = ivaCalculado();
    templateBill.querySelector("#total").textContent = granTotal();
    const clone = templateBill.cloneNode(true);
    fragment.appendChild(clone);
    sectionBill.appendChild(fragment);
}

/*This function updates the purchase summary if there is any change in the shopping cart */
const updateBill = () =>{
    sectionBill.querySelector("#subTotal").textContent = subTotal();
    sectionBill.querySelector("#iva").textContent = ivaCalculado();
    sectionBill.querySelector("#total").textContent = granTotal();
}

/*This function validates that the information entered by the user to create the address form is correct */
const validationForm = () => {
    const name = document.getElementById("name");
    const lastName = document.getElementById("lastname");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const regExNumbers = /^[0-9]+$/;
    const regExLetters = /^[a-zA-ZñÑ]+$/;
    const regExAddress = /^[a-zA-Z#0-9]+$/;

    /*If the user tries to place an order with an empty cart, the internal toastify function is executed */
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
        /*If the user tries to enter numbers in a letter field it is considered an invalid name */
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
        
        /*If the user tries to enter numbers in the last name field, it is considered invalid */
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

        /*If the user tries to enter letters in a numeric field it is considered invalid (This validation could be eliminated since from
        the HTML is displaying the numeric keyboard when it is made explicit that it is an input of type number) */
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
        
        /*If the user tries to place an order without filling in this field, the toastify() function is executed */
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

/*This function makes changes to the css to display the confirmation message that the order was successfully dispatched */
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


