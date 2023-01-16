const aplicarDescuento = new Promise((resolve, reject) => {
	const descuento = true;

	if (descuento) resolve('Descuento aplicado');
	else reject('No se aplico el descuento');
});

aplicarDescuento
	.then(resultado => {
		console.log(resultado);
	})
	.catch(error => {
		console.log(error);
	});

//Hay 3 valores posbles....
//fulfilled - El primise se cumplio
//rejected - El Promise no se cumplio
//pending - No se ha cumplido y tampoco fue rechazado
