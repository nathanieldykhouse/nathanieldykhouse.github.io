var MMAPPLETS = MMAPPLETS || { };

MMAPPLETS.INFO = {
    appletInfo: {
        numSections: 0
    },
    
    getAppletInfo: function(){
        const sectionContentDiv = document.getElementById("sectionContent");
        this.appletInfo.numSections = sectionContentDiv.dataset.numSections;
    }
}

MMAPPLETS.UI = {
    addClickListeners: function(){
        document.addEventListener('click', function(event){
            
            //NAVIGATION BAR HANDLING
            if(event.target.classList.contains('navBarItemText') || event.target.classList.contains('navBarItem')){
                
                //get closest navigation bar entry
                const closestNavEntry = (event.target.classList.contains('navBarItemText')) ? event.target.closest('.navBarItem') : event.target;
                
                //get only the number related to the id
                const strippedId = closestNavEntry.id.replace(/\D/g, '');
                
                MMAPPLETS.UI.setDisplayedSection(Number(strippedId));
            }
        });
    },
    
    setDisplayedSection: function(displaySection){
        var sections = document.querySelectorAll('.sectionContainer');
        sections.forEach(section => {
            let sectionNum = section.id.replace(/\D/g, '');
            if(Number(displaySection) == Number(sectionNum)){
                section.style.display = 'block';
            } else{
                section.style.display = 'none';
            }
        });
    },
    
    testFunc: function(){
        alert("it worked");
    }
};
