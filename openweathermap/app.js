const form = document.querySelector('#form');
const tempContainer = document.querySelector('.temp');

const mostrarDatos = e => {
	e.preventDefault();
	//validamos
	const pais = document.querySelector('#pais').value;

	if (pais === '') {
		mostrarAlerta('el campo no pue ir vacio');
		return;
	}
	//cosultamso APi
	consultarApi(pais);
	//Imprimimos los datos
};

const mostrarAlerta = mensaje => {
	const alerta = document.createElement('p');
	alerta.classList.add('form__alert');
	alerta.textContent = mensaje;

	const btn = document.querySelector('.form__submit');
	form.insertBefore(alerta, btn);

	setTimeout(() => {
		alerta.remove();
	}, 2000);
};
const consultarApi = pais => {
	const appID = 'd7be9a385d58f92b36d561b3f2415109';
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${pais}&appid=${appID}`;
	fetch(url)
		.then(resultado => resultado.json())
		.then(datos => {
			if (datos.cod === '404') {
				mostrarAlerta('Ciudad no encontrada');
			}
			limpiarDOM();
			mostrarHTML(datos);
		});
};
const mostrarHTML = datos => {
	console.log(datos);
	const { main, weather, coord, sys } = datos;

	//datos de temperatura e icono
	const { icon } = weather[0];
	const { temp, temp_max, temp_min } = main;
	const { country } = sys;
	//latitud y logitud
	const { lat, lon } = coord;

	//pasamos de kelvil a centrigrados
	const centrigrados = parseInt(temp - 273.15);

	//Insertamos en el DOM
	const temIco = document.createElement('div');
	const temGrades = document.createElement('div');

	temIco.innerHTML = /*html*/ `
    <img src="http://openweathermap.org/img/wn/${icon}.png" loading="lazy alt="" />
    `;

	temGrades.innerHTML = /*html*/ `
    <p class="tem__info">${centrigrados}ºC</p>
    <p class="tem__info">${country}</p>
    `;

	//iframe para el mapa
	const appID = 'd7be9a385d58f92b36d561b3f2415109';
	const map = document.querySelector('.map');
	// const mapUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${appID}`;
	const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&output=embed`;

	// const iframe = document.createElement('iframe');
	// iframe.src(mapUrl);

	tempContainer.append(temIco, temGrades);
	map.innerHTML = /*html*/ `
        <iframe
		    src="${mapUrl}"
		    width="600"
		    height="450"
		    style="border: 0"
		    loading="lazy"
		    referrerpolicy="no-referrer-when-downgrade"
	    ></iframe>
    `;
};

const limpiarDOM = () => {
	while (tempContainer.firstChild) {
		tempContainer.removeChild(tempContainer.firstChild);
	}
};

document.addEventListener('DOMContentLoaded', () => {
	form.addEventListener('submit', mostrarDatos);
});
