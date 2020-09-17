/* Variables y constantes */

var pag = document.getElementById("numeropagina").value;

var pagLimit;

const enlacesPag = document.querySelector("ul.pagination");

var booleanoModo = true; //Si es true, se han activado las categorias. Si es false, las razas.

/* Petición AJAX */

function request(url) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (xhr.getResponseHeader("Pagination-Count")) {
                        console.log(xhr.getResponseHeader("Pagination-Count")); //Esto saca el número de fotos total por categoria o por raza
                        console.log(xhr.getResponseHeader("Pagination-Page")); //Esto saca la página actual
                    }

                    pagLimit = Math.ceil(parseInt(xhr.getResponseHeader('Pagination-Count')) / 12);
                    if (pagLimit > 12) {
                        pagLimit = 12;
                    }

                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            }
        };
        xhr.ontimeout = function () {
            reject('timeout')
        };
        xhr.open('get', url, true);
        xhr.setRequestHeader("x-api-key", "b2a67d10-2fe7-4cf9-a264-d30611e17dbe");
        xhr.send();
    });
}


/* Promesa del select de las categorias */

const categorias = 'https://api.thecatapi.com/v1/categories';
const promesaCategorias = request(categorias);

promesaCategorias
    .then(function categorias(json) {
        const listGato = JSON.parse(json);
        listGato.forEach(gato => document.getElementById("categorias").innerHTML += "<option value=" + gato.id + ">" + gato.name + "</option>");
    })
    .catch(function handleErrors(error) {
        console.log('when a reject is executed it will come here ignoring the then statement ', error)
        document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
    })


/* Promesa del select de las razas */

const razas = 'https://api.thecatapi.com/v1/breeds';
const promesaRazas = request(razas);


promesaRazas
    .then(function razas(json) {
        const listGato = JSON.parse(json);
        listGato.forEach(gato => document.getElementById("razas").innerHTML += "<option value=" + gato.id + ">" + gato.name + "</option>");
    })
    .catch(function handleErrors(error) {
        console.log('when a reject is executed it will come here ignoring the then statement ', error)
        document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
    })

/* Crear links de la paginación */

function anterior() {
    let anterior = document.createElement('li');
    anterior.className = "page-item";
    anterior.id = "anterior";
    let antLink = document.createElement('a');
    antLink.className = "page-link";
    antLink.href = "#";
    antLink.textContent = "Anterior";
    anterior.appendChild(antLink);
    anterior.style.display = "none";
    return anterior;
}

function siguiente() {
    let siguiente = document.createElement('li');
    siguiente.className = "page-item";
    siguiente.id = "siguiente";
    let sigLink = document.createElement('a');
    sigLink.className = "page-link";
    sigLink.href = "#";
    sigLink.textContent = "Siguiente";
    siguiente.appendChild(sigLink);
    siguiente.style.display = "none";
    return siguiente;
}

function link() {
    let link = document.createElement('li');
    link.className = "page-item";
    let aLink = document.createElement('a');
    aLink.className = "page-link";
    aLink.href = "#";
    link.appendChild(aLink);
    return link;
}


/* Eventos de los botones */

/* Botón de las categorias */
function botonCategorias() {
    //document.getElementById("boton1").addEventListener("click", () => {
    var catID = document.getElementById("categorias").value;
    var primeraCat = 'https://api.thecatapi.com/v1/images/search?category_ids=' + catID + '&limit=12&page=0&order=DESC';
    pag = "0";
    const boton1 = request(primeraCat);

    boton1
        .then(function boton(json) {
            if (enlacesPag.hasChildNodes) {
                enlacesPag.innerHTML = "";
            }
            const listGato = JSON.parse(json);
            document.getElementById("gatos").innerHTML = "";
            listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
            enlacesPag.appendChild(anterior());
            for (let i = 0; i < pagLimit; i++) {
                if (i == 0) {
                    let link = document.createElement('li');
                    link.className = "page-item";
                    let aLink = document.createElement('a');
                    aLink.className = "page-link";
                    aLink.href = "#";
                    aLink.textContent = (i + 1).toString();
                    link.appendChild(aLink);
                    link.className = "page-item active";
                    enlacesPag.appendChild(link);
                } else {
                    let link = document.createElement('li');
                    link.className = "page-item";
                    let aLink = document.createElement('a');
                    aLink.className = "page-link";
                    aLink.href = "#";
                    aLink.textContent = (i + 1).toString();
                    link.appendChild(aLink);
                    enlacesPag.appendChild(link);
                }
            }
            enlacesPag.appendChild(siguiente());
            if (enlacesPag.children.length > 3) {
                document.getElementById("siguiente").style.display = "inline";
            }
        })
        .catch(function handleErrors(error) {
            console.log('when a reject is executed it will come here ignoring the then statement ', error)
            document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
        })
    //});
    return booleanoModo = true;
}


