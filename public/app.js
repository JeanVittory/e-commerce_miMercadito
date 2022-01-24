//Este objeto esta enfocado a ser dinámico en funcion de lo que el cliente vaya agregando desde el DOM
let productosComprados = {
    1:{
        nombre: 'Costilla de Res',
        precio: 9.600,
        //Este valor deberia ser introducido por un data-attribute que aumenta o disminuye según las unidades o kg comprados (0.5kg = 1, 1kg = 2, 1.5kg = 3 etc; 1und = 1 etc)
        cantidad: 1 
    },
    2:{
        nombre: 'Queso Campesino',
        precio: 8.000,
        cantidad: 2
    },
    3:{
        nombre: 'Arroz Flor Huila',
        precio: 2.400,
        cantidad: 5
    }
};


// Función que retorna el total de la cantidad comprada por el cliente:

const cantidadTotal = ()=>{
    const sumaCantidades = Object.values(productosComprados).reduce((acc, {cantidad}) => acc + cantidad , 0);
    return sumaCantidades;
};
console.log(cantidadTotal());


//Función que retorna el subtotal de lo comprado por el cliente:

const subTotal = () =>{
    const sumaTotal = Object.values(productosComprados).reduce((acc, {precio, cantidad}) => acc + precio*cantidad, 0);
    return sumaTotal.toFixed(3);
};

console.log(subTotal());

// Esta funcion retorna el impuesto expresado en pesos el cual será sumado al gran total
const ivaCalculado = ()=>{
    const resultadoIva = (subTotal() * 19) / 100;
    return resultadoIva;
}

console.log(ivaCalculado())

//Funcion que retorna el total despues del impuesto de IVA (19% col)
const granTotal = ()=>{
    const granTotal = parseFloat(subTotal()) + parseFloat(ivaCalculado());
    return granTotal;
}

console.log(granTotal());


