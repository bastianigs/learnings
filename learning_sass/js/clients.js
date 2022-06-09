const clientsJSON = "../assets/json/clients.json";
const table = document.querySelector( "table" );

renderTable();

async function renderTable() {
    const data = await fetch(clientsJSON);
    const res = await data.json();

    // console.log( res );

    res.forEach( (client, id) => {
        const newRow = document.createElement( "tr" );
        newRow.innerHTML = `
                                <td>${client.name}</td>
                                <td>${client.visits}</td>
                                <td>${client.firstVisit}</td>
                                <td>${client.age}</td>
                                <td><a href="#" id="view-${id}">View profile</a></td>
                            `;
        table.appendChild(newRow);
    });
}