/* Botón de las razas */

function botonRazas() {
    //document.getElementById("boton2").addEventListener("click", () => {
    var razaID = document.getElementById("razas").value;
    var primeraRaza = 'https://api.thecatapi.com/v1/images/search?breed_ids=' + razaID + '&limit=12&page=0&order=DESC';
    pag = "0";
    const boton2 = request(primeraRaza);

    boton2
        .then(function boton(json) {
            if (enlacesPag.hasChildNodes) {
                enlacesPag.innerHTML = "";
            }
            const listGato = JSON.parse(json);
            document.getElementById("gatos").innerHTML = "";
            listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
            enlacesPag.appendChild(anterior());
            for (let i = 0; i < pagLimit; i++) {
                if (i == 0) {
                    let link = document.createElement('li');
                    link.className = "page-item";
                    let aLink = document.createElement('a');
                    aLink.className = "page-link";
                    aLink.href = "#";
                    aLink.textContent = (i + 1).toString();
                    link.appendChild(aLink);
                    link.className = "page-item active";
                    enlacesPag.appendChild(link);
                } else {
                    let link = document.createElement('li');
                    link.className = "page-item";
                    let aLink = document.createElement('a');
                    aLink.className = "page-link";
                    aLink.href = "#";
                    aLink.textContent = (i + 1).toString();
                    link.appendChild(aLink);
                    enlacesPag.appendChild(link);
                }
            }
            enlacesPag.appendChild(siguiente());
            if (enlacesPag.children.length > 3) {
                document.getElementById("siguiente").style.display = "inline";
            }
        })
        .catch(function handleErrors(error) {
            console.log('when a reject is executed it will come here ignoring the then statement ', error)
            document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
        })
    //});
    return booleanoModo = false;
}


/* Pasar de página */

