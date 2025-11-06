let categorizedGames = {
    //'enigma': document.createElement('ul'),
    //'app': document.createElement('ul'),
    'best': document.createElement('ul'),
    'multiplayer': document.createElement('ul'),
    'car': document.createElement('ul'),
    'minecraft': document.createElement('ul'),
    'action': document.createElement('ul'),
    'shooting': document.createElement('ul'),
    'puzzle': document.createElement('ul'),
    'simulator': document.createElement('ul'),
    'sports': document.createElement('ul'),
    'clicker': document.createElement('ul'),
    'escape': document.createElement('ul'),
    '2-player': document.createElement('ul'),
    'scary': document.createElement('ul'),
    'skill': document.createElement('ul'),
    'adventure': document.createElement('ul'),
    'flash': document.createElement('ul')
};

const localHost = [
    'localhost'
  ].includes(window.location.hostname);

let token;
let interval;

// featured games slides code
let shouldAutoSwitch = true;
let slideIndex = 1;
const slides = document.getElementsByClassName('featureSlot');
const switchSlide = (n) => {
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = '';
};
const plusSlides = (n) => {
    shouldAutoSwitch = false;
    switchSlide((slideIndex += n));
};
const autoPlusSlides = (n) => {
    switchSlide((slideIndex += n));
};
const autoSwitch = () => {
    if (shouldAutoSwitch) {
        setTimeout(() => {
            if (shouldAutoSwitch) {
                autoPlusSlides(1);
                autoSwitch();
            }
        }, 5500);
    }
};

// DISABLED BECAUSE IT NEEDS TO BE RE-PROGRAMMED
switchSlide(slideIndex);
autoSwitch();

// Load Games
let games;
let sorted;

findLazyImages();

window.addEventListener('load', async () => {
    // update underline link in navbar
    //document.getElementById('gamesnav').classList.add('selected');

    // retrieve games from json file
    //let gamesRes = await fetcher('/games');
    //games = await gamesRes.json();
    let gamesSource = '/assets/ts_games_small.json';
    if (localHost)
    {
        gamesSource = '/assets/ts_games.json';
    }

    let gamesRes = await fetch(gamesSource);
    games = await gamesRes.json();

    if (games.length > 0 && games[0].name == "TemplateGameName")
    {
        games.shift(); // skip first element because it's template
    }

    // retrieve featured games
    //let featuresRes = await fetcher('/features');
    //features = await featuresRes.json();

    // for (let feature of features)
    // {
    // let index = features.indexOf(feature);

    // let featureEle = document.getElementById('feature-' + (index + 1));
    // featureEle.children[0].children[1].innerText = feature.game;
    // featureEle.children[1].onclick = () => { window.open(feature.url, '_self') };
    // featureEle.style.backgroundImage = `url(${feature.image})`;
    // }

    // console.log('Featured games:');

    let featuredGames = games.filter(game => game.tags && game.tags.includes('featured'));
    for (let game of featuredGames) {
        let index = featuredGames.indexOf(game);
        let featureEle = document.getElementById('feature-' + (index + 1));
        if (featureEle) {
            featureEle.children[0].children[1].innerText = game.name;

            //https://definitelyscience.com/class.php?class=Awesome-Tanks-2
            let gameName = game.name;
            //featureEle.children[1].onclick = () => { window.open(`/class.html?class=${gameName.replaceAll(' ', '-')}`, '_self') };
            //featureEle.children[1].onclick = () => { window.open(`./class/${gameName.replaceAll(' ', '-')}/`, '_self'); };

            const link = featureEle.children[1];
            const slug = gameName.replaceAll(' ', '-');
            let indexUrl = "/";
            link.setAttribute('href', `./class/${slug}` + indexUrl);
            // optional: ensure it opens in the same tab (default for <a> is _self anyway)
            link.setAttribute('target', '_self');

            featureEle.style.backgroundImage = `url(${game.image})`;
        }


        //   console.log('Name:', game.name);
        //   console.log('Description:', game.description);
        //   console.log('Article:', game.article);
        //   console.log('Image:', game.image);
        //   console.log('Controls:', game.controls);
        //   console.log('Tags:', game.tags);
        //   console.log('Date Added:', game.date_added);
        //   console.log('Developer:', game.developer);
        //   console.log('iFrame URL:', game.iframe_url);
        //   console.log('Enabled:', game.enabled);
        //   console.log('---');
    }




    loadGames();

    // check if user is authenticated
    // let response = await fetcher(`/auth/check`);

    // if (response.status == 401 || response.status == 403) {
    token = false;

    // // user is not signed into an account
    // //document.getElementById('timerText').innerHTML = '<a href="/signup.php">Sign up</a> to collect your daily reward!';
    document.getElementById('timerText').innerHTML = '';

    // suggest games without account information
    const suggestionEle = document.getElementById('scisuggests');
    // clear suggested games placeholders
    suggestionEle.textContent = '';
    // display 6 random games as suggestions
    for (let x = 0; x < 6; x++) {
        let randGame = randomProperty(games);
        let gameBtn = createGameButton(randGame, 'suggested', false);
        suggestionEle.appendChild(gameBtn);
    }
    // } else {
    // // display points count in navbar
    // let json = await response.json();
    // // setPointsDisplay(json.points || 0, json.username || "");

    // token = true;

    // loadRewards();

    // // suggest games with account information
    //suggestGames();
    // }

    //const hostname = window.location.hostname;
    //if (hostname.includes("definitelyscience")) 
    //{
    //loadPartners();
    //}

});

