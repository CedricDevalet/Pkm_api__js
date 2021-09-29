//Création d'un premier tableau pour stocker les données des pokémons
let allPokemon = [];
//Tableaux avec tous les nom en français + l'image correspondant au bon pokemon
let tableauFin = [];
const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');
const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};



/* ---------------------- APPEL DE L'API + FUNCTIONS PROPRE A SON UTILISATION ------------------------ */

//Appel de l'API pokemon

function fetchpokemonBase(){
    fetch("https://pokeapi.co/api/v2/pokemon?limit=251")
        .then(response => response.json())
        .then((allPoke) => {
            //console.log(allPoke);
            allPoke.results.forEach((pokemon) => {
                fetchPokemonComplet(pokemon);
            })
        })
}
fetchpokemonBase();

// Mise en place de contrainte pour afficher les données demandé uniquement avec parametrage de la langue (fr-FR)
function fetchPokemonComplet(pokemon) {
    let objPokemonFull = {};
    let url = pokemon.url;
    let nameP = pokemon.name;

    fetch(url)
    .then(response => response.json())
    .then((pokeData) => {
        //console.log(pokeData);

        objPokemonFull.pic = pokeData.sprites.front_default;
        objPokemonFull.type = pokeData.types[0].type.name;
        objPokemonFull.id = pokeData.id;

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then(response => response.json())
        .then((pokeData) => {
            //console.log(pokeData);

            objPokemonFull.name = pokeData.names[4].name;
            allPokemon.push(objPokemonFull);

            if(allPokemon.length === 251) {
                //console.log(allPokemon);

                tableauFin = allPokemon.sort((a,b) => {
                    return a.id - b.id;
                }).slice(0,21);
                //console.log(tableauFin);

                createCard(tableauFin);
                chargement.style.display = "none";
            }
        })
    })
}
/* On utilise la méthode sort() ci-dessus. 
Elle permet de comparer un élément avec tout les autres et de le placer avant / soit après / Voir ne pas bouger ect ect pour chaqu'une des entrées */

/* ---------------------- AFFICHAGE DES INFORMATIONS ------------------------ */
//Création des cartes 

function createCard(arr) {

    //On utilise la boucle for pour que tous les paramètre soit ajouté à chaqu'une des cartes. 
    for(let i = 0; i < arr.length; i++) {

        //Permet la mise en place du background color en fonction du type de pokemon 
        const carte = document.createElement('li');
        let couleur = types[arr[i].type];
        carte.style.background = couleur;
        //Affiche le nom du pokemon dans la carte.
        const txtCard = document.createElement('h5');
        txtCard.innerText = arr[i].name;
        //Attribue l'Id du pokemon (il faut respecter un ordre car il sont classé en fonction de leurs évolution)
        const idCard = document.createElement('p');
        idCard.innerText = `ID# ${arr[i].id}`;
        //Affiche le sprite du pokemon
        const imgCard = document.createElement('img');
        imgCard.src = arr[i].pic;

        carte.appendChild(imgCard);
        carte.appendChild(txtCard);
        carte.appendChild(idCard);

        listePoke.appendChild(carte);
    }
    
}

/* ------------------------ Scroll infini ------------------------ */

window.addEventListener('scroll', () => {

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    // scrollTop = scroll depuis le top
    // scrollHeight = scroll total
    // clientHeight = hauteur de la fenêtre, partie visible.
    
    if(clientHeight + scrollTop >= scrollHeight - 20) {
        //Une fois les 21 premières entrées faites appel la fonction qui va les rajouters 6 par 6 en fonction de la dernière données afficher.
        addPoke(6);
    }
})

let index = 21;

//Fonction qui va ajouter à la liste les prochain pokémon
function addPoke(nb) {
    //Bloque le tout une fois que l'objectif est atteint 
    if(index > 251) {
        return;
    }
    const arrToAdd = allPokemon.slice(index, index + nb);
    //console.log(index, index + nb);
    createCard(arrToAdd);
    index += nb;

}

/* ------------------------ Recherche ------------------------ */
//Recherche dynamique 
searchInput.addEventListener('keyup', recherche);

/* RECHERCHE AU CLIC  => Cette version de la barre de recherche est moins dynamique et doit faire valider sa recherche avec un bouton prévu 

const formRecherche = document.querySelector('form');
formRecherche.addEventListener('submit', (e) => {
    e.preventDefault();
    recherche();
}) */

function recherche() {
    
    if(index < 251) {
        addPoke(130);
    }

    let filter, allLi, titleValue, allTitles;
    filter = searchInput.value.toUpperCase();
    allLi = document.querySelectorAll('li');
    allTitles = document.querySelectorAll('li > h5');

    for(i = 0; i < allLi.length; i++) {

        titleValue = allTitles[i].innerText;

        if(titleValue.toUpperCase().indexOf(filter) > -1) {
            allLi[i].style.display = "flex";
        } else {
            allLi[i].style.display = "none"; 
        }

    }
}




/* ------------------------ Animation Input ( Barre de recherche ) ------------------------ */
/* fixe le texte de base de l'input au dessus de la barre de recherche ppour éviter de superposer le texte une fois l'input remplie */

searchInput.addEventListener('input', function(e) {

    if(e.target.value !== "") {
        e.target.parentNode.classList.add('active-input');
    } else if(e.target.value === "") {
        e.target.parentNode.classList.add('active-input');
    }

})
/* ----------------------------------------------------------------- */






























