const DEV_URL = "https://api.github.com/users";
const DEV_CONTAINER = document.querySelector(".dev-container");
const INPUT = document.querySelector('.header__input')
const PAGES = document.querySelector('.pages')
const BTN   = document.querySelector('.header__btn')
const ADD_DEV = document.querySelector('.add-dev')
const CANCEL_BTN = document.querySelector('.cancel')
const ADD_DEV_BTN = document.querySelector('.sumbin')
let   devList = [];

// localStorage.clear()
// console.log(localStorage.getItem('devList'))


BTN.addEventListener('click', () => {
    ADD_DEV.style.display = 'block'
})

CANCEL_BTN.addEventListener('click', () => {
    ADD_DEV.style.display = 'none'
})


ADD_DEV_BTN.addEventListener('click', () => {
    
    let newDev = [{
        login: document.getElementById('login').value,
        id: Math.floor(Math.random() * 10000),
        avatar_url: './ava.webp',
        html_url: document.getElementById('github').value,
        type: document.getElementById('type').value
    } ];
    if(localStorage.getItem('devList')) {
        newDev.push(...JSON.parse(localStorage.getItem('devList')))
    }
    if (newDev[0]?.login && newDev[0]?.html_url){
        localStorage.setItem('devList', JSON.stringify([...newDev]))
    }
    location.reload()
    
})


INPUT.addEventListener('input', () => {
    let login = INPUT.value.toLowerCase();
    let newDevList = devList.filter(dev => {
        for(let i = 0; i < login.length; i++){
            if (login[i] !== dev.login[i].toLowerCase())
                return false
        }
        return true
    });
    if (!login.length){
        displayData(devList)
        return ;
    }
    newDevList.length >= 10 ? displayData(newDevList, newDevList.length)
        : displayData(newDevList, newDevList.length, newDevList.length)

})

const getDevFromLocalStorage = () => {
    
    if (!localStorage.getItem('devList'))
        return false;
    
    devList.push(...JSON.parse(localStorage.getItem('devList')));

}

// const linkPage = (devList, i) => {
//     displayData(devList, i*10)
// }

const pagination = (pos, devList) => {
    PAGES.innerHTML = '';
    let pages = Math.ceil(devList.length / 10);

    for (let i = 1; i <= pages; i++){
        let item = (
        ` <a
                href='#'
                class='pages__link ${Math.floor(pos/10 ) === i ? 'active' : ''}'
           >
                ${i}
           </a> `
        )

        PAGES.insertAdjacentHTML('beforeend', item);
    }

    // document.querySelectorAll('.pages__link').addEventListener('click', )
    

    document.querySelectorAll('.pages__link').forEach(link => {
        link.addEventListener('click', () => {
            devList.length >= 10 ? displayData(devList, +link.innerText*10)
                : displayData(devList, +link.innerText*10, devList.length)
                // console.log(link.innerText)
        })
    })


}


const displayData = (devList ,position = 10, length = 10) => {
    DEV_CONTAINER.innerHTML = '';
    console.log(devList)
    for (let i = position - length; i < position; i++) {
        if (!devList[i]?.avatar_url)
            break;
        const devCard = (
            `<div class='dev-card'>
                <div class="dev-card__header">
                    <img 
                        src=${devList[i].avatar_url}
                        alt="develiper avatar"
                        class="dev-card__img"
                    />
                </div>
                    <h2 class="dev-card__login">${devList[i].login}</h2>
                    <div class="dev-card__info">
                        <p class="dev-card__github">
                            GitHub: <a 
                                        title=${devList[i].html_url}
                                        href=${devList[i].html_url} 
                                        class="dev-card__link"
                                    >
                                        ${devList[i].html_url}
                                    </a>
                        </p>
                        <p class="dev-card__id">ID: ${devList[i].id}</p>
                        <p class="dev-card__type">Type: ${devList[i].type}</p>
                    </div>
                </div>
            </div>`
        )
        
        DEV_CONTAINER.insertAdjacentHTML('beforeend', devCard);
    }

    pagination(position, devList)
}


const getDevFromAPI = (devURL) => {

    let nextPage;

    fetch(devURL)
        .then(result => {
            nextPage = (result.headers.get('link')
                .split(';')[0]
                    .replace(/<|>/gi, ''));
            return result.json()
        }).then(result => {
            devList.push(...result);
            if (devList.length < 100)
                getDevFromAPI(nextPage)
            else
                displayData(devList)
            
        })
        
}

const startScript = () => {

    getDevFromLocalStorage();
    if (!devList || devList.length < 100)
        getDevFromAPI(DEV_URL);

}

startScript()