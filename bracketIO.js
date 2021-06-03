import { LightningElement } from 'lwc';

export default class BracketIO extends LightningElement {
    playersArray = [];  //stores input list of players
    bracketArray = [];  //stores bracket/tree
    generateIsClicked = false;  //generate button isClicked var
    outputHTML = "";  //stores bracket output html
    exp = -1;

    createBracket (playersList) {
        var n = playersList.length;
        playersList = this.randomizeArray(playersList);

        if (n in [0,1]) {
            return null;
        }
        else {
            var bracket = new Array(n + 1);
            bracket[1] = "Winner";
        
            for (var i = 1; 2**i <= n; i++) {
                this.exp = i
            }
            var numPlayIns = n - 2**this.exp;
            var numPlayersWithBuys = 2**(this.exp+1) - n;
            var exclude = -1;
            if (numPlayIns < numPlayersWithBuys) {
                exclude = numPlayIns + 2**(this.exp - 1);
            }
            else {
                exclude = 2**this.exp;
            }

            for (var j = 2; j <= n - exclude; j++) {
                var match = [(2*j-1), (2*j)];
                bracket[j] = match;
            }

            var playerPoint = 0;
            for (var k = bracket.length - 1; 
                playerPoint < playersList.length - numPlayersWithBuys; k--) {
                match = [playersList[playerPoint], playersList[playerPoint + 1]];
                bracket[k] = match;
                playerPoint += 2;
            }

            var count = numPlayIns;
            for (var m = n-exclude+1; m <= n-numPlayIns; m++) {
                match = [];
                if (count > 0) {
                    match = [n-count+1, playersList[playerPoint]];
                    count--;
                    playerPoint++;
                }
                else {
                    match = [playersList[playerPoint], playersList[playerPoint + 1]];
                    playerPoint += 2;
                }
                bracket[m] = match;
            }

            return bracket;
        }
    }

    getHTMLOut(bracketArr) {
        var outputString = "";
        var headerCount = 1
        var firstIteration = true;
        if(2**this.exp != bracketArr.length-1) {
            outputString += "<h1 style='font-size:20px;text-align:center'><b>Play-In Games<b></h1><ul style='text-align:center'><ul style='text-align:center'>";
            firstIteration = false;
            headerCount++;
        }
        
        for (let index = bracketArr.length-1; index > 2**this.exp; index--) {
            outputString += "<li><b>MATCH " + (index-2).toString() + "</b></li><li>" + bracketArr[index][0] + " vs. " + bracketArr[index][1] + "</li>";
        }

        var tempExp = this.exp;
        for (let index2 = 2**this.exp; index2 > 1; index2--) {
            if(index2 == 2**tempExp) {
                if (!firstIteration) {
                    outputString += "</ul>"
                }
                outputString += "<h" + headerCount.toString() + " style='font-size:20px;text-align:center'><b>";
                if(!([2,4,8].includes(index2))) {
                    outputString += "Round of " + index2.toString();
                }
                else if(index2 == 2) {
                    outputString += "Championship";
                }
                else if(index2 == 4) {
                    outputString += "Semifinal Round";
                }
                else {
                    outputString += "Quarterfinal Round";
                }
                
                outputString += "<b></h" + headerCount.toString() + "><ul style='text-align:center'>";
                firstIteration = false;
                headerCount++;
                tempExp--;
            }
            if(index2 != 2) {
                outputString += "<li><b>MATCH " + (index2-2).toString() + "</b></li>";
            }

            if(typeof bracketArr[index2][0] == 'number') {
                outputString += "<li>W" + (bracketArr[index2][0]-2).toString() + " vs. ";
            }
            else {
                outputString += "<li>" + bracketArr[index2][0] + " vs. ";
            }

            if(typeof bracketArr[index2][1] == 'number') {
                outputString += "W" + (bracketArr[index2][1]-2).toString() + "</li>";
            }
            else {
                outputString += bracketArr[index2][1] + "</li>";
            }
        }
        return outputString;
    }

    randomizeArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    handleClick(event) {
        //method handles button click by generating bracket

        //gets input from text-area element
        this.generateIsClicked = true;
        const textArea = this.template.querySelector('lightning-textarea');
        this.playersArray = textArea.value.split("\n");

        var newBracket = this.createBracket(this.playersArray);
        var outputHTMLString = this.getHTMLOut(newBracket);

        this.outputHTML = outputHTMLString; //"<h1 style='font-size:30px'><b>" + newBracket + "</b></h1><ul style='text-align:center'><li>One</li><li>Two</li><li>Three</li></ul>";

        var outputBracket = this.template.querySelectorAll('div')[1];
        outputBracket.innerHTML = this.outputHTML;
    }
}

