/*
    2C = Two of Clubs
    2D = Two of Diamonds
    2H = Two of Hearts
    2S = Two of Spades
*/

const module = (() => {
    'use strict'

    let deck = [], pointsPlayers = [];
    const types = ['C', 'D', 'H', 'S'], specials = ['A', 'J', 'Q', 'K'];

    // Referencias del HTML
    const btnTake = document.querySelector('#btnTake'),
        btnStop = document.querySelector('#btnStop'),
        btnNew = document.querySelector('#btnNew');
    const divCardsPlayers = document.querySelectorAll('.divCards'),
        pointsHTML = document.querySelectorAll('small');

    // Esta función comienza el juego
    const startGame = (numPlayers = 2) => {
        deck = createDeck();
        pointsPlayers = [];
        for (let i = 0; i < numPlayers; i++) {
            pointsPlayers.push(0);
        }

        pointsHTML.forEach(elem => elem.innerText = 0);
        divCardsPlayers.forEach(elem => elem.innerHTML = '')

        btnTake.disabled = false;
        btnStop.disabled = false;
    }

    // Esta función crea una nueva baraja de cartas
    const createDeck = () => {
        deck = [];

        for (let i = 2; i <= 10; i++) {
            for (let type of types) {
                deck.push(i + type)
            }
        }

        for (let type of types) {
            for (let special of specials) {
                deck.push(special + type)
            }
        }
        return _.shuffle(deck);
    }

    // Esta función permite tomar una carta
    const takeCard = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en la baraja'
        }
        return deck.pop();
    }

    // Esta función obtiene el valor de una carta
    const valueCard = (card) => {
        const value = card.substring(0, card.length - 1);

        return (isNaN(value)) ? (value === 'A') ? 11 : 10 : value * 1;

    }

    // Turn 0 = primer jugador y el último será la computadora
    const accumulatePoints = (card, turn) => {
        pointsPlayers[turn] = pointsPlayers[turn] + valueCard(card)
        pointsHTML[turn].innerText = pointsPlayers[turn];
        return pointsPlayers[turn];
    }

    const createCard = (card, turn) => {
        const imgCard = document.createElement('img');
        imgCard.src = `assets/cards/${card}.png`;
        imgCard.classList.add('item-card');
        divCardsPlayers[turn].append(imgCard)
    }

    const determineWinner = () => {
        const [pointsMin, pointsComputer] = pointsPlayers;
        setTimeout(() => {
            if (pointsComputer === pointsMin) {
                alert('¡EMPATE!')
            } else if (pointsMin > 21) {
                alert('¡COMPUTADORA GANA!')
            } else if (pointsComputer > 21) {
                alert('¡GANASTE!')
            } else {
                alert('¡COMPUTADORA GANA!')
            }
        }, 100)
    }

    // Turno de la computadora
    const turnComputer = (pointsMin) => {
        let pointsComputer = 0;
        do {
            const card = takeCard();

            pointsComputer = accumulatePoints(card, pointsPlayers.length - 1);

            createCard(card, pointsPlayers.length - 1);

            if (pointsMin > 21) {
                break;
            }
        } while ((pointsComputer < pointsMin) && (pointsMin <= 21));

        determineWinner();
    }

    // Eventos
    btnTake.addEventListener('click', () => {
        const card = takeCard();

        const pointsPlayer = accumulatePoints(card, 0);

        createCard(card, 0);

        if (pointsPlayer > 21) {
            console.warn('Lo siento mucho, perdiste.');
            btnTake.disabled = true;
            btnStop.disabled = true;
            turnComputer(pointsPlayer);
        } else if (pointsPlayer === 21) {
            console.warn('21, genial');
            btnTake.disabled = true;
            btnStop.disabled = true;
            turnComputer(pointsPlayer);
        }
    });

    btnStop.addEventListener('click', () => {
        btnTake.disabled = true;
        btnStop.disabled = true;

        turnComputer(pointsPlayers[0]);
    });

    btnNew.addEventListener('click', () => {
        startGame();
    });

    return {
        newGame: startGame
    };
})();


