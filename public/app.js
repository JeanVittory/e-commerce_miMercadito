const cards = document.getElementById("cards");
const templateCards = document.getElementById("template-cards").content;
const fragment = document.createDocumentFragment();

document.addEventListener("DOMContentLoaded", ()=>{
    fetchData();
})

const fetchData = async()=>{
    try {
        const res = await fetch('db.json');
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data =>{
    data.forEach(element => {
        templateCards.querySelector('img').setAttribute('src', element.imagen);
        templateCards.querySelector('#dscto').textContent = element.Descuento;   
        templateCards.querySelector('#titulo-card').textContent = element.Nombre;
        templateCards.querySelector('#precio-antes').textContent = element.PrecioAntes.toFixed(3);
        templateCards.querySelector('#precio-ahora').textContent = element.PrecioDespues.toFixed(3)
        templateCards.querySelector('#unidades').textContent = element.UnidadDePeso;
        const clone = templateCards.cloneNode(true)
        fragment.appendChild(clone)
    });

    cards.appendChild(fragment)
}

//Este objeto esta enfocado a ser dinámico en funcion de lo que el cliente vaya agregando desde el DOM
let productosComprados = [];    
      
    
        // Función que aumentara .5 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en KG
        let contadorKg = 0;
        const sumaKilogramos = () =>{
            return contadorKg += 0.5
        }    
    
        // Función que aumentara .5 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en KG
        const restaKilogramos = () =>{
            if(contadorKg === 0) return 0;
            if(contadorKg > 0) return contadorKg -= 0.5;
        }    
    
        // Función que aumentara de 1 en 1 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en unidades
        let contadorUnidades = 0;
        const SumaUnidades = () =>{
            return contadorUnidades += 1;
        }    
    
        // Función que disminuira de 1 en 1 cada vez que el cliente de click en el '-' de la tarjeta en cada producto calculado en unidades
        const RestaUnidades = () =>{
    
            if(contadorUnidades > 0 ) return contadorUnidades -= 1;
            if(contadorUnidades === 0) return 0;
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
    
    
    


