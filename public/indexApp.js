const cards = document.getElementById("cards");
const cantidadProducto = document.getElementById("cantidadProducto");
const navContainer = document.getElementById("navContainer");
let basketNumber =  document.getElementById("basketNumber");
const templateCards = document.getElementById("template-cards").content;
const fragment = document.createDocumentFragment();

//Este array esta enfocado a ser dinámico en funcion de lo que el cliente vaya agregando desde el DOM
let productosComprados= JSON.parse(localStorage.getItem("listaProductos")) || {}; 

document.addEventListener("DOMContentLoaded", e => {
    fetchData();
    cards.addEventListener("click", (e) => {
        addCarrito(e);
    })
    navContainer.addEventListener("click", e =>{
        btnAlertDisabled(e);
    })
    getLocalStorage();
})

//Función que solicita informacion del db.json
const fetchData = async()=>{
    try{
        const res = await fetch("https://raw.githubusercontent.com/JeanVittory/e-commerce_miMercadito/main/public/db.json");
        const data = await res.json();
        pintarCards(data);
        sumarCantidadesKg();
        restarCantidadesKg();
        sumarCantidadesUnd();
        restarCantidadesUnd();
        filterProducts();
    }catch (error){
        console.log(error);
    }
}

//Funcion que usa la info de db.json para renderizar en pantalla la data
const pintarCards = data =>{
    data.forEach(element => {
        templateCards.querySelector('article').dataset.grupoFiltro = element.Grupo;        
        templateCards.querySelector('img').setAttribute('src', element.imagen);
        templateCards.querySelector('img').setAttribute('alt', "producto");
        templateCards.querySelector('#dscto').textContent = element.Descuento;   
        templateCards.querySelector('#titulo-card').textContent = element.Nombre;
        templateCards.querySelector('#precio-antes').textContent = element.PrecioAntes.toFixed(3);
        templateCards.querySelector('#precio-ahora').textContent = element.PrecioDespues.toFixed(3);
        templateCards.querySelector('#unidades').textContent = element.UnidadDePeso;
        templateCards.querySelector('#btn-less').dataset.id = element.id;
        templateCards.querySelector('#btn-less').dataset.unidades = element.UnidadDePeso;
        templateCards.querySelector("#cantidadProducto").dataset.quantity = `cantidad${element.id}`;
        templateCards.querySelector('#btn-increased').dataset.id = element.id;
        templateCards.querySelector('#btn-increased').dataset.unidades = element.UnidadDePeso;
        templateCards.querySelector('.btn-comprar').dataset.id = element.id
        const clone = templateCards.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}

//Esta funcion dispara la alerta si el usuario intenta finalizar una compra sin agregar ningún producto al carrito
const btnAlertDisabled = e => {
    if(e.target.classList.contains("anchorEndBuy")){
        Toastify({
            text: "Debes ingresar un producto a la canasta",
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
    }
}

//Esta funcion filtra los productos segun los data attributes seteados en el html y en la linea 31
const filterProducts = ()=>{
    const btnsFilter = document.querySelectorAll(".btn");
    const productos = document.querySelectorAll(".producto");

    for(let i of btnsFilter){
        i.addEventListener("click", e =>{
            e.preventDefault();
            const filter = e.target.dataset.filter;
            productos.forEach(producto=>{
                filter === "todos" ? (
                    producto.classList.add("mostrar") 
                ):(
                    producto.dataset.grupoFiltro !== filter ? (
                        producto.classList.remove("mostrar"), 
                        producto.classList.add("hidden") 
                    ):(
                        producto.classList.remove("mostrar"), 
                        producto.classList.remove("hidden") 
                    )
                )
            })
            selectedCategories(e);
        })
    }
}

//Esta funcion alterna las clases para referenciar el filtro seleccionado por el usuario. El inicio predeterminado es la pestaña "TODOS"
const selectedCategories = e =>{
    const btns = document.querySelectorAll(".btn");
    for(let a of btns){
        e.target.classList.replace("unselected-category", "selected-category");
        a.classList.replace("selected-category", "unselected-category");
    }   
}

//Función que suma 1 libra a los productos catalogados en KG desde el .JSON
const sumarCantidadesKg = ()=>{   
    const btnsIncreased = document.querySelectorAll("#btn-increased");
    btnsIncreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnIncreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnIncreased = document.querySelector(`#cantidadProducto[data-quantity=cantidad${idBtnIncreased}]`);
            const valueIncreased = parseFloat(quantityBtnIncreased.innerHTML);
            //Aqui se valida el tipo de unidad de peso, si el producto esta en KG se ejecuta la suma de 1 libra.
            if(idUnidades === "Kg") quantityBtnIncreased.textContent = valueIncreased + 0.5; 
        })
    })  
}


