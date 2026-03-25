document.addEventListener("DOMContentLoaded", () => {
    
    function initGraphs(){
        updateGraph(1);
        updateGraph(2);
        updateGraph(3);
    }
    
    function getRandomEntriesFromMethod(methodNum, display = true){
        let entries = [];
        if(methodNum == 1){
            while(entries.length < 10){
                let entry = MMAPPLETS.UTIL.getRandomInt(0,49);
                if(!entries.includes(entry)){
                    entries.push(entry);
                }
            }
        }
        if(methodNum == 2){
            for(let i = 0; i < 5; i++){
                let row1 = MMAPPLETS.UTIL.getRandomInt(0,9);
                let row2 = MMAPPLETS.UTIL.getRandomInt(0,9);
                while(row2 == row1){
                    row2 = MMAPPLETS.UTIL.getRandomInt(0,9); //ensure that you don't sample the same person twice
                }
                entries.push(row1 + (i * 10));
                entries.push(row2 + (i * 10));
                
            }
        }
        if(methodNum == 3){
            for(let i = 0; i < 10; i++){
                const r = MMAPPLETS.UTIL.getRandomInt(0,4);
                const index = r * 10 + i;
                entries.push(index);
            }
        }
    
        let mean = getMeanFromEntries(entries);
    
        document.getElementById("populationEnjoymentOutput").innerText = "Average enjoyment for this sample: " + mean.toFixed(2);
    
        meanHistoryPerMethod[methodNum-1].push(mean);
    
        
        if(display == true){
            displayEntries(entries);
    
            updateGraph(1);
            updateGraph(2);
            updateGraph(3);
        }
    
        if(meanHistoryPerMethod[0].length > 0 && meanHistoryPerMethod[1].length > 0 && meanHistoryPerMethod[2].length > 0){
            activateShowTrueButton();
        }
    }
    
    function quickAddSamples(){
        const amountSamples = parseInt(document.getElementById("quickAddAmtInput").value);
        const outputTo = parseInt(document.getElementById("chooseMethodDropdown").value);
        for(let x = 0; x < amountSamples; x++){
            if(x != amountSamples - 1){
                getRandomEntriesFromMethod(outputTo, false);
            } else{
                getRandomEntriesFromMethod(outputTo);
            }
        }
    }
    
    function applyEventListeners(){
        
        document.getElementById("doSimType1btn").addEventListener('click', () => { getRandomEntriesFromMethod(1); });
        document.getElementById("doSimType2btn").addEventListener('click', () => { getRandomEntriesFromMethod(2); });
        document.getElementById("doSimType3btn").addEventListener('click', () => { getRandomEntriesFromMethod(3); });
        
        document.getElementById("quickAddButton").addEventListener('click', () => { quickAddSamples(); });
    }
    
    initGraphs();
    changeInitialAudienceMemberAppearance();
    applyEventListeners();
});