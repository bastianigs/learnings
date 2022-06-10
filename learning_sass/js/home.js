const userName = document.querySelector( ".header__name span" );

/* cards data */
const cardElem = [];
for (let i = 0; i < 2; i++) {
    cardElem.push({
        Key: document.querySelectorAll( ".main__card-key" )[i],
        Value: document.querySelectorAll( ".main__card-value" )[i],
        Icon: document.querySelectorAll( ".main__card-img" )[i]
    })
}

/* next customer */
const clientElem = {
    appTime: document.querySelector( ".main__next-header span" ),
    Name: document.querySelector( ".main__next-client-name" ),
    Visits: document.querySelector( ".main__next-client-visits span" ),
    Tel: document.querySelector( ".main__next-client-tel" ),
    Package: document.querySelector( ".main__next-services p:first-child" ),
    Services: document.querySelector( ".main__next-services ul" ),
    payCheck: { 
            div: document.querySelector( ".main__next-services-paid" ),
            iconDiv: document.querySelector( ".main__next-services-paid div" ),
            icon: document.querySelector( ".main__next-services-paid div img")
    }
}

/* appointments */
const nextAppsJSON = "../assets/json/appointments.json";
const list = document.querySelector( ".main__appointments ul" );

//---------------------------------------------------------------------------------

loadData();

function loadData() {
    userName.innerText = "Sebastian";

    cardElem[0].Key.innerText = "Total clients";
    cardElem[0].Value.innerText = 350;
    cardElem[0].Icon.src = "./assets/icons/user.svg";

    cardElem[1].Key.innerText = "Income in online payments";
    cardElem[1].Value.innerText = "304.303$";
    cardElem[1].Icon.src = "./assets/icons/briefcase.svg";

    renderNextClient();
    renderAppointments();
}

function renderNextClient() {
    const services = [ "Service option 1", "Service option 2" ];

    clientElem.appTime.innerText = "Today, 17:00";
    clientElem.Name.innerText = "Jessica Jones";
    clientElem.Visits.innerText = 10;
    clientElem.Tel.innerText = "+0056 069 123";
    clientElem.Package.innerText = "SuperBoost Behandeling";
    
    // dealing with the list
    let servicesList = "";
    services.forEach( optionName => {
        servicesList += `<li>${optionName}</li>`
    })
    clientElem.Services.innerHTML = servicesList;

    // did the client pay?
    const paid = true;
    if (!paid) {
        clientElem.payCheck.div.classList.add( "main__next-services-paid--not" );
        clientElem.payCheck.iconDiv.style.backgroundColor = "#ff0000";
        clientElem.payCheck.icon.src = "../assets/icons/slash.svg";
    }
}

async function renderAppointments() {
    const data = await fetch(nextAppsJSON);
    const res = await data.json();

    // console.log( res );

    res.forEach( (client, id) => {
        const newItem = document.createElement( "li" );
        newItem.innerHTML = `
                            <div class="main__appointments-data">
                                <p>${client.name}, ${client.age}</p>
                                <p>${client.service}</p>
                            </div>
                            <a href="#" id="viewAppointment-${id}">View</a>
                            `;

        list.appendChild(newItem);
        list.appendChild( document.createElement( "hr" ) );
    });
}