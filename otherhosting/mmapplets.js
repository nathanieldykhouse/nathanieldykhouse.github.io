var MMAPPLETS = MMAPPLETS || { };

MMAPPLETS.UI = {
    addClickListeners: function(){
        document.addEventListener('click', function(event){
            
            //NAVIGATION BAR HANDLING
            if(event.target.classList.contains('navBarItemText') || event.target.classList.contains('navBarItem')){
                
                //get closest navigation bar entry
                const closestNavEntry = (event.target.classList.contains('navBarItemText')) ? event.target.closest('.navBarItem') : event.target;
                
                //get only the number related to the id
                const strippedId = closestNavEntry.id.replace(/\D/g, '');
                
                alert(strippedId);
            }
        });
    },
    
    testFunc: function(){
        alert("it worked");
    }
};