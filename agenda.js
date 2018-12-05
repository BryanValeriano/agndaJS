(function () {
    console.log("start app...");
   
   //ui
    var ui = {
        fields: document.querySelectorAll("input"),
        button: document.querySelector(".pure-button"),
        table: document.querySelector(".pure-table tbody")
    };
    console.log(ui);    
    
    //actions
    var cleanFields = function() {
        ui.fields.forEach(function(field) {
            field.value = ""; 
        });

    }
    
    var populateTable = function(contacts) {
        //console.table(contacts);
        var html = [];
        contacts.forEach(function(contact) {
            //console.log(contact.nome, contact.email);
            var line = `          
                <tr>
                    <td>${contact.id}</td>
                    <td>${contact.nome}</td>
                    <td>${contact.email}</td>
                    <td>${contact.telefone}</td>  
                    <td> <a href="#" data-id="${contact.id}" data-action="delete">Excluir</a></td>
                </tr>
                `;
                html.push(line);
        });

        //console.log(html.join("")); 
        ui.table.innerHTML = html.join("");
        cleanFields();
    }

    var genericError = function() {debugger;};

    var validateFields = function(e) {
        e.preventDefault();
        var errors = 0, 
            data = {};
        ui.fields.forEach(function(field) {
            console.log(field.value, field.value.length);
            if(field.value.trim().length === 0) {
                errors += 1;
                field.classList.add("error");
            } else {
                field.classList.remove("error");
                data[field.id] = field.value.trim();
            }

       });
       if(errors === 0) {
            addContact(data);
       } else {
           document.querySelector(".error").focus();
       }
    };

    var addContact = function(data) {
        console.log(data);
        var endpoint = "http://localhost:8000/agenda";
        var config = {
            method:"POST",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-type":"application/json"
            })
        };
        fetch(endpoint, config)
            .then(getContacts)
            .catch(genericError);
    };

    var getContacts = function() {
        var endpoint = "http://localhost:8000/agenda";
        var config = {
            method:"GET",
            headers: new Headers({
                "Content-type":"application/json"
            })
        };
        fetch(endpoint, config)
            .then(function(Resp){return Resp.json() })
            .then(function (contacts){populateTable(contacts);})
            .catch(genericError);
    };

    var removeContact = function(e) {
        var item = (e.target.dataset);
        e.preventDefault();
        if(item.action === "delete" && confirm("Tem certeza que deseja excluir este item?")) {
            console.log("Excluir item", item.id);
            var endpoint = `http://localhost:8000/agenda/${item.id}`;
            var config = {
                method:"DELETE",
                headers: new Headers({
                    "Content-type":"application/json"
                })
            };
            fetch(endpoint, config)
                .then(getContacts)
                .catch(genericError);
        }
    };

    var init = function() {
        //binding events
        ui.button.onclick = validateFields;
        ui.table.onclick = removeContact;
        getContacts();  
        //debugger;       
    }();


})();   
