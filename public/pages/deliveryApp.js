

const templateProducts = document.getElementById("template-products").content;
const templateBill = document.getElementById("template-bill").content;
const sectionProducts = document.getElementById("section-products");
const sectionBill = document.getElementById("section-bill");
const bill = document.getElementById("bill")
const form = document.getElementById("form")
let productsCart = JSON.parse(localStorage.getItem("listaProductos"));
let quantityCart = JSON.parse(localStorage.getItem("#productosComprados"));
const fragment = document.createDocumentFragment();

document.addEventListener("DOMContentLoaded", e =>{
    renderProducts();
    renderBill();
    sumarCantidadesKg();
    restarCantidadesKg();
    sumarCantidadesUnd();
    restarCantidadesUnd();
    deleteProducts();
    validationForm();
})

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
            updateBill();
        })
    })  
}

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
                if(quantityBtnDecreased.textContent == 0){
                    sectionProducts.removeChild(productToDelete);
                    delete productsCart[idBtnDecreased];
                    quantityCart -= 1;
                }  
            };
            localStorage.setItem("#productosComprados", quantityCart);
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            updateBill();
        })
    })  
}

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
                localStorage.setItem("#productosComprados", quantityCart);
                localStorage.setItem("listaProductos", JSON.stringify(productsCart));
                updateBill();
            }
            
        })
    })
}

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
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            updateBill();
        })
    })  
}

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
            localStorage.setItem("#productosComprados", quantityCart);
            localStorage.setItem("listaProductos", JSON.stringify(productsCart));
            updateBill();
        })
    })  
}

const subTotal = () =>{
    const sumaTotal = Object.values(productsCart).reduce((acc, {precio, cantidad}) => acc + precio*cantidad, 0);
    return sumaTotal.toFixed(3);
}; 

const ivaCalculado = ()=>{
    const resultadoIva = (subTotal() * 19) / 100;
    return resultadoIva.toFixed(3);
}    

const granTotal = ()=>{
    const granTotal = parseFloat(parseFloat(subTotal())) + parseFloat(ivaCalculado());
    return granTotal.toFixed(3);
}

const renderBill = () =>{
    templateBill.querySelector("#subTotal").textContent = subTotal();
    templateBill.querySelector("#iva").textContent = ivaCalculado();
    templateBill.querySelector("#total").textContent = granTotal();
    const clone = templateBill.cloneNode(true);
    fragment.appendChild(clone);
    sectionBill.appendChild(fragment);
}

const updateBill = () =>{
    sectionBill.querySelector("#subTotal").textContent = subTotal();
    sectionBill.querySelector("#iva").textContent = ivaCalculado();
    sectionBill.querySelector("#total").textContent = granTotal();
}


const validationForm = () => {
    const name = document.getElementById("name");
    const lastName = document.getElementById("lastname");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const regExNumbers = /^[0-9]+$/;
    const regExLetters = /^[a-zA-Z]+$/;

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
        
        if(!regExLetters.test(address.value)){
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