//Función que resta 1 libra a los productos catalogados en KG desde el .JSON
const restarCantidadesKg = ()=>{
    const btnsDecreased = document.querySelectorAll("#btn-less")
    btnsDecreased.forEach(btn =>{
        btn.addEventListener("click", e =>{
            const idBtnDecreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnDecreased = document.querySelector(`#cantidadProducto[data-quantity=cantidad${idBtnDecreased}]`);
            const valueDecreased = parseFloat(quantityBtnDecreased.innerHTML);
            if(idUnidades === "Kg"){
                if(quantityBtnDecreased.textContent > 0) quantityBtnDecreased.textContent = valueDecreased - 0.5;
            }
        })
    })
}

//Función que suma 1 unidad a los productos catalogados en UND desde el .JSON
const sumarCantidadesUnd = ()=>{
    const btnsIncreased = document.querySelectorAll('#btn-increased')
    btnsIncreased.forEach(btn =>{
        btn.addEventListener("click", e =>{
            const idBtnIncreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnIncreased = document.querySelector(`#cantidadProducto[data-quantity=cantidad${idBtnIncreased}]`);
            const valueIncreased = parseInt(quantityBtnIncreased.innerHTML);
            if(idUnidades === "Und") quantityBtnIncreased.textContent = valueIncreased + 1;
        })
    })
}

//Función que resta 1 unidad a los productos catalogados en UND desde el .JSON
const restarCantidadesUnd = ()=>{
    const btnsDecreased = document.querySelectorAll("#btn-less")
    btnsDecreased.forEach(btn =>{
        btn.addEventListener("click", e =>{
            const idBtnDecreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnDecreased = document.querySelector(`#cantidadProducto[data-quantity=cantidad${idBtnDecreased}]`);
            const valueDecreased = parseInt(quantityBtnDecreased.innerHTML);
            if(idUnidades === "Und"){
                if(quantityBtnDecreased.textContent > 0) quantityBtnDecreased.textContent = valueDecreased - 1;
            }
        })
    })
}

//esta funcion captura el elemento html que sera usado como constructor del objeto en setCarrito
const addCarrito = e =>{
    if(e.target.classList.contains("btn-comprar")){
        setCarrito(e.target.parentElement);
    } 
    e.stopPropagation()
}

