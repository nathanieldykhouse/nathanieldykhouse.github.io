const projectDisplays = document.getElementById("projectDisplays");
var allSubdirs = [];

function getPaths(){
    fetch("https://api.github.com/repos/Clover9898/Clover9898.github.io/contents/projectFiles/")
    .then(response => response.json())
    .then(data => {
        allSubdirs = data;
        console.log(allSubdirs[0]);
        createNewBoxes();
    })
    .catch(error => console.error('Error:', error));
    
}

function createNewBoxes(){
    projectDisplays.style.display = 'grid';
    projectDisplays.style.gridTemplateColumns = 'repeat(4, 1fr)';
    projectDisplays.style.gap = '20px';

    for(let i = 0; i < allSubdirs.length; i++){
        let curName = allSubdirs[i].name;

        let projectUrl = "https://clover9898.github.io/projectFiles/" + curName;

        const link = document.createElement('a');
        link.href = projectUrl;
        link.target = '_blank';
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';

        let newDiv = document.createElement('div');

        newDiv.id = curName;
        newDiv.style.position = 'relative';
        newDiv.style.overflow = 'hidden';
        newDiv.style.width = '300px';
        newDiv.style.height = '200px';
        newDiv.style.border = '1px solid #ccc';
        newDiv.style.marginBottom = '20px';
        newDiv.style.borderRadius = '8px';
        newDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';

        //-- internal iframe
        
        let newIframe = document.createElement('iframe');
        
        newIframe.src = "https://clover9898.github.io/projectFiles/" + curName;
        newIframe.href = "https://clover9898.github.io/projectFiles/" + curName;
        newIframe.style.width = '1200px';
        newIframe.style.height = '800px';
        newIframe.style.transform = 'scale(0.25)';
        newIframe.style.transformOrigin = 'top left';
        newIframe.style.border = 'none';
        newIframe.style.pointerEvents = 'none';
        newIframe.style.position = 'absolute';
        newIframe.style.top = '0';
        newIframe.style.left = '0';

        newDiv.appendChild(newIframe);
        link.appendChild(newDiv);
        projectDisplays.appendChild(link);
    }
}

getPaths();
