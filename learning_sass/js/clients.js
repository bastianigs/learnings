const clientsJSON = "../assets/json/clients.json";
const table = document.querySelector( "table" );
const thead = document.querySelector( "table thead" );
const tbody = document.querySelector( "table tbody" );
const filterElem = document.getElementById( "filter" );
const searchElem = document.getElementById( "search" );
const searchBtnElem = document.getElementById( "searchBtn" );

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
let initialFilteredClientsArray = []; // as above, except that we use this when the SEARCH features is used
let filteredContent = false; // gonna use it when restoring a filtered list, after SEARCH was used

let parentClassList, classList, filter, val;

//-------------
/* load list */

resetTableHeads();
getClients(); // + renderTable(res);

//---------------------------------------------

table.addEventListener( "click", (e) => {
    parentClassList = e.target.parentElement.classList;
    classList = e.target.classList;
    
    if (classList.contains( "main_clients-table-th")) 
    {
        console.log(e);
    }
    else if (parentClassList.contains( "main__clients-table-th")) 
    {
        filter = e.path[1].cellIndex;
        if (filter < 4) applyFilter( filter );
    }
    else if ( parentClassList.contains( "arrows" ) || parentClassList.contains( "arrows-up" ) || parentClassList.contains( "arrows-down" ) || parentClassList.contains( "arrows-up--on") || parentClassList.contains( "arrows-down--on")) 
    {
        filter = e.path[3].cellIndex;
        if (filter < 4) applyFilter( filter );
    }
})

filterElem.addEventListener( "change", (e) => {
    val = filterElem.value;
    if (val != "none") {
        var order = val[val.length-1]; // we save the order way (1/2) and remove it from the string
        val = val.slice(0,-1);
    }

    switch (val) {
        case "none": {
            // doesn't matter which filter I choose; imrpotant is to get all filters off - by bringing anyone to STS_NONE
            applyFilter( FILTER_NAME, STS_NONE ); 
        } break;

        default: {
            applyFilter( getFilterIDFromName(val), parseInt(order) );
        } break;
    }
});

searchElem.addEventListener( "keydown", (e) => {
    if (e.key === "Enter") {
        search( searchElem.value );
    }
});

searchBtnElem.addEventListener( "click", (e) => {
    search( searchElem.value );
});

//---------------------------------------------
/* search */

function search( str ) {
    if (str) {
        str = str.toLowerCase();

        let res = [];
        let name, visits, firstVisit, age;
        initialClientsArray.forEach( (item, idx) => {
            name = item.name.toLowerCase();
            visits = item.visits.toString();
            firstVisit = item.firstVisit.toString();
            age = item.age.toString();

            if (name.search(str) != -1 || visits.search(str) != -1 || firstVisit.search(str) != -1 || age.search(str) != -1) 
                return res.push(item);
        });

        // rewritting the clients, so we can filter the new list of clients
        clients = res;
        if (clients.length) {
            // saving this new list order so we can use it when back to no filters
            clients.forEach( item => initialFilteredClientsArray.push(item));
        } else {
            initialFilteredClientsArray = [];
        }

        filteredContent = true;
    } else if (!str && filteredContent == true) {
        // if the search input was emptied, after it was used before, we can restore everything like it used to be
        clients = [];
        initialClientsArray.forEach( item => clients.push(item) );
        filteredContent = false;
    }

    filterElem.value = "none";
    resetTableHeads(); // we must clean the used arrows (filters)
    renderTable( clients );
}

//---------------------------------------------
/* filters */

function applyFilter( filter, newStatus = null ) {
    // must clean all filters first (icons, array)
    resetTableHeads();
    for (let i = 0; i < filterStatus.length; i++) if (i != filter) filterStatus[i] = STS_NONE;
    // ---

    if (newStatus == null) updateFilterStatus( filter );
    else setFilterStatus( filter, newStatus )

    renderTable( clients );
}

function setFilterStatus( filter, newStatus ) {
    const arrUP = document.querySelector( `#arrows-${filter} i:first-child` );
    const arrDOWN = document.querySelector( `#arrows-${filter} i:last-child` );
    const property = getFilterNameFromID( filter );

    switch (newStatus) {
        case STS_UP: {
            arrUP.classList.add("arrows-up--on");
            filterStatus[filter] = STS_UP;
            clients.sort((a, b) => {
                if (property == "firstVisit") {
                    const itemDateA = new Date(a.firstVisit.split('/').reverse());
                    const itemDateB = new Date(b.firstVisit.split('/').reverse());
                    return new Date(itemDateA) - new Date(itemDateB);
                } else {
                    if ( typeof a[property] == "string")
                        return a[property].localeCompare(b[property]);
                    else
                        return a[property] - b[property];
                }
            });
        } break;

        case STS_DOWN: {
            arrDOWN.classList.add("arrows-down--on");
            if (filterStatus[filter] != STS_UP) setFilterStatus( filter, STS_UP ); // we make sure it's ASC, before doing .reverse()
            filterStatus[filter] = STS_DOWN;
            clients.reverse();
        } break;
        
        case STS_NONE: {
            filterStatus[filter] = STS_NONE;
            clients = [];
            if (filteredContent) initialFilteredClientsArray.forEach( item => clients.push( item ) );
            else initialClientsArray.forEach( item => clients.push( item ) );
        } break;
    }
}

function updateFilterStatus( filter ) {
    nextStatus = filterStatus[filter]+1;
    if (nextStatus > STS_DOWN) nextStatus = STS_NONE;
    setFilterStatus( filter, nextStatus );
}

//---------------------------------------------
/* table */

function renderTable( arr ) {
    let newBody = "";
    arr.forEach( (client, id) => {
        newBody += `<tr>
                    <td data-label="CLIENT NAME">${client.name}</td>
                    <td data-label="VISITS">${client.visits}</td>
                    <td data-label="FIRST VISIT">${client.firstVisit}</td>
                    <td data-label="AGE">${client.age}</td>
                    <td><a href="#" id="view-${id}">View profile</a></td>
                </tr>`;
    });
    tbody.innerHTML = newBody;
}

function resetTableHeads() {
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

//---------------------------------------------
/* utils */

function getFilterIDFromName( name ) {
    let id;
    switch (name) {
        case "name": { id = FILTER_NAME; } break;
        case "visits": { id = FILTER_VISITS; } break;
        case "firstVisit": { id = FILTER_FIRST_VISIT; } break;
        case "age": { id = FILTER_AGE; } break;
    }
    return id;
}

function getFilterNameFromID( id ) {
    let propName;
    switch (id) {
        case FILTER_NAME: { propName = "name"; } break;
        case FILTER_VISITS: { propName = "visits"; } break;
        case FILTER_FIRST_VISIT: { propName = "firstVisit"; } break;
        case FILTER_AGE: { propName = "age"; } break;
    }
    return propName;
}