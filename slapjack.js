let opponentCards = [];
let discardCards = [];
let playerCards = [];

const header = document.getElementById(`header`);
const opponentDeck = document.getElementById(`opponent-deck`);
const discardPile = document.getElementById(`discard-pile`);
const playerDeck = document.getElementById(`player-deck`);
const opponentFace = document.getElementById(`opponent-face`);
const playersFace = document.getElementById(`players-face`);
const playerRemainingCards = document.getElementById(`player-Cards`);
const opponentRemainingCards = document.getElementById(`opponent-Cards`);
const popUp = document.getElementById(`popUp`);
let suits = ['H', 'S', 'D', 'C'];
let x = 0;

function card(value, suit){
	this.value = value;
	this.suit = suit;
}

for(let i = 0; i < suits.length; i++){
     
    for(let j = 1; j < 14; j++){
        switch(j) {
            case 1:
                discardCards.push( new card('A', suits[i]) );
            break;
            case 11:
                discardCards.push( new card('J', suits[i]) );
                break;
            case 12:
                discardCards.push( new card('Q', suits[i]) );
                break;
            case 13:
                discardCards.push( new card('K', suits[i]) );  
                break;
                default:
                discardCards.push( new card(j, suits[i]) );
                break;
        
        }
        x++;
    }
    
}

function shuffle(deck) {
    let currentCard = deck.length;
    let temporaryCard;
    let randomCard;
    
    while(0 !== currentCard) {
        // Pick a card
        randomCard = Math.floor(Math.random() * currentCard);
        currentCard -= 1;
        
        // Shuffle
        temporaryCard = deck[currentCard];
        deck[currentCard] = deck[randomCard];
        deck[randomCard] = temporaryCard;
    }
    return deck;
}

discardCards = shuffle(discardCards);


for( let i = 0, c = discardCards.length; i < c; i++){
    i % 2 === 0 ? playerCards.push(discardCards[i]) : opponentCards.push(discardCards[i]);
}


discardCards = [];

let popUpTime;

function playCard(event) {
    if( this.className == ""){
        popUp.style.display = 'inline-block';
        window.clearTimeout(popUpTime);
        popUpTime = window.setTimeout(function() {
        popUp.style.display = 'none';
	},900);
    } else {

    const target = event.currentTarget.id;
    discardPile.style.visibility = `visible`;
	if (target === 'player-deck') {
		discardCards.push(playerCards[0]);
        playerCards.splice(0, 1);
        playerDeck.classList.remove("active")
        opponentDeck.classList.add("active")

	} else if (target === `opponent-deck`) {
		discardCards.push(opponentCards[0]);
        opponentCards.splice(0, 1);
        opponentDeck.classList.remove("active")
        playerDeck.classList.add("active")

    }
    
   const currentCard = discardCards[discardCards.length - 1];
   let currentValue = currentCard['value'];
   const suit = currentCard['suit'];
   const cardNumbers = document.getElementsByClassName(`card-number`);
   let suitSymbol;
   discardPile.classList.remove(`red`);
   for ( let i =0; i < 2; i++){
    cardNumbers[i].textContent = currentValue;
    switch(suit) {
        case `H`: {
            cardNumbers[i].innerText = currentValue + "\n♥";
            suitSymbol = "♥";
            discardPile.classList.add(`red`);
        }
        break;
        case `D`: {
            cardNumbers[i].innerText = currentValue + "\n♦";
            suitSymbol = "♦";
            discardPile.classList.add(`red`);
        }
        break;
        case `S`: {
            cardNumbers[i].innerText = currentValue + "\n♠";
            suitSymbol = "♠";
        }
        break;
        case `C`: {
            cardNumbers[i].innerText = currentValue + "\n♣";
            suitSymbol = "♣";
            
        }
        break;
        default:
            console.error(`No recognizable suit found`);
    }
   }

   const cardArt = document.getElementsByClassName(`card-art`)[0];
    while(cardArt.children[0]) {
        cardArt.children[0].remove();
        cardArt.style.flexFlow = null;
    }
    if (!isNaN(currentValue)) {
        // console.log("is a number")
    for( let i = 0; i < currentValue; i++){
        let suitSymbolContainer = document.createElement(`div`);
        suitSymbolContainer.textContent = suitSymbol;
        cardArt.append(suitSymbolContainer);
    }

    if (currentValue < 4) {
        cardArt.style.flexFlow = `column wrap`;
    }  

   } else if(isNaN(currentValue)){
    //    console.log("is not a number")
    switch(currentValue) {
        case `J`:
            suitSymbol = `🤵`;
        break;
        case `Q`:
            suitSymbol = `👸`;
        break;
        case `K`:
            suitSymbol = `🤴`;
        break;
        default:
    }

    let suitSymbolContainer = document.createElement(`div`);
        suitSymbolContainer.textContent = suitSymbol;
        suitSymbolContainer.style.fontSize = `6vh`;
        cardArt.append(suitSymbolContainer);

        if(currentValue !== "A"){
            cardArt.style.flexFlow = `column wrap`;
            let flippedSuitSymbolContainer = document.createElement(`div`);
            flippedSuitSymbolContainer.textContent = suitSymbol;
            flippedSuitSymbolContainer.style.fontSize = `6vh`;
            flippedSuitSymbolContainer.style.transform = "rotate(180deg)";
            cardArt.append(flippedSuitSymbolContainer);
           }
   }

   getCurrentCards();
   opponentAI(target);
      }

}