//Esta función crea un objeto por cada producto comprado y lo agrega al array productoscomprados
const setCarrito = productos => {

    //Aqui se valida de que el usuario no intente agregar un producto con cantidad 0
    if(productos.querySelector('#cantidadProducto').textContent !==  "0"){
        const producto = {
            id: productos.querySelector('.btn-comprar').dataset.id,
            nombre: productos.querySelector('h2').textContent,
            precio: productos.querySelector('#precio-ahora').textContent,
            cantidad: parseFloat(productos.querySelector('#cantidadProducto').textContent),
            unidad: productos.querySelector('#unidades').textContent
        }
        //aqui se valida si el producto ya existe en el array productosComprados
        productosComprados.hasOwnProperty(producto.id) ? (
            producto.cantidad = parseFloat(productosComprados[producto.id].cantidad) + parseFloat(producto.cantidad)            
        ):(
            //Esta función setea el localStorage cuando el producto no existe en el array productosComprados
            numberCarrito()
        )
        //Esta linea resetea la cantidad de la card en el DOM
        productos.querySelector('#cantidadProducto').textContent = 0;
        //esta linea agrega el objeto al array productosComprados
        productosComprados[producto.id] = {...producto};
        //Esta linea guarda el carrito en el localStorage
        localStorage.setItem("listaProductos", JSON.stringify(productosComprados));
        Toastify({
            text: "Se ha agregado el producto",
            duration: 3000,
            close: false,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #8711c1, #2472fc)",
            },
            onClick: function(){} // Callback after click
          }).showToast();
    }else{
        //esta linea ejecuta la biblioteca sweetAlert en el caso de que el usuario intente agregar un producto con cantidad 0
        Toastify({
            text: "No has indicado una cantidad a comprar",
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
    }
}

////Esta función setea el localStorage cuando el producto no existe en el array productosComprados y aumenta el numero en el carrito
const numberCarrito = ()=>{
    const btnComprar = document.getElementById('btnComprar');
    const anchorEndBuy = document.getElementById('anchorEndBuy')
    //Esta linea habilita visualmente el boton "comprar" 
    if(btnComprar.classList.contains("btn-buy-disable")){
        btnComprar.classList.remove("btn-buy-disable");
        btnComprar.classList.remove("btn-buy-disable");
        btnComprar.classList.add("btn-buy-able");
        localStorage.setItem("btnClassActive", "btn-buy-able");
    }

    if(anchorEndBuy.classList.contains("anchorEndBuy")){
        anchorEndBuy.classList.remove("anchorEndBuy")
        anchorEndBuy.setAttribute("href", "public/pages/deliverySection.html")
        localStorage.setItem("hrefDelivery", "public/pages/deliverySection.html")
    }
    let pseudoNumberStorage = basketNumber.textContent;
    let resultado = parseInt(pseudoNumberStorage) + 1;
    basketNumber.textContent = resultado;
    localStorage.setItem("#productosComprados", resultado);
}

//Esta funcion se ejecuta a la carga del DOM para recuperar los datos del localStorage
const getLocalStorage = () =>{
    let productsStorageQuantity = JSON.parse(localStorage.getItem("#productosComprados"));
    let btnClassActive = localStorage.getItem("btnClassActive");
    
    switch (productsStorageQuantity){
        case NaN:
            basketNumber.textContent = 0
        break;
        case null:
            basketNumber.textContent = 0
        break;
        default:
            basketNumber.textContent = productsStorageQuantity;
        break;
    }

    if(productsStorageQuantity > 0){
        btnComprar.classList.add(btnClassActive);
        anchorEndBuy.setAttribute("href", "./pages/deliverySection.html")
        anchorEndBuy.classList.remove("anchorEndBuy")
    } 
}
















// Función que retorna el total de la cantidad comprada por el cliente:
const cantidadTotal = ()=>{
    const sumaCantidades = productosComprados.reduce((acc, {cantidad}) => acc + cantidad , 0);
    return sumaCantidades;
};

//Función que retorna el subtotal de lo comprado por el cliente:
const subTotal = () =>{
    const sumaTotal = productosComprados.reduce((acc, {precio, cantidad}) => acc + precio*cantidad, 0);
    return sumaTotal.toFixed(3);
};    
    
// Esta funcion retorna el impuesto expresado en pesos el cual será sumado al gran total
const ivaCalculado = ()=>{
    const resultadoIva = (subTotal() * 19) / 100;
    return resultadoIva.toFixed(3);
}    
    
//Funcion que retorna el total despues del impuesto de IVA (19% col)
const granTotal = ()=>{
    const granTotal = parseFloat(parseFloat(subTotal())) + parseFloat(ivaCalculado());
    return granTotal.toFixed(3);
}