async function loadGames() {
    const sortObject = (obj) => Object.keys(obj).sort().reduce((res, key) => ((res[key] = obj[key]), res), {});

    // sort games
    sorted = sortObject(games);

    // create date object for one week in the past
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7 * 3);

    if (localHost)
    {
        // display sorted games
        for (let name in sorted) {
            // create date object for game added timestamp
            //const gameDate = new Date(sorted[name].date_added);

            // if game is less than a week old, add it to the new games list
            // if (gameDate > weekAgo) {
            // if (categorizedGames.new)
            // {
            // if (categorizedGames.new.childElementCount < 25)
            // {
            // categorizedGames.new?.appendChild(createGameButton(name, '', true));
            // }
            // }
            // }

            // for each game, if it has a tag that matches on of the categories, add it to that container... MAY have multiple!
            let tagsArray = sorted[name].tags.split(',');
            //for (let tag of sorted[name].tags) {
            for (let tag of tagsArray) {
                if (categorizedGames[tag]) {
                    if (categorizedGames[tag].childElementCount < 25) {
                        if (tag == 'enigma') {
                            categorizedGames[tag]?.appendChild(createGameButton(name, '', true, true));
                        }
                        else {
                            categorizedGames[tag]?.appendChild(createGameButton(name, '', true));
                        }
                    }
                }
            }
        }

        // if there are any new games, display them
        // if (categorizedGames.new.children.length > 0) {
        // document.getElementById('newGamesLabel').style.display = '';
        // document.getElementById('newGamesHorizontalCon').style.display = '';
        // }

        // display all categories
        for (let categorizedGame in categorizedGames) {
            categorizedGames[categorizedGame].className = 'gamesCon';
            document.getElementById(categorizedGame + 'GamesHorizontalCon').appendChild(categorizedGames[categorizedGame]);
        }
    }

    loadPopularGames();
    loadPinGames();
    loadLikedGames();
    loadRecentlyPlayedGames();
    addArrowListeners();
    findLazyImages();
}

async function loadPopularGames() {
    // display popular games
    // let popGamesRes = await fetcher(`/stats/games/popular`);

    // if (popGamesRes.status == 200) {
    // const populargamesContainer = document.getElementById('popularGamesCon');

    // let popularGames = await popGamesRes.json();

    // for (let i = 0; i < 15; i++) {
    // if (popularGames[i].game) {
    // populargamesContainer.appendChild(createGameButton(popularGames[i].game, 'hot'));
    // }
    // }
    // }
}

async function loadPinGames() {
    const pinGamesContainer = document.getElementById('pinGamesCon');


    let pingames = JSON.parse(localStorage.getItem('pinnedGames'));

    if (pingames && Object.keys(pingames).length > 0) {
        document.getElementById('pinGamesLabel').style.display = '';
        document.getElementById('pinGamesHorizontalCon').style.display = '';

        for (pin in pingames) {
            //const data = games[like];
            //console.log("like " + like + " data " + data);

            let indexGame = games.findIndex(game => game.name === pin);

            if (pingames[pin] && pinGamesContainer.childElementCount < 25) {
                pinGamesContainer.appendChild(createGameButton(indexGame, '', true));
            }
        }
    }
    //}
}

function loadLikedGamesGET() {
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

async function loadLikedGames() {
    const likedGamesContainer = document.getElementById('likedGamesCon');
    const likedGamesLabel = document.getElementById('likedGamesLabel');
    const likedGamesHorizontalCon = document.getElementById('likedGamesHorizontalCon');

    // Hide containers by default
    likedGamesLabel.style.display = 'none';
    likedGamesHorizontalCon.style.display = 'none';

    //let likedgames = JSON.parse(localStorage.getItem('likedGames'));
    let likedgames = loadLikedGamesGET();

    if (Array.isArray(likedgames) && likedgames.length > 0) {
        let addedCount = 0;

         for (const gameName of likedgames) {
            if (addedCount >= 25) break;

            const indexGame = games.findIndex(game => game.name === gameName);
            if (indexGame !== -1) {
                likedGamesContainer.appendChild(
                createGameButton(indexGame, '', true)
                );
                addedCount++;
            }
            }

        if (addedCount > 0) {
            likedGamesLabel.style.display = '';
            likedGamesHorizontalCon.style.display = '';
        }
    }
}

async function loadPartners() {
    // load partners
    //let partnersRes = await fetcher(`/partners`);
    //let partners = await partnersRes.json();

    let partnersRes = await fetch('/assets/ts_partners.json');
    partners = await partnersRes.json();

    for (let x = 0; x < partners.length; x++) {
        const backgroundImg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='100%25' height='100%25' fill='%23340060'/%3E%3C/svg%3E`;
        const name = partners[x].name;
        const image = partners[x].image;
        const website = partners[x].website;

        let partnerEle = document.createElement('div');
        partnerEle.tagName = name;
        partnerEle.id = 'gameDiv';
        partnerEle.addEventListener('click', () => {
            window.open(website, '_blank')
        });

        let imageContainer = document.createElement('div');
        imageContainer.classList = 'imageCon partner';

        let img = document.createElement('img');
        img.classList = 'lazy partner';
        img.setAttribute('data-src', image);
        img.src = backgroundImg;
        img.alt = `Totally Science Partner ${name}`;
        img.title = `Totally Science Partner ${name}`;

        let nameEle = document.createElement('div');
        nameEle.className = 'innerGameDiv';
        nameEle.innerText = name;

        imageContainer.appendChild(img);
        partnerEle.appendChild(imageContainer);
        partnerEle.appendChild(nameEle);

        document.getElementById(`PartnersCon`).appendChild(partnerEle);
    }
    findLazyImages();
}

// async function loadRewards() {
// // user is signed in, update points reward accordingly
// let rewardRes = await fetcher(`/points/reward/check`);
// let text = await rewardRes.text();
// let json = JSON.parse(text);

// if (json.isReady) {
// let points = 100;

// if (json.rewardDay >= 6) {
// points = 1000;
// }

// // document.getElementById('timerText').innerHTML = `<a onclick="claimReward()" href="javascript:void(null)">Click here</a> to collect your daily reward of ${points} pts!`;
// } else {
// startTimer(json.rewardTime);
// }

// animateBar(json.rewardDay);
// }





//
// reward system
//
function startTimer(endTime) {
    clearInterval(interval);

    //document.getElementById('timerText').innerHTML = '<span class="loader"></span>Daily Reward In <span id="rewardTimer"></span>';
    document.getElementById('timerText').innerHTML = '';

    interval = setInterval(() => {
        // divide by 1000 to get seconds
        let currentTime = Math.floor(Date.now() / 1000);

        let remainingTime = endTime - currentTime;

        if (remainingTime < 0) {
            document.getElementById('rewardTimer').innerText = '00:00:00';
            clearInterval(interval);
            return;
        }

        let seconds = Math.floor(remainingTime % 60)
            .toString()
            .padStart(2, '0');
        let minutes = Math.floor((remainingTime / 60) % 60)
            .toString()
            .padStart(2, '0');
        let hours = Math.floor((remainingTime / (60 * 60)) % 24)
            .toString()
            .padStart(2, '0');

        document.getElementById('rewardTimer').innerText = hours + ':' + minutes + ':' + seconds;
    }, 1000);
}

function animateBar(day) {
    const rewardBar = document.getElementById('rewardDayBar');

    let w = (100 / 7) * (day + 1);

    rewardBar.style.width = `${w}%`;
    rewardBar.style.borderTopRightRadius = `0px`;
    rewardBar.style.borderBottomRightRadius = `0px`;

    if (day == 6) {
        rewardBar.style.borderTopRightRadius = `15px`;
        rewardBar.style.borderBottomRightRadius = `15px`;
    }
}

// async function claimReward() {
//     document.getElementById('timerText').innerHTML = '<span class="loader"></span>';

//     let res = await fetcher(`/points/reward/claim`);

//     if (res.status == 200) {
//         let text = await res.text();
//         let json = JSON.parse(text);

//         startTimer(json.rewardTime);
//         animateBar(json.rewardDay);

//         // update points display
//         // let currentVal = document.getElementById('pointsDisplay').innerText;
//         // counter('pointsDisplay', parseInt(currentVal), parseInt(currentVal) + parseInt(json.points), 2000);

//         // if (json.points == 0) {
//             // document.getElementById('timerText').innerHTML = 'Oh no! Your daily reward expired.<span class="loader"></span> Next Daily Reward In <span id="rewardTimer"></span>';
//         // }
//     } else {
//         location.href = 'signup.php';
//     }
// }

async function suggestGames() {
    // retrieve all pinned games of user
    let res = await fetcher(`/profile/pinned/get`);
    let text = await res.text();

    let pinnedGames = text.split(';');
    pinnedGames = pinnedGames.slice(1);

    let randomGames = [];

    for (let x = 0; x < 3; x++) {
        let randGame = randomProperty(games);

        while (randomGames.includes(randGame) || pinnedGames.includes(randGame)) {
            randGame = randomProperty(games);
        }

        randomGames.push(randGame);
    }

    //first pinned game is always going to be '' so length will always be atleast 1
    let totalPinned = pinnedGames.length;

    if (pinnedGames.length < 3) {
        let generateGames = 3 - pinnedGames.length;
        for (let i = 0; i < generateGames; i++) {
            let randGame = randomProperty(games);

            while (randomGames.includes(randGame) || pinnedGames.includes(randGame)) {
                randGame = randomProperty(games);
            }

            pinnedGames.push(randGame);
        }
    }

    document.getElementById('scisuggests').innerHTML = '';
    for (let i = 0; i < 3; i++) {
        let game = randomGames[i];
        let gameBtn = createGameButton(game, 'suggested', false);

        document.getElementById('scisuggests').appendChild(gameBtn);
        game = pinnedGames[i];

        if (i <= totalPinned - 1) {
            gameBtn = createGameButton(game, 'pin', false);
        } else {
            gameBtn = createGameButton(game, 'suggested', false);
        }

        document.getElementById('scisuggests').append(gameBtn);
    }
}

function formatTags(tags) {
    return tags.replace(/,/g, ' ');
}

function createGameButton(game, pin, lazy, class2) {
    const data = games[game];

    if (data == null) return document.createElement('div');

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7 * 3);

    //const gameDate = new Date(data.date_added);

    let gameName = data.name;
    let onclick = `playGame('${gameName}', ${class2})`;

    let gameDiv = document.createElement('li');
    gameDiv.setAttribute('tagName', gameName);
    gameDiv.id = 'gameDiv';
    gameDiv.classList = formatTags(data.tags);
    gameDiv.setAttribute('onclick', onclick);

    if (pin == 'pin') {
        let button = document.createElement('button');
        button.id = 'pin';
        let image = document.createElement('img');
        image.src = '/assets/images/icons/coloredpin.avif';
        button.appendChild(image);
        gameDiv.appendChild(button);
    } else if (pin == 'hot') {
        let button = document.createElement('button');
        button.id = 'newbanner';
        let image = document.createElement('img');
        image.src = 'assets/images/icons/hotbanner.avif';
        button.appendChild(image);
        gameDiv.appendChild(button);
    } else if (pin == 'hidden') {
        gameDiv.style.display = 'none';
    } else if (pin != 'suggested') {
        gameDiv.classList.add('all');
    }

    /*if (gameDate > weekAgo) {
        gameDiv.classList.add('new');
        let button = document.createElement('button');
        button.id = 'newbanner';
        let image = document.createElement('img');
        image.src = 'assets/images/icons/newbanner.avif';
        button.appendChild(image);
        gameDiv.appendChild(button);
    }*/

    let backgroundImg = lazy ? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='100%25' height='100%25' fill='%23340060'/%3E%3C/svg%3E` : "." + data.image;
    let lazyClass = lazy ? 'lazy' : '';

    let imageContainer = document.createElement('div');
    imageContainer.className = 'imageCon';

    let img = document.createElement('img');
    img.setAttribute('data-src', "." + data.image);
    img.src = backgroundImg;
    img.alt = `Totally Science ${gameName}`;
    img.title = `Totally Science ${gameName}`;
    img.className = lazyClass;

    imageContainer.appendChild(img);
    gameDiv.appendChild(imageContainer);

    let header = document.createElement('div');
    header.className = 'innerGameDiv';
    header.innerText = gameName;
    gameDiv.appendChild(header);

    return gameDiv;
}

// Function to store game in localStorage and log to console
function playGame(gameName, class2) {
    let indexUrl = "/";
    let url = `./class/${gameName.replaceAll(' ', '-')}` + indexUrl;
    //if (class2) {
    //    url = `./class2/${gameName.replaceAll(' ', '-')}/`;
    //}

    // Get stored games from localStorage
    let playedGames = JSON.parse(localStorage.getItem('playedGames')) || {};

    // Add the new game if it's not already stored
    if (!playedGames[gameName]) {
        playedGames[gameName] = true;
        localStorage.setItem('playedGames', JSON.stringify(playedGames));

        // Log to console
        console.log(`Game stored in localStorage: ${gameName}`);
    } else {
        console.log(`Game already exists in localStorage: ${gameName}`);
    }

    // Redirect to game
    window.location.href = url;
}

async function loadRecentlyPlayedGames() {
    if (!games || !Array.isArray(games)) {
        const errorMessage = console.error('Games array is not available - will retry...');
        setTimeout(() => {
            console.clear(errorMessage);
        }, 20);
        return;
    }

    const recentGamesContainer = document.getElementById('recentGamesCon');
    const recentlyPlayedCon = document.getElementById('recentlyPlayedCon');
    const titleContainer = document.getElementById('recentGamesLabel'); // updated to target the label container

    // Hide containers by default
    if (titleContainer) titleContainer.style.display = 'none';
    if (recentlyPlayedCon) recentlyPlayedCon.style.display = 'none';

    let playedGames = JSON.parse(localStorage.getItem('playedGames')) || {};

    if (Object.keys(playedGames).length > 0) {
        const reversedGameNames = Object.keys(playedGames).reverse();
        let addedCount = 0;

        for (let gameName of reversedGameNames) {
            if (addedCount >= 25) break;

            let indexGame = games.findIndex(g => g.name.toLowerCase() === gameName.toLowerCase());

            if (indexGame !== -1) {
                recentGamesContainer.appendChild(createGameButton(indexGame, '', true));
                addedCount++;
            }
        }

        if (addedCount > 0) {
            if (titleContainer) titleContainer.style.display = '';
            if (recentlyPlayedCon) recentlyPlayedCon.style.display = '';
        }
    }
}

// Call function on page load
window.addEventListener('load', loadRecentlyPlayedGames);


//check for local storage of daily reward
//if it is not over, set endTime to local storage time then count
//if it is over, check database
//if database says it is not over, set local storage to correct time and keep counting

async function addArrowListeners() {
    const leftArrows = document.getElementsByClassName('arrowLeftCon');
    const rightArrows = document.getElementsByClassName('arrowRightCon');
    const leftSVGs = document.querySelectorAll('.left-arrow');

    for (let arrow of leftArrows) {
        arrow.addEventListener('click', (e) => {
            const parentElement = e.target.parentNode.parentNode;
            const gamesCon = parentElement.querySelector('.gamesCon');

            if (gamesCon) {
                gamesCon.scrollLeft -= Math.min(gamesCon.scrollLeft, 1100);
            }
        });

        // Add event listener to scroll event
        const gamesCon = arrow.parentNode.parentNode.querySelector('.gamesCon');
        if (gamesCon) {
            gamesCon.addEventListener('scroll', () => {
                if (gamesCon.scrollLeft === 0) {
                    arrow.style.visibility = 'hidden';
                } else {
                    arrow.style.visibility = 'visible';
                }
            });
        }
    }

    for (let arrow of rightArrows) {
        arrow.addEventListener('click', (e) => {
            const parentElement = e.target.parentNode.parentNode;
            const gamesCon = parentElement.querySelector('.gamesCon');

            if (gamesCon) {
                const leftArrow = e.target.parentNode.parentNode.querySelector('.arrowCon');
                leftArrow.style.visibility = 'visible'; // Use assignment instead of style +=

                const remainingSpace = gamesCon.scrollWidth - gamesCon.clientWidth - gamesCon.scrollLeft;
                gamesCon.scrollLeft += Math.min(remainingSpace, 1100);
            }
        });

        // Add event listener to scroll event
        const gamesCon = arrow.parentNode.parentNode.querySelector('.gamesCon');
        if (gamesCon) {
            gamesCon.addEventListener('scroll', () => {
                if (gamesCon.scrollLeft + gamesCon.clientWidth >= gamesCon.scrollWidth - 1) {
                    arrow.style.visibility = 'hidden';
                } else {
                    arrow.style.visibility = 'visible';
                }
            });
        }
    }

    // Add listener for left SVG arrow
    leftSVGs.forEach(svg => {
        svg.addEventListener('click', (e) => {
            const parentElement = svg.closest('.titleContainer');
            const gamesCon = parentElement.nextElementSibling.querySelector('.gamesCon');

            if (gamesCon) {
                const remainingSpace = gamesCon.scrollWidth - gamesCon.clientWidth - gamesCon.scrollLeft;
                gamesCon.scrollLeft += Math.min(remainingSpace, 1100);
            }
        });
    });
}

async function findLazyImages() {
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