let reaction;

function opponentAI(lastPlayer) {
    const reactionTime = Math.floor(Math.random() * (1400 - 900)) + (900);
    const botMistake = Math.floor(Math.random() * 10) + 1;
    window.clearTimeout(reaction);
    reaction = window.setTimeout(function() {
        const discardCardsLength = discardCards.length;
        if (discardCardsLength > 0 && discardCards[discardCardsLength - 1]['value'] === `J`) {
            slap();
        } else if (discardCardsLength > 0 && botMistake === `5`){
            slap();
        }  else if (lastPlayer === `player-deck`) {
            let event = new Object;
            event.currentTarget = new Object;
            event.currentTarget.id = `opponent-deck`;
            playCard(event);
        }
    },reactionTime);
}

function slap(event) {
    const discardCardsLength = discardCards.length;
    let currentPLayer;
    
    if( event !== undefined){
        currentPLayer = `player`;
    } else if( event === undefined) {
        currentPLayer = `oponnent`;
        if (discardCardsLength === 0) {
            changeMood('sad');
            return;
        }

    }

    if (discardCardsLength > 0 && discardCards[discardCardsLength - 1]['value'] === `J`) {
        if(currentPLayer === `player`){
            playerCards = playerCards.concat(shuffle(discardCards));
            
            window.clearTimeout(reaction);
            changeMood('sad');
        } else if(currentPLayer === `oponnent`){
            opponentCards = opponentCards.concat(shuffle(discardCards));
            
            opponentAI(`player-deck`);
            changeMood('happy');
        } 

        discardPile.style.visibility = `hidden`;
        getCurrentCards();
        discardCards = [];
        console.log(currentPLayer+" Slapped!")
    } else if(discardCardsLength > 0 && discardCards[discardCardsLength - 1]['value'] !== `J`){
        if(currentPLayer === `player`){
            opponentCards = opponentCards.concat(shuffle(discardCards));
            
            window.clearTimeout(reaction);
            opponentAI(`player-deck`);
            changeMood('happy');
        } else if(currentPLayer === `oponnent`){
            playertCards = playerCards.concat(shuffle(discardCards));
            window.clearTimeout(reaction);
            opponentAI(`opponent-deck`);
            changeMood('sad');
        } 

        discardPile.style.visibility = `hidden`;
        getCurrentCards();
        discardCards = [];
        console.log(currentPLayer+" Made a bad Slap!")
    }
    
}

let expression;
function changeMood(mood){
    if(mood ==="happy"){
        console.log("happy");
        opponentFace.textContent = '😁';
        playersFace.textContent = '😣';
        header.textContent = "The opponent took the pile!";
    } else if( mood === "sad"){
        opponentFace.textContent = '😣';
        playersFace.textContent = '😁';
        header.textContent = "The player took the pile!";
    }
    const expressionTime = Math.floor(Math.random() * (2000-1500)) + (1500);
    window.clearTimeout(expression);
    expression = window.setTimeout(function() {
        opponentFace.textContent = `🙂`;
        playersFace.textContent = '🙂';
	},expressionTime);
}


function getCurrentCards() {
    if(playerCards.length === 0){
        playerDeck.removeEventListener(`click`, playCard, false);
        playerDeck.style.visibility = `hidden`;
        discardPile.style.visibility = `hidden`;
		window.clearTimeout(reaction);
		document.getElementById(`win-lose-status`).textContent = `YOU LOSE!`;
		document.getElementById(`play-again-wrapper`).style.display = `flex`;
    } else if(opponentCards.length === 0){
        opponentFace.textContent = `😣`;
        opponentDeck.style.visibility = `hidden`;
        discardPile.style.visibility = `hidden`;
		window.clearTimeout(reaction);
		document.getElementById(`win-lose-status`).textContent = `YOU WIN!`;
		document.getElementById(`play-again-wrapper`).style.display = `flex`;
    } else {
        let playerDeckPile = playerDeck.childNodes[3];
        playerDeckPile.innerHTML = "";
        let opponentDeckPile = opponentDeck.childNodes[3];
        opponentDeckPile.innerHTML = "";

        let left = 0;
        let bottom = 0;
        for(let i = 0; i < playerCards.length; i++){
            let li = document.createElement('li');
            li.style.left = left +"px";
            li.style.bottom = bottom +"px";
            let div = document.createElement('div');
            div.className = "card back";
            playerDeckPile.append(li);
            li.append(div);
            left += 2;
            bottom += 1;
            playersFace.style.marginLeft = 23 + left +"px";
            
        }
        left = 0; bottom = 0;
        for( let i = 0; i < opponentCards.length; i++){
            let li = document.createElement('li');
            li.style.left = left +"px";
            li.style.bottom = bottom +"px";
            let div = document.createElement('div');
            div.className = "card back";
            opponentDeckPile.append(li);
            li.append(div);
            left += 2;
            bottom += 1;
            opponentFace.style.marginLeft = 23 + left +"px";
        }
    
    }
    
        
    
}


playerDeck.addEventListener(`click`, playCard, false);
discardPile.addEventListener(`click`, slap, false);