enlacesPag.addEventListener("click", (event) => {

    if (booleanoModo) {
        var catID = document.getElementById("categorias").value;
        if (event.target.textContent === "Anterior" && pag != '0') {
            document.getElementById("siguiente").style.display = 'block';
            pag = (parseInt(pag) - 1);
            document.getElementById("numeropagina").value = pag.toString();
            var imagenes = 'https://api.thecatapi.com/v1/images/search?category_ids=' + catID + '&limit=12&page=' + pag + '&order=DESC';
            const promesaPagina = request(imagenes);
            if (pag == '0') {
                document.getElementById("anterior").style.display = 'none';
                document.getElementById("siguiente").style.display = 'block';
            }
            promesaPagina
                .then(function cambiarPagina(json) {
                    const listGato = JSON.parse(json);
                    document.getElementById("gatos").innerHTML = "";
                    listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
                }).catch(function handleErrors(error) {
                    console.log('when a reject is executed it will come here ignoring the then statement ', error);
                    document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
                })
        } else if (event.target.textContent === "Siguiente" && parseInt(pag) != pagLimit) {
            document.getElementById("anterior").style.display = 'block';
            pag = (parseInt(pag) + 1);
            document.getElementById("numeropagina").value = pag.toString();
            var imagenes = 'https://api.thecatapi.com/v1/images/search?category_ids=' + catID + '&limit=12&page=' + pag + '&order=DESC';
            const promesaPagina = request(imagenes);
            if (pag == (pagLimit - 1).toString()) {
                document.getElementById("siguiente").style.display = 'none';
                document.getElementById("anterior").style.display = 'block';
            }
            promesaPagina
                .then(function cambiarPagina(json) {
                    const listGato = JSON.parse(json);
                    document.getElementById("gatos").innerHTML = "";
                    listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
                }).catch(function handleErrors(error) {
                    console.log('when a reject is executed it will come here ignoring the then statement ', error);
                    document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
                })
        } else {
            pag = parseInt(event.target.textContent) - 1;
            document.getElementById("numeropagina").value = pag.toString();
            var imagenes = 'https://api.thecatapi.com/v1/images/search?category_ids=' + catID + '&limit=12&page=' + pag + '&order=DESC';
            if (document.getElementById("numeropagina").value == (pagLimit - 1).toString()) {
                document.getElementById("siguiente").style.display = 'none';
                document.getElementById("anterior").style.display = 'block';
            } else if (document.getElementById("numeropagina").value == '0') {
                document.getElementById("anterior").style.display = 'none';
                document.getElementById("siguiente").style.display = 'block';
            } else {
                document.getElementById("anterior").style.display = 'block';
                document.getElementById("siguiente").style.display = 'block';
            }
            const promesaPagina = request(imagenes);
            promesaPagina
                .then(function cambiarPagina(json) {
                    const listGato = JSON.parse(json);
                    document.getElementById("gatos").innerHTML = "";
                    listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
                }).catch(function handleErrors(error) {
                    console.log('when a reject is executed it will come here ignoring the then statement ', error);
                    document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
                })
        }
    } else {
        var razaID = document.getElementById("razas").value;
        if (event.target.textContent === "Anterior" && pag != '0') {
            document.getElementById("siguiente").style.display = 'block';
            pag = (parseInt(pag) - 1);
            document.getElementById("numeropagina").value = pag.toString();
            var imagenes = 'https://api.thecatapi.com/v1/images/search?breed_ids=' + razaID + '&limit=12&page=' + pag + '&order=DESC';
            const promesaPagina = request(imagenes);
            if (pag == '0') {
                document.getElementById("anterior").style.display = 'none';
                document.getElementById("siguiente").style.display = 'block';
            }
            promesaPagina
                .then(function cambiarPagina(json) {
                    const listGato = JSON.parse(json);
                    document.getElementById("gatos").innerHTML = "";
                    listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
                }).catch(function handleErrors(error) {
                    console.log('when a reject is executed it will come here ignoring the then statement ', error);
                    document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
                })
        } else if (event.target.textContent === "Siguiente" && parseInt(pag) != pagLimit) {
            document.getElementById("anterior").style.display = 'block';
            pag = (parseInt(pag) + 1);
            document.getElementById("numeropagina").value = pag.toString();
            var imagenes = 'https://api.thecatapi.com/v1/images/search?breed_ids=' + razaID + '&limit=12&page=' + pag + '&order=DESC';
            const promesaPagina = request(imagenes);
            if (pag == (pagLimit - 1).toString()) {
                document.getElementById("siguiente").style.display = 'none';
                document.getElementById("anterior").style.display = 'block';
            }
            promesaPagina
                .then(function cambiarPagina(json) {
                    const listGato = JSON.parse(json);
                    document.getElementById("gatos").innerHTML = "";
                    listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
                }).catch(function handleErrors(error) {
                    console.log('when a reject is executed it will come here ignoring the then statement ', error);
                    document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
                })
        } else {
            pag = parseInt(event.target.textContent) - 1;
            document.getElementById("numeropagina").value = pag.toString();
            var imagenes = 'https://api.thecatapi.com/v1/images/search?breed_ids=' + razaID + '&limit=12&page=' + pag + '&order=DESC';
            if (document.getElementById("numeropagina").value == (pagLimit - 1).toString()) {
                document.getElementById("siguiente").style.display = 'none';
                document.getElementById("anterior").style.display = 'block';
            } else if (document.getElementById("numeropagina").value == '0') {
                document.getElementById("anterior").style.display = 'none';
                document.getElementById("siguiente").style.display = 'block';
            } else {
                document.getElementById("anterior").style.display = 'block';
                document.getElementById("siguiente").style.display = 'block';
            }
            const promesaPagina = request(imagenes);
            promesaPagina
                .then(function cambiarPagina(json) {
                    const listGato = JSON.parse(json);
                    document.getElementById("gatos").innerHTML = "";
                    listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
                }).catch(function handleErrors(error) {
                    console.log('when a reject is executed it will come here ignoring the then statement ', error);
                    document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
                })
        }
    }
    for (let i = 0; i < document.getElementsByTagName('li').length; i++) {
        if (document.getElementsByTagName('li')[i].textContent == (parseInt(pag) + 1).toString()) {
            document.getElementsByTagName('li')[i].className = 'page-item active';
        } else {
            document.getElementsByTagName('li')[i].className = 'page-item';
        }
    }
});

/* Primera carga de imágenes */

document.getElementById("boton-inicio").addEventListener("click", () => {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("buscador").style.display = "block";
    botonCategorias();
});