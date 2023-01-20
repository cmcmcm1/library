const uri = "api/Authors";
let authors = [];

function getAuthors() {
    fetch(uri)
        .then(response => response.json())
        .then(data => displayAuthors(data))
        .catch(error => console.log('unable to get authors.', error));
}

function addAuthor() {
    const addName = document.getElementById('add-name');
    const addDesc = document.getElementById('add-desc');
    const author = {
        name: addName.value.trim(),
        description: addDesc.value.trim(),
    };
    console.log(author);
    console.log(JSON.stringify({
        name: addName.value.trim(),
        description: addDesc.value.trim(),
    }));
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(author)
    })
        .then(response => response.json())
        .then(() => {
            getAuthors();
            addName.value = "";
            addDesc.value = "";
        })
        .catch(error => console.log('unable to add author.', error));
}

function deleteAuthor(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getAuthors())
        .catch(error => console.log('unable to delete author.', error));
}

function displayEditForm(id) {
    const author = authors.find(author => author.id === id);
    document.getElementById('edit-id').value = author.id;
    document.getElementById('edit-name').value = author.name;
    document.getElementById('edit-desc').value = author.description;
    document.getElementById('editForm').style.display = 'block';
}

function updateAuthor() {
    const authorId = document.getElementById('edit-id').value;
    const author = {
        id: parseInt(authorId, 10),
        name: document.getElementById('edit-name').value.trim(),
        desc: document.getElementById('edit-desc').value.trim()
    };
    fetch(`${uri}/${authorId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(author)
    })
        .then(() => getAuthors())
        .catch(error => console.error('Unable to update author.', error));
    closeInput();
    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function displayAuthors(data) {
    const tBody = document.getElementById('authors');
    tBody.innerHTML = "";
    const button = document.createElement("button");

    data.forEach(author => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${author.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteAuthor(${author.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode = document.createTextNode(author.name);
        td1.appendChild(textNode);

        let td2 = tr.insertCell(1);
        let textNodeInfo = document.createTextNode(author.description);
        td2.appendChild(textNodeInfo);
        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);
        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);

    });

    authors = data;
    console.log(authors);
}