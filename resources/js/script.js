
  document.addEventListener("DOMContentLoaded", function(event) {
    // El evento DOMContentLoaded sucede cuando se carga el HTML y se parsea en el navegador
    // Sucede antes de que la página cargue sus recursos (CSS y otros elementos que no son HTML)

    let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
    // Aquí guardamos en un array los elementos del LocalStorage parseándolos con JSON
    drawCategories();
    if (transactionObjArray !== null) {
        transactionObjArray.forEach(function (arrayElement) {
            // Luego insertamos en la tabla utilizando la función insertRowInTransactionTable 
            insertRowInTransactionTable(arrayElement);
        });
        
    }
   
        
    });
const form = document.getElementById("transactionform");

    form.addEventListener("submit", function(event){
            event.preventDefault() 
            //cancelamos el evento submit
            //ya no se envian los datos al server y tampoco se recarga la pagina
            //CANCELA EL EVENTO POR DEFECTO DEL NAVEGADOR event.preventDefault();
            //console.log(event)
            //alert(se detecto un envio de formulario)
            let transactionFormData = new FormData(form);
            //transforma el formulario a un obj formdata
            let transactionObject = convertFormaDataToTransactionObject(transactionFormData);
            //transforma el formdata a un objeto de js
            saveTransactionObject(transactionObject);
            //console.log(transactionObject)
            insertRowInTransactionTable(transactionObject);
            form.reset();
           
    });

  


    function saveTransactionObject(transactionObject) {
    let transactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    transactionArray.push(transactionObject);
    let transactionObjJSON = JSON.stringify(transactionArray);
    localStorage.setItem("transactionData", transactionObjJSON);
    }

        
    function deleteTransactionObject(transactionId) {
            //funcion para eiliminar un elemento del localstorage
            // le pasamos el nro de transaccion a eliminar
            let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
            //obtenemos el id de la transaccion
            let transactionIndexArray = transactionObjArray.findIndex(Element => Element.transactionId == transactionId);
            //obtenemos el indice del array de la transaccion
            transactionObjArray.splice(transactionIndexArray, 1);
            //eliminamos el elemento del array que coincide con el indice
            // ahora a actualizar el localstorage con los elementos restantes
            let transactionArrayjJSON = JSON.stringify(transactionObjArray);
            localStorage.setItem("transactionData",transactionArrayjJSON);

            
    }

    function getNewTransactionId() {
            //creando funcion para generar id unico
            let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
            //creas una variable y le asignas el ultimo valor del localstorage si no encuentra le asigna 1
            let newTransactionId = JSON.parse(lastTransactionId) + 1;
            //obtenemos el ultimo nro de transaccion sumando 1, desde localstorage
            //JSON.parse(lastTransactionId) convierte el string en nro
            localStorage.setItem("lastTransactionId",JSON.stringify(newTransactionId));
            //asignamos el nuevo transactionId - newTransactionId al localstorage, convertido en string
            return newTransactionId; //devolvemos el nuevo Id de la transaccion ultima
    }

    function convertFormaDataToTransactionObject(transactionFormData) {
        let transactionType =  transactionFormData.get("transactionType");
        let transactiondescription =  transactionFormData.get("transactiondescription");
        let transactionCategory =  transactionFormData.get("transactionCategory");
        let transactionAmount =  transactionFormData.get("transactionAmount");
        //agregamos el campo transactionId
        let transactionId = getNewTransactionId();

        return{
            "transactionType" : transactionType, 
            "transactiondescription" : transactiondescription, 
            "transactionCategory" : transactionCategory, 
            "transactionAmount" : transactionAmount,
            //retornamos el campo id para identificar la transaccion
            "transactionId" : transactionId
        };
    }

    function insertRowInTransactionTable(transactionObject){
            let transactionTableRef = document.getElementById("transactionTable");
            
            let newTransactionRowRef = transactionTableRef.insertRow(-1); //inserta una nueva fila enla tabla
            //insertamos un atributo nuevo en la tabla, un atributo personalizado, con settatribute
            newTransactionRowRef.setAttribute("data-Transaction-Id",transactionObject["transactionId"]);
            
            let newTypeCellRef = newTransactionRowRef.insertCell(0);
            newTypeCellRef.textContent = transactionObject["transactionType"];

            newTypeCellRef = newTransactionRowRef.insertCell(1);
            newTypeCellRef.textContent = transactionObject["transactiondescription"];

            newTypeCellRef = newTransactionRowRef.insertCell(2);
            newTypeCellRef.textContent = transactionObject["transactionCategory"];

            newTypeCellRef = newTransactionRowRef.insertCell(3);
            newTypeCellRef.textContent = transactionObject["transactionAmount"];

            let newDeleteCell = newTransactionRowRef.insertCell(4);
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            newDeleteCell.appendChild(deleteButton);

            deleteButton.addEventListener("click", (event) => { 
                //console.log(alert("Hiciste click en Eliminar"))
            // console.log(event.target.parentNode.parentNode.remove());
            let transactionRow = event.target.parentNode.parentNode;
            let transactionId = transactionRow.getAttribute("data-Transaction-Id");
                transactionRow.remove();
                /*console.log(transactionRow);
                console.log(transactionId);
                event.target esto me da el boton
                event.target.parentNode esto me da el padre que es el td
                event.target.parentNode.parentNode esto me da el padre del padre del boton osea la fila
                event.target.parentNode.parentNode.remove esto elimina la fila de la tabla solo en el HTML */
                deleteTransactionObject(transactionId);


            });
    }
    function drawCategories() {
        let allCategories = [
            "Comida",
            "Sueldo",
            "Vestimenta",
            "Venta",
            "trabajo Sublimado",
            "Reparaciones"
            ];
        for (let index = 0; index < allCategories.length; index++) {
            //const element = ;
            insertCategory(allCategories[index]);
        };
        
    }

    function insertCategory(categoryName) {
        const selectElement = document.getElementById("transactionCategory");
        let htmlToInsert = `<option> ${categoryName}</option>`;
        selectElement.insertAdjacentHTML('beforeend', htmlToInsert);

    }
