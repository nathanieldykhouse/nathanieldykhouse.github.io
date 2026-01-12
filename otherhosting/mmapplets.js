var MMAPPLETS = MMAPPLETS || { };

MMAPPLETS.INFO = {
    
};

MMAPPLETS.UI = {
    //Changes the visibility of a given element to visible or invisible
    toggleElementVisibility: function(elementId){
        const elem = document.getElementById(elementId);
        
        //garuntee element's existence
        if(typeof(element) != null){
            const currentElemVisibility = elem.style.visibility;
            if(currentElemVisibility == 'visible'){
                //disable visibility for element
                elem.style.visibility = 'none';
            } else{
                //return to default value
                elem.style.visibility = '';
            }
        } else{
            console.log("ERROR: Cannot toggle visibility of nonexistent element of id " + elementId);
        }
    },
    
    //Similar to toggleElementVisibility but changes display value to make the element take up no rendered DOM space
    toggleElementDisplay: function(elementId){
        const elem = document.getElementById(elementId);
        
        //garuntee element's existence
        if(typeof(element) != null){
            const currentElemDisplay = elem.style.display;
            if(currentElemDisplay == ''){
                //disable visibility for element
                elem.style.display = 'none';
            } else{
                //return to default value
                elem.style.display = '';
            }
        } else{
            console.log("ERROR: Cannot toggle display of nonexistent element of id " + elementId);
        }
    }
};
