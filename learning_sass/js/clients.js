const clientsJSON = "../assets/json/clients.json";
const table = document.querySelector( "table" );
const thead = document.querySelector( "table thead" );
const tbody = document.querySelector( "table tbody" );

// filters and their status
const STS_NONE = 0;
const STS_UP = 1;
const STS_DOWN = 2;

let filterStatus = new Array(4).fill(STS_NONE);
const FILTER_NAME = 0;
const FILTER_VISITS = 1;
const FILTER_FIRST_VISIT = 2;
const FILTER_AGE = 3;
//-------------

let clients = []; // the place we save the fetched list of clients
let initialClientsArray = []; // we save here the initial order, so we can revert the table later
initiateTableHeads();
getClients(); // + renderTable(res);

//---------------------------------------------

table.addEventListener( "click", (e) => {
    const classList = e.target.parentElement.classList;
    
    if (classList.contains( "main__clients-table-th")) 
    {
        let filter = e.path[1].cellIndex;
        if (filter < 4) applyFilter( filter );
    }
    else if ( classList.contains( "arrows" ) || classList.contains( "arrows-up" ) || classList.contains( "arrows-down" ) || classList.contains( "arrows-up--on") || classList.contains( "arrows-down--on")) 
    {
        let filter = e.path[3].cellIndex;
        if (filter < 4) applyFilter( filter );
    }
})

function applyFilter( filter ) {
    // must clean all filters first (icons, array)
    initiateTableHeads();
    for (let i = 0; i < filterStatus.length; i++) if (i != filter) filterStatus[i] = STS_NONE;
    // ---

    switch (filter) {
        case FILTER_NAME: {
            updateFilterStatus( filter, "name" );
        } break;

        case FILTER_VISITS: {
            updateFilterStatus( filter, "visits" );
        } break;

        case FILTER_FIRST_VISIT: {
            updateFilterStatus( filter, "firstVisit" );
        } break;

        case FILTER_AGE: {
            updateFilterStatus( filter, "age" );
        } break;
    }

    renderTable( clients );
}

function updateFilterStatus( filter, property ) {
    const sts = filterStatus[filter];

    const arrUP = document.querySelector( `#arrows-${filter} i:first-child` );
    const arrDOWN = document.querySelector( `#arrows-${filter} i:last-child` );
    switch (sts) {
        case STS_NONE: {
            arrUP.classList.add("arrows-up--on");
            filterStatus[filter] = STS_UP;
            clients.sort((a, b) => {
                if ( typeof a[property] == "string")
                    return a[property].localeCompare(b[property]);
                else
                    return a[property] - b[property];
            });
        } break;

        case STS_UP: {
            arrDOWN.classList.add("arrows-down--on");
            filterStatus[filter] = STS_DOWN;
            clients.reverse(); // the flow is STS_NONE -> STS_UP -> STS_DOWN, so in this moment we have them in ASCENDENT order, so we can reverse.
        } break;
        
        case STS_DOWN: {
            filterStatus[filter] = STS_NONE;
            clients = initialClientsArray;
        } break;
    }
}

function renderTable( arr ) {
    let newBody = "";
    arr.forEach( (client, id) => {
        newBody += `<tr>
                    <td>${client.name}</td>
                    <td>${client.visits}</td>
                    <td>${client.firstVisit}</td>
                    <td>${client.age}</td>
                    <td><a href="#" id="view-${id}">View profile</a></td>
                </tr>`;
    });
    tbody.innerHTML = newBody;
}

function initiateTableHeads() {
    thead.innerHTML = `
            <tr>
            <th class="main__clients-table-th">
                <div>
                    CLIENT NAME
                    <span id="arrows-0" class="arrows">
                        <i class="arrows-up"></i>
                        <i class="arrows-down"></i>
                    </span>
                </div>
            </th>
            <th class="main__clients-table-th">
                <div>
                    VISITS
                    <span id="arrows-1" class="arrows">
                        <i class="arrows-up"></i>
                        <i class="arrows-down"></i>
                    </span>
                </div>
            </th>
            <th class="main__clients-table-th">
                <div>
                    FIRST VISIT
                    <span id="arrows-2" class="arrows">
                        <i class="arrows-up"></i>
                        <i class="arrows-down"></i>
                    </span>
                </div>
            </th>
            <th class="main__clients-table-th">
                <div>
                    AGE
                    <span id="arrows-3" class="arrows">
                        <i class="arrows-up"></i>
                        <i class="arrows-down"></i>
                    </span>
                </div>
            </th>
            <th></th>
        </tr>
    `;
}

async function getClients() {
    const data = await fetch(clientsJSON);
    const res = await data.json();

    res.forEach( item => { clients.push(item); initialClientsArray.push(item); });
    renderTable( res );
}