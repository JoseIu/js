const cargarTxt = document.querySelector('#cargar-txt');
const cargarJson = document.querySelector('#cargar-json');
const cargarJsonArray = document.querySelector('#cargar-json-array');
const content = document.querySelector('.content__content');

const mostrarHTML = (data, type) => {
	if (type === 'txt') return (content.innerHTML = /*html*/ `<p>${data}</p>`);
	if (type === 'json') {
		const { name, email, sexo } = data;
		content.innerHTML = /*html*/ `
        <p>nombre:${name}</p>
        <p>nombre:${email}</p>
        <p>nombre:${sexo}</p>
        `;
	}
	if (type === 'jsonArray') {
		console.log(data);
		let html = '';

		data.forEach(empleado => {
			const { name, age, eyeColor, email } = empleado;
			html += /*html*/ `
            <p>Nombre: ${name}</p>
            <p>Edad: ${age}</p>
            <p>Email: ${email}</p>
            <p>Color de ojos: ${eyeColor}</p>
            `;
		});
		content.innerHTML = html;
	}
};
const obtenerTxt = () => {
	const url = 'data/datos.txt';

	fetch(url)
		.then(respuesta => {
			console.log(respuesta);
			return respuesta.text();
		})
		.then(datos => mostrarHTML(datos, 'txt'));
};
const obtenerJson = () => {
	const url = 'data/empleado.json';
	fetch(url)
		.then(respuesta => {
			console.log(respuesta);
			return respuesta.json();
		})
		.then(datos => {
			mostrarHTML(datos, 'json');
		});
};
const obtenerJsonArray = () => {
	const url = 'data/empleados.json';
	fetch(url)
		.then(respuesta => {
			return respuesta.json();
		})
		.then(datos => mostrarHTML(datos, 'jsonArray'));
};

cargarTxt.addEventListener('click', obtenerTxt);
cargarJson.addEventListener('click', obtenerJson);
cargarJsonArray.addEventListener('click', obtenerJsonArray);
