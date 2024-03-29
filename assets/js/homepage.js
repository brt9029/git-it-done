let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");
let languageButtonsEl = document.querySelector("#language-buttons")

function getUserRepos(user) {
    // format the github api url
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response){
        // request was successful
        if(response.ok){
            response.json().then(function(data){
             displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error){
        // Notice this `.catch()` is being chanied to the end of the `.then()` by excluding the ;
        alert("Unable to connect to GitHub");
    });
};

function formSubmitHandler(event) {
    event.preventDefault();
    // get value from input element
    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

function displayRepos(repos, searchTerm){
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // loop over repos
    for(let i = 0; i < repos.length; i++) {
        // format repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create a span element to hold repository name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // append to container
        repoEl.appendChild(statusEl);

        // check if current repo has issues or not
        if(repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + "issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

function getFeaturedRepos(language) {
    let apiURL = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues"

    fetch(apiURL).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    });
};

function buttonClickHandler(event) {
    let language = event.target.getAttribute("data-language");
    
    if(language) {
        getFeaturedRepos(language);
    }
    
    // clear old content
    repoContainerEl.textContent = "";
};


userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);