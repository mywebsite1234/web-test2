//document.getElementById('gamesnav').classList.add('selected');
const isLikedPage = window.location.pathname.includes('/classes/liked/');
const isRecentPage = window.location.pathname.includes('/classes/recent/');

let token = false;

const isLocalhost = [
    'localhost'
  ].includes(window.location.hostname);

// window.addEventListener('load', async() => {
// let response = await fetcher(`/auth/check`);

// if (response.status == 401 || response.status == 403) {
// token = false;
// } else {
// // display points count in navbar
// token = await response.json();
// setPointsDisplay(token.points || 0, token.username || "");
// }
// });

// Load Games
const gamesDiv = document.getElementById('games');
const maxGames = 500;

let selectedTopic = 'all';
let displayedGames = 0;
let games = null;
let sorted;
let hasLoaded = false;
let customcategory = false;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let category = urlParams.get('category');
let search = urlParams.get('search');

if (category == null && window.category && window.category != "{{classesName}}") {
    category = window.category;

    search = category == "search";
    if (search)
    {
        category = null;
    }

    console.log("search " + search + " cat " + category);
}

let categories = [
    'multiplayer',
    'car',
    'casual',
    'action',
    'shooting',
    'puzzle',
    'classic',
    'sport',
    'clicker',
    'escape',
    '2',
    'scary',
    'hard',
    'music',
    'flash',
];

let catTitle = null;

if (search != null) {
    const input = document.getElementById('searchBar');
    input.focus();
    input.select();
}

if (category != null) {
    selectedTopic = category;

    document.getElementById('topText').style.display = '';
    //if (categories[categories.indexOf(category)] > -1) {
    //    document.getElementById('topText').innerText = `${categories[categories.indexOf(category)].toUpperCase()} Games`;
    //} else {
    //    document.getElementById('topText').innerText = `${category.toUpperCase()} Games`;
    //}
    document.getElementById('searchcat').style.display = 'none';

    customcategory = true;
}

let sortObject = (obj) =>
    Object.keys(obj)
        .sort()
        .reduce((res, key) => ((res[key] = obj[key]), res), {});

let sortByName = (array) =>
    array.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

let findByName = (array, name) => {
    return array.find(element => element.name === name);
};

//document.addEventListener('DOMContentLoaded', () => {
// fetcher('/games')
// .then((response) => response.json())
// .then((retrievedGames) => {
// games = retrievedGames;

// loadCookies();
// });
//});

findLazyImages();

document.addEventListener('DOMContentLoaded', async () => {

    if (category != null) {
    try {
        const res = await fetch('/assets/category.json');
        const categoriesList = await res.json();

        const descContainer = document.getElementById('pageDescription');
        // adjust `.name` below if your JSON uses a different key for the category identifier
        const categoryData = categoriesList.find(cat =>
            cat.name?.trim().toLowerCase() === category.trim().toLowerCase()
            );

            //console.warn("categoryData " + categoryData + " cat " + category);

        if (categoryData != null)
        {
            if (isLocalhost)
            {
                 if (categoryData.description) {

                    if (categoryData.description.endsWith(".html"))
                    {
                        const htmlRes = await fetch("/assets/categories/" + categoryData.description);
                        const htmlString = await htmlRes.text();
                        descContainer.innerHTML = `
                                ${htmlString}
                            `;
                    }
                    else
                    {
                        // if your descriptions contain HTML, use innerHTML; otherwise textContent is safer
                        descContainer.innerHTML = `
                                ${categoryData.description}
                            `;
                    }

                } else {
                descContainer.textContent = '' + category;
                }
            }
            
            catTitle = categoryData.title;

            if (catTitle != null)
            {
                document.getElementById('topText').innerText = `${catTitle}`;
            }
        }

    } catch (error) {
        console.error('Error fetching categories:', error);
    }
    }
    

    try 
    {
        let gamesSource = '/assets/ts_games_small.json';
        if (isLocalhost)
        {
            gamesSource = '/assets/ts_games.json';
        }

        let retrievedGamesRes = await fetch(gamesSource);
        games = await retrievedGamesRes.json();

        if (games.length > 0 && games[0].name == "TemplateGameName")
        {
            games.shift(); // skip first element because it's template
        }
        

        loadCookies();
    } catch (error) {
        console.error('Error fetching games:', error);
    }
});

async function loadCookies() {
    //when done
    loadTopic();
}

async function loadTopic() {
    if (games == null) {
        return;
    }

    displayedGames = 0;

    document.getElementById('noSearch').style.display = 'none';

    //sorted = sortObject(games);
    //sorted = sortByName(games); // old sort method, by name
    sorted = games; // don't sort in this list, unless u have a good sort rank

    if (catTitle != null)
    {
        if (localStorage.getItem('disguise') == null || localStorage.getItem('disguise') == 'none')
        {
            document.getElementsByTagName(
                    'title'
                )[0].innerHTML = `${catTitle} - FreezeNova.Cloud`;
        }
    }

    if (isLikedPage) {
        // Special handling for liked games page
        await displayLikedGames();
        return;
    }

    if (isRecentPage) {
        // Special handling for liked games page
        await displayRecentGames();
        return;
    }

    if (selectedTopic != 'all') {
        if (customcategory) {
            //solves the problem of doing the category parameter on url
            if (catTitle == null)
            {
                document.getElementsByTagName(
                    'title'
                )[0].innerHTML = `${category.toUpperCase()} on FreezeNova.Cloud`;
            }

            if (isLocalhost)
            {
                await displayGames();
            }
           
        }

        const filteredGameCon = document.getElementById('filteredGames');

        const gameButtons = filteredGameCon.querySelectorAll('.all');

        //console.log("selectedTopic: " + selectedTopic);

        Array.from(gameButtons).forEach((game) => {
            if (game.classList.contains(selectedTopic)) {
                //let g = games[game.getAttribute('name')];
                let g = findByName(games, game.getAttribute('name'));
                //console.log("game " + game.getAttribute('name') + " --- " + g);
                if (g && g.image && g.image != 'undefined') {
                    game.setAttribute('style', `background-image: url(${g.image})`);
                }
            } else {
                game.setAttribute('style', 'display:none');
            }
        });
    } else {
        gamesDiv.innerHTML = '';

        if (isLocalhost)
        {
            displayGames();
        }
        

        const filteredGameCon = document.getElementById('filteredGames');
        const gameButtons = filteredGameCon.querySelectorAll('.all');
        //console.log("selectedTopic: " + selectedTopic);

        Array.from(gameButtons).forEach((game) => {
            //let g = games[game.getAttribute('name')];
            let g = findByName(games, game.getAttribute('name'));
            //console.log("game " + game.getAttribute('name') + " --- " + g);
            if (g && g.image && g.image != 'undefined') {
                game.setAttribute('style', `background-image: url(${g.image})`);
            }
        });
    }
}

async function displayRecentGames() {
    const recentGamesContainer = document.getElementById('filteredGames');
    recentGamesContainer.innerHTML = ''; // Clear existing content

    // Hide elements not needed on recent games page
    document.getElementById('searchcat').style.display = 'none';
    document.getElementById('topText').style.display = 'block';

    // Get recently played games from localStorage
    const recentGames = JSON.parse(localStorage.getItem('playedGames') || '{}');

    if (!recentGames || Object.keys(recentGames).length === 0) {
        recentGamesContainer.innerHTML = '<p style="color: white;">You have not played any games.</p>';
        return;
    }

    // Convert object keys to an array and reverse it to display latest played games first
    const recentGameNames = Object.keys(recentGames).reverse();

    // Create game buttons for each recent game and append them directly
    for (const gameName of recentGameNames) {
        if (recentGames[gameName]) {
            const gameIndex = games.findIndex(game => game.name === gameName);
            if (gameIndex !== -1) {
                recentGamesContainer.innerHTML += createGameButton(gameIndex, '', true);
            }
        }
    }

    // Initialize lazy loading for images
    findLazyImages();
}

function loadLikedGames() {
  const raw = localStorage.getItem('likedGames');
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && typeof parsed === 'object') {
      return Object.keys(parsed);
    }
  } catch (e) {
    // ignore
  }
  return [];
}

async function displayLikedGames() {
  const likedGamesContainer = document.getElementById('filteredGames');
  likedGamesContainer.innerHTML = '';                        // Clear existing
  document.getElementById('searchcat').style.display = 'none';
  document.getElementById('topText').style.display    = 'block';

  // loadLikedGames() now returns an array of game names
  const likedGames = loadLikedGames();

  // no likes?
  if (!Array.isArray(likedGames) || likedGames.length === 0) {
    likedGamesContainer.innerHTML = '<p style="color: white;">You have not liked any games.</p>';
    return;
  }

  // for each liked game name, find its index in `games` and render
  for (const gameName of likedGames) {
    const idx = games.findIndex(g => g.name === gameName);
    if (idx !== -1) {
      likedGamesContainer.innerHTML += createGameButton(idx, '', true);
    }
  }

  // re-init lazy-loading on the newly inserted images
  findLazyImages();
}

async function displayGames() {
    //First check if there are any new games... if so, put them in the new games category

    let arrowContainer =
        '<div class="arrowsCon"><div class="arrowCon arrowLeftCon" id="arrowLeft" style="visibility: hidden;"><img class="arrow" src="/assets/images/icons/arrow-left.svg"></div><div class="arrowCon arrowRightCon" id="arrowRight" ><img class="arrow" src="/assets/images/icons/arrow-right.svg"></div></div>';

    //Then for each category (except mobile and a few others), make the category container then add games

    for (let i = 0; i < categories.length; i++) {
        gamesDiv.innerHTML += ` <div class="titleContainer">
                   <h1 class="game-title">${capitalizeFirstLetter(categories[i])} Games <a href="/classes/${categories[i]}/">View More</a></h1>

                    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" class="double-arrow left-arrow">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M3.25757 2.33007C3.62757 1.92005 4.2599 1.88759 4.66993 2.25759L12.9814 9.75759C14.3395 10.9831 14.3395 13.0169 12.9814 14.2424L4.66993 21.7424C4.2599 22.1124 3.62757 22.08 3.25757 21.6699C2.88758 21.2599 2.92003 20.6276 3.33006 20.2576L11.6415 12.7576C12.1195 12.3263 12.1195 11.6737 11.6415 11.2424L3.33006 3.74243C2.92003 3.37243 2.88758 2.7401 3.25757 2.33007Z">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M11.2576 2.33007C11.6276 1.92005 12.2599 1.88759 12.6699 2.25759L20.9814 9.75759C22.3395 10.9831 22.3395 13.0169 20.9814 14.2424L12.6699 21.7424C12.2599 22.1124 11.6276 22.08 11.2576 21.6699C10.8876 21.2599 10.92 20.6276 11.3301 20.2576L19.6415 12.7576C20.1195 12.3263 20.1195 11.6737 19.6415 11.2424L11.3301 3.74243C10.92 3.37243 10.8876 2.7401 11.2576 2.33007Z">
                        </path>
                    </svg>
                </div>

`;

        let row = document.createElement('div');
        row.classList.add('horizontalCon');
        let gamesContainer = document.createElement('ul');
        gamesContainer.classList.add('gamesCon');
        gamesContainer.id = `${categories[i]}GamesCon`;
        //add the arrows to the horizontal Con
        row.innerHTML += arrowContainer;

        row.appendChild(gamesContainer);
        gamesDiv.appendChild(row);
    }

    let newGames = [];
    let miscGames = [];

    const filteredGameCon = document.getElementById('filteredGames');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7 * 3);

    const sortedKeys = Object.keys(sorted);
    const categoriesLength = categories.length;

    let htmlString = '';
    let categoryHtmlStrings = {};

    for (const key of sortedKeys) {
        const data = sorted[key];
        //const gameDate = new Date(data.date_added);

        //if (gameDate > weekAgo) {
        //    newGames.push(key);
        //}

        htmlString += createGameButton(key, 'filtered');

        let hasCategory = false;
        for (let i = 0; i < categoriesLength; i++) {
            const tagsList = data.tags.replace(/,/g, ' ');
            if (tagsList.includes(categories[i])) {
                hasCategory = true;
                const catElements = document.getElementById(`${categories[i]}GamesCon`);
                if (catElements && catElements.childElementCount < 20) {
                    if (!categoryHtmlStrings[categories[i]]) {
                        categoryHtmlStrings[categories[i]] = '';
                    }
                    categoryHtmlStrings[categories[i]] += createGameButton(key);
                }
            }
        }
        if (!hasCategory) {
            miscGames.push(key);
        }
    }

    filteredGameCon.innerHTML = htmlString;

    if (miscGames.length > 0) {
        gamesDiv.innerHTML += `<h1 class="game-title">Random Games <a href="/classes/random/">View More</a></h1>`;

        const row = document.createElement('div');
        row.classList.add('horizontalCon');
        const gamesContainer = document.createElement('ul');
        gamesContainer.classList.add('gamesCon');

        let miscHtmlString = '';
        for (const game of miscGames) {
            miscHtmlString += createGameButton(game);
        }
        gamesContainer.innerHTML = miscHtmlString;
        row.appendChild(gamesContainer);
        gamesDiv.appendChild(row);
    }

    // Add category buttons to their respective containers
    for (const category in categoryHtmlStrings) {
        const catElements = document.getElementById(`${category}GamesCon`);
        if (catElements) {
            catElements.innerHTML += categoryHtmlStrings[category];
        }
    }

    //recent games

    //for each popular game, add the game to the horizontalCon
    if (token) {
        let recentRow = document.createElement('div');
        recentRow.classList.add('horizontalCon');
        let recentGamesContainer = document.createElement('ul');
        recentGamesContainer.classList.add('gamesCon');
        //add the arrows to the horizontal Con
        recentRow.innerHTML += arrowContainer;

        let length = 0;

        let userLikedRes = await fetcher(`/profile/liked/get`);
        let likedgames = await userLikedRes.json();

        length = likedgames.length;
        if (likedgames.length > 0) {
            for (like in likedgames) {
                if (document.getElementsByName(likedgames[like]).length > 0) {
                    recentGamesContainer.innerHTML += createGameButton(likedgames[like]);
                }
            }
        }

        if (length > 0) {
            recentRow.appendChild(recentGamesContainer);
            gamesDiv.prepend(recentRow);
            gamesDiv.innerHTML = `<h1 class="game-title"></h1>` + gamesDiv.innerHTML;
        }
    } else {
        let recentRow = document.createElement('div');
        recentRow.classList.add('horizontalCon');
        let recentGamesContainer = document.createElement('ul');
        recentGamesContainer.classList.add('gamesCon');
        //add the arrows to the horizontal Con
        recentRow.innerHTML += arrowContainer;

        likedgames = JSON.parse(localStorage.getItem('likedGames') || '{}');
        let length = Object.keys(likedgames).length;

        if (length > 0) {
            for (like in likedgames) {
                if (document.getElementsByName(like).length > 0) {
                    recentGamesContainer.innerHTML += createGameButton(like);
                }
            }
        }

        if (length > 0) {
            recentRow.appendChild(recentGamesContainer);
            gamesDiv.prepend(recentRow);
        }

    }

    //popular games
    let row = document.createElement('div');
    row.classList.add('horizontalCon');
    let gamesContainer = document.createElement('ul');
    gamesContainer.classList.add('gamesCon');
    //add the arrows to the horizontal Con
    row.innerHTML += arrowContainer;

    //for each popular game, add the game to the horizontalCon

    // let popGamesRes = await fetcher(`/stats/games/popular`);

    // if (popGamesRes.status == 200) {
    // let text = await popGamesRes.text();
    // let popularGames = JSON.parse(text);

    // for (let i = 0; i < 15; i++) {
    // const gameName = popularGames[i].game;
    // if (gameName != null) {
    // gamesContainer.innerHTML += createGameButton(gameName, 'hot');
    // }
    // }
    // }
    row.appendChild(gamesContainer);
    gamesDiv.prepend(row);
    //gamesDiv.innerHTML = `<h1>Popular Games</h1>` + gamesDiv.innerHTML;

    if (newGames.length > 0) {
        let row = document.createElement('div');
        row.classList.add('horizontalCon');
        let gamesContainer = document.createElement('ul');
        gamesContainer.classList.add('gamesCon');
        //add the arrows to the horizontal Con
        row.innerHTML += arrowContainer;
        //for each element in newGames, add the game to the horizontalCon
        for (let i = 0; i < newGames.length; i++) {
            gamesContainer.innerHTML += createGameButton(newGames[i]);
        }
        row.appendChild(gamesContainer);
        gamesDiv.prepend(row);
        gamesDiv.innerHTML = `<h1>New Games <a href="/classes/new/">View More</a></h1>` + gamesDiv.innerHTML;
    }

    //Make new games last 3 weeks
    //UNSORT THE GAMES
    addArrowListeners();
    findLazyImages();
}

const searchBar = document.getElementById('searchBar');
var typingTimer;
var doneTypingInterval = 1000; // Time in milliseconds (1 second)

searchBar.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        let input = searchBar.value;

        zaraz.track("search", { input: input, user: token.id });
    }, doneTypingInterval);

    scrollTo(0, 0);

    let input = searchBar.value.toUpperCase().split(' ').join('');

    document.getElementById('filteredGames').style.display = 'none';
    if (input != '') {
        document.getElementById('filteredGames').style.display = '';
    }

    const gameButtons = document.getElementById('filteredGames').getElementsByClassName('all');

    let gameShown = false;
    Array.from(gameButtons).forEach((game) => {
        var name = game.getAttribute('name').toUpperCase();
        name = name.split(' ').join('');

        if (name.includes(input) && game.classList.contains(selectedTopic)) {
            game.style.display = '';
            gameShown = true;
        } else {
            game.style.display = 'none';
        }
    });
    if (!gameShown) {
        document.getElementById('noSearch').style.display = '';
    } else {
        document.getElementById('noSearch').style.display = 'none';
    }
    if (gamesDiv.innerHTML == '') {
        document.getElementById('noSearch').style.display = '';
    }
});

function createGameButton(game, pin) {
    const data = games[game];
    if (data == null) return '';

    game = data.name;
    let classlist = data.tags.replace(/,/g, ' ');

    //const weekAgo = new Date();
    //weekAgo.setDate(weekAgo.getDate() - 7 * 3);
    //const gameDate = new Date(data.date_added);

    let gameBtn = '';
    let buttons = '';

    let onclick = `handleGameClick('${game}')`;

    if (selectedTopic == 'enigma' && pin == 'filtered') {
        onclick = `handleGameClick('${game}', '/class2/${game.replaceAll(' ', '-')}/')`;
    }

    if (pin == 'pin') {
        buttons += "<button id='pin'><img src='/assets/images/icons/coloredpin.avif'></button>";
    }
    if (pin == 'hot') {
        buttons += "<button id='newbanner'><img src='/assets/images/icons/hotbanner.avif'></button>";
    }

    if (pin == 'filtered') {
        let hasCategory = false;
        for (let i = 0; i < categories.length; i++) {
            let tagslist = data.tags.replace(/,/g, ' ');
            if (tagslist.includes(categories[i])) {
                hasCategory = true;
            }
        }
        if (!hasCategory) {
            classlist += ' random';
        }
    }

    //if (gameDate > weekAgo) {
    //    classlist += ' new';
    //    buttons += "<button id='newbanner'><img src='/assets/images/icons/newbanner.avif'></button>";
    //}

    if (pin != 'suggested') {
        classlist += ' all';
    }

    const gameItem = `
    <li name="${game}" id="gameDiv" onclick="${onclick}" class="${classlist}">
        ${buttons}
        <div class="imageCon">
            <img class="lazy" data-src="../..${data.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='100%25' height='100%25' fill='%23340060'/%3E%3C/svg%3E" alt="FreezeNova.Cloud ${game}" title="FreezeNova.Cloud - ${game}"/>
        </div>
        <div class="innerGameDiv">${game}</div>
    </li>
    `;

    return gameItem;
}

// Function to handle game clicks and store in localStorage
function handleGameClick(game, url = `../../class/${game.replaceAll(' ', '-')}`) {
    let playedGames = JSON.parse(localStorage.getItem('playedGames')) || {};

    if (!playedGames[game]) {
        playedGames[game] = new Date().toISOString();
    } else if (playedGames[game] === true) {
        playedGames[game] = new Date().toISOString();
    }

    localStorage.setItem('playedGames', JSON.stringify(playedGames));

    location.href = url + "/";
}


function addArrowListeners() {
    // Function to toggle arrow visibility based on scroll position
    const toggleArrowVisibility = (gamesCon, leftArrow, rightArrow) => {
        // Hide left arrow if scrolled all the way to the left
        if (gamesCon.scrollLeft === 0) {
            leftArrow.style.visibility = 'hidden';
        } else {
            leftArrow.style.visibility = 'visible';
        }

        // Hide right arrow if scrolled all the way to the right
        if (gamesCon.scrollLeft + gamesCon.clientWidth >= gamesCon.scrollWidth - 1) {
            rightArrow.style.visibility = 'hidden';
        } else {
            rightArrow.style.visibility = 'visible';
        }
    };

    // Add event listeners for left and right arrow buttons
    for (let i = 0; i < document.getElementsByClassName('arrowLeftCon').length; i++) {
        const leftArrow = document.getElementsByClassName('arrowLeftCon')[i];
        const parentElement = leftArrow.parentNode.parentNode;
        const gamesCon = parentElement.querySelector('.gamesCon');
        const rightArrow = parentElement.querySelector('.arrowRightCon');

        // Initial check for arrow visibility when the page loads
        toggleArrowVisibility(gamesCon, leftArrow, rightArrow);

        leftArrow.addEventListener('click', function () {
            gamesCon.scrollLeft -= Math.min(gamesCon.scrollLeft, 1100);
            toggleArrowVisibility(gamesCon, leftArrow, rightArrow); // Update visibility after scroll
        });

        gamesCon.addEventListener('scroll', () => {
            toggleArrowVisibility(gamesCon, leftArrow, rightArrow); // Update visibility during scroll
        });
    }

    for (let i = 0; i < document.getElementsByClassName('arrowRightCon').length; i++) {
        const rightArrow = document.getElementsByClassName('arrowRightCon')[i];
        const parentElement = rightArrow.parentNode.parentNode;
        const gamesCon = parentElement.querySelector('.gamesCon');
        const leftArrow = parentElement.querySelector('.arrowLeftCon');

        // Initial check for arrow visibility when the page loads
        toggleArrowVisibility(gamesCon, leftArrow, rightArrow);

        rightArrow.addEventListener('click', function () {
            const remainingSpace = gamesCon.scrollWidth - gamesCon.clientWidth - gamesCon.scrollLeft;
            gamesCon.scrollLeft += Math.min(remainingSpace, 1100);
            toggleArrowVisibility(gamesCon, leftArrow, rightArrow); // Update visibility after scroll
        });

        gamesCon.addEventListener('scroll', () => {
            toggleArrowVisibility(gamesCon, leftArrow, rightArrow); // Update visibility during scroll
        });
    }

    // Add event listeners for left SVG arrow elements
    const leftSVGs = document.querySelectorAll('.left-arrow');
    leftSVGs.forEach(svg => {
        svg.addEventListener('click', function () {
            const parentElement = svg.closest('.titleContainer');
            const gamesCon = parentElement.nextElementSibling.querySelector('.gamesCon');

            const remainingSpace = gamesCon.scrollWidth - gamesCon.clientWidth - gamesCon.scrollLeft;
            gamesCon.scrollLeft += Math.min(remainingSpace, 1100);
        });
    });
}

function findLazyImages() {
    // Get all the lazy images
    const lazyImages = document.querySelectorAll('.lazy');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.src = entry.target.dataset.src;
                    entry.target.classList.remove('lazy');
                    observer.unobserve(entry.target);
                }
            });
        }, {
        // Start loading the images when they are 10% visible
        threshold: 0.1,

        // Start loading the images when they are 500 pixels away from the viewport
        rootMargin: '500px 0px',
    }
    );

    lazyImages.forEach((image) => {
        observer.observe(image);
    });
}