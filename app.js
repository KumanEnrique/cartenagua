const formulario = document.getElementById("formulario")
const cantidad = document.getElementById("cantidad")
const fecha = document.getElementById("fecha")
const descripcion = document.getElementById("descripcion")
const tipo = document.getElementsByName("tipo")
const totalTitle = document.getElementById("total")
const bArchivo = document.getElementById("archivo")
const cardTotal = document.getElementById("card-total")
let contenedor = document.getElementById("contenedor")

function radiob(radios){
    for(let i = 0 ;i < radios.length;i++){
        if(radios[i].checked){
            return radios[i].value
        }
    }
}
function imprimirActivo(){
    db.collection("carteraMia").onSnapshot((querySnapshot) => {
        contenedor.innerHTML = ""
        querySnapshot.forEach((doc) => {
            // console.log(doc.id)
            const {cantidad,fecha,valorRadio,descripcion,archivado} = doc.data()
            const fechas = new Date(fecha.toDate()).toLocaleString()
            let alerta
            if(valorRadio == "entrada"){
                alerta = "success"
            }else{
                alerta = "danger"
            }
            if(archivado){
                return
            }
            contenedor.innerHTML += `
                <div class="col-sm-3 mb-3">
                    <div class="card text-center">
                        <div class="card-header">
                            <p class="d-none">${doc.id}</p>
                            <p>$ ${cantidad}</p>
                        </div>
                        <div class="card-body">
                            <p class="alert alert-${alerta}" role="alert">${valorRadio}</p>
                            <p>${fechas}</p>
                            <p>${descripcion}</p>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-danger">eliminar</button>
                            <button class="btn btn-secondary btn-outline-warning">archivar</button>
                        </div>
                    </div>
                </div>
            `
        });
    });
}
function imprimirTotalActivo(){
    db.collection("carteraMia").onSnapshot((querySnapshot) => {
        let total = 0
        totalTitle.innerHTML = ""
        querySnapshot.forEach((doc) => {
            const {cantidad,valorRadio,archivado} = doc.data()
            if (valorRadio == "entrada" && archivado == false){
                total += cantidad
            }else if(valorRadio == "gasto" && archivado == false){
                total += -cantidad
            }
        });
        totalTitle.innerHTML = total
    });
}
function imprimirArchivado(){
    db.collection("carteraMia").onSnapshot((querySnapshot) => {
        contenedor.innerHTML = ""
        totalTitle.innerHTML = ""
        querySnapshot.forEach((doc) => {
            const {cantidad,fecha,valorRadio,descripcion,archivado} = doc.data()
            const fechas = new Date(fecha.toDate()).toLocaleString()
            let alerta
            if(valorRadio == "entrada"){
                alerta = "success"
            }else{
                alerta = "danger"
            }
            if(!archivado){
                return
            }
            contenedor.innerHTML += `
                <div class="col-sm-3 mb-3">
                    <div class="card text-center">
                        <div class="card-header">
                            <p class="d-none">${doc.id}</p>
                            <p>$ ${cantidad}</p>
                        </div>
                        <div class="card-body">
                            <p class="alert alert-${alerta}" role="alert">${valorRadio}</p>
                            <p>${fechas}</p>
                            <p>${descripcion}</p>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-warning">eliminar</button>
                        </div>
                    </div>
                </div>
            `
        });
    });
}

imprimirActivo()
imprimirTotalActivo()

formulario.addEventListener("submit",(e)=>{
    e.preventDefault()
    
    const date = new Date(fecha.value)
    const radio = radiob(tipo)
    db.collection("carteraMia").add({
        cantidad: Number(cantidad.value),
        fecha: date,
        valorRadio: radio,
        descripcion: descripcion.value,
        archivado: false
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
    cantidad.value = ""
    fecha.value = ""
    descripcion.value = ""
})

contenedor.addEventListener("click",(e)=>{
    if (e.target.innerHTML == "eliminar"){
    const id = e.target.parentNode.parentNode.children[0].children[0].innerHTML
        db.collection("carteraMia").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
})

contenedor.addEventListener("click",(e)=>{
    if (e.target.innerHTML == "archivar"){
    const id = e.target.parentNode.parentNode.children[0].children[0].innerHTML
        db.collection('carteraMia').doc(id).set({
            archivado: true,
        }, { merge: true });
    }
})

let bPrincipal = document.getElementById('principal')
bArchivo.addEventListener("click",()=>{
    bArchivo.style.display = "none"
    imprimirArchivado()
    bPrincipal.style.display = "block"
    bPrincipal.addEventListener("click",()=>{
        imprimirActivo()
        imprimirTotalActivo()
        bArchivo.style.display = "block"
        bPrincipal.style.display = "none"
    })
})//! tiene un error al clickear por segunda vez el boton de principal (al recargar si arregla), se puede arreglar tambien con bubling












//agregar campo a documento ya creado
// db.collection("carteraMia").onSnapshot((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(doc.id)
//         console.log(doc.data())
//         db.collection('carteraMia').doc(doc.id).set({
//             archivado: true
//         }, { merge: true });
//     });
// });

// var cityRef = db.collection('cities').doc('gf').collection('city').add({
//     capital: true,
//     caaaa: "12346sasa5",
// })
// var cityRef = db.collection('cities').doc('gf').collection('ctity').doc('gaf').set({
//     capital: true,
//     caaaa: "12346sasa5",
// }, { merge: true });

//remover campo
/* var cityRef = db.collection('lol').doc('sd');
var removeCapital = cityRef.update({
    capital: firebase.firestore.FieldValue.delete()
})*/
/* db.collection('lol').doc('sd').set({
    capital: true,
    mascota:'oso'
})*/