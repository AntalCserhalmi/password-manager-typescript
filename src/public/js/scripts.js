let encryptedValues = [];

async function postData(text){
    const reponse = await fetch("/dash/decrypt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({text: text})
    });

    return reponse.json();
}


function handlePassword(id){
    let element = $(`#${id} span`);


    if (element.data("status") === 0){
        postData(element.text()).then(function(data){
            encryptedValues[id] = element.text();
            element.html(data.text);
            element.data("status", 1)
        });

        return;
    }

    element.html(encryptedValues[id]);
    element.data("status", 0);
}

$(document).ready(function(){
    $("#add").on("click", function(){
        $("#siteIdHidden").val($("#siteId").val());
        $("#siteHidden").val($("#site").val());
        $("#usernameHidden").val($("#username").val());
        $("#passwordHidden").val($("#password").val());
        toggleModal("popup-modal", true);

    });

    $("#formSubmit").on("click", async function(){
        let siteValue = $("#site").val();
        let usernameValue = $("#username").val();
        let passwordValue = $("#password").val();
        let data = $("#formSubmit").data("method");

        if (siteValue === ""){
            alert("Site cannot be empty");
            return;
        }

        if (usernameValue === ""){
            alert("Username cannot be empty");
            return;
        }

        if (passwordValue === ""){
            alert("Password cannot be empty");
            return;
        }

        if (data === "add"){ 
            fetch("/dash/add", {
                method: "POST",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({site: siteValue, username: usernameValue, password: passwordValue})
            }).then(function(response){
                if (response.redirected){
                    window.location.href = response.url;
                }
            }).catch(function(err){
                console.log(err);
                window.location.reload();
            });
        }else if (data === "edit"){
            fetch(`/dash/edit/${$("#siteIdHidden").val()}`,{
                    method: "PUT",
                    redirect: "follow",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({site: siteValue, username: usernameValue, password: passwordValue})
                }).then(function(response){
                    if (response.redirected){
                        window.location.href = response.url;
                    }
                }).catch(function(err){
                    console.log(err);
                    window.location.reload();
                });
        }else if (data === "delete"){
            fetch(`/dash/delete/${$("#siteIdDashHidden").val()}`,{
                method: "DELETE",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }).then(function(response){
                if(response.redirected){
                    window.location.href = response.url;
                }
            }).catch(function(err){
                console.log(err);
                window.location.reload();
            });
        }


       

    });

    $(".editBtn").on("click", function(){
        window.location.href = `/dash/edit/${$(this).attr("id")}`
    });

    $(".deleteBtn").on("click", function(){
        let targetId = $(this).attr("id");
        $("#siteIdDashHidden").val(targetId);
        toggleModal("popup-modal", true);
    });
});


// toggleModal('modal');

// toggleModal('modal', false);

// toggleModal('modal', true);