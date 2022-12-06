document.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('github-form').addEventListener('submit', (e) => {});

    onsubmit = ((e) => {
        e.preventDefault();
        const searchBox = document.getElementById('search');
        emptyList(document.getElementById('user-list'));
        emptyList(document.getElementById('repos-list'));
        fetch(`https://api.github.com/search/users?q=${searchBox.value}`, {
            header: {
                Accept: 'application/vnd.github.v3+json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            for (const user of data.items) {
                const userList = document.getElementById('user-list');
                const userItem = createUserItem(user);
                repoRedirect(userItem);
                userList.append(userItem);
            }
        })
    })
})


//Empties a list
function emptyList(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }
}

//Creates the user li and elements within the li
function createUserItem(user) {
    const name = document.createElement('h3');
    const repo = document.createElement('h4');
    const image = document.createElement('img');
    const item = document.createElement('li');
    name.innerText = user.login;
    name.className = 'user-login';
    repo.innerText = user.repos_url;
    repo.style.color = 'blue';
    repo.className = 'repo-link';
    image.src = user.avatar_url;
    item.append(image, name, repo);
    return item;
}

//Given a list item, creates an event listener that shows the user's repos
//once clicked on
function repoRedirect(itemNode) {
    const link = itemNode.querySelector('.repo-link');
    link.addEventListener('click', (e) => {
        const itemClone = itemNode.cloneNode(true);
        fetch(`https://api.github.com/users/${itemNode.querySelector('.user-login').innerText}/repos`, {
            header: {
                Accept: 'application/vnd.github.v3+json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            const userList = document.getElementById('user-list');
            emptyList(userList);                
            for (const repo of data) {
                const p = document.createElement('p');
                p.innerText = repo.name;
                document.getElementById('repos-list').append(p);
            }
            itemClone.querySelector('.repo-link').hidden = true;
            itemClone.querySelector('.user-login').innerText += `\'s repos`;
            userList.append(itemClone);
        });
    })
}