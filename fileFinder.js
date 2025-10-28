const projectDisplays = document.getElementById("projectDisplays");
var allSubdirs = [];

function getPaths() {
    fetch("https://api.github.com/repos/nathanieldykhouse/nathanieldykhouse.github.io/contents/projectFiles/")
        .then(response => response.json())
        .then(data => {
            allSubdirs = data;
            console.log(allSubdirs[0]);
            createNewBoxes();
        })
        .catch(error => console.error('Error:', error));
}

function createNewBoxes() {
    projectDisplays.style.display = 'grid';
    projectDisplays.style.gridTemplateColumns = 'repeat(4, 1fr)';
    projectDisplays.style.gap = '20px';

    for (let i = 0; i < allSubdirs.length; i++) {
        let curName = allSubdirs[i].name;
        let projectUrl = "https://nathanieldykhouse.github.io/projectFiles/" + curName;

        // Create anchor
        const link = document.createElement('a');
        link.href = projectUrl;
        link.target = '_blank';
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';

        // Outer container
        const newDiv = document.createElement('div');
        newDiv.id = curName;
        newDiv.style.position = 'relative';
        newDiv.style.width = '300px';
        newDiv.style.border = '1px solid #ccc';
        newDiv.style.borderRadius = '8px';
        newDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        newDiv.style.cursor = 'pointer';
        newDiv.style.display = 'flex';
        newDiv.style.flexDirection = 'column';
        newDiv.style.alignItems = 'center';
        newDiv.style.justifyContent = 'flex-start';
        newDiv.style.overflow = 'hidden';
        newDiv.style.backgroundColor = '#fff';

        // Iframe wrapper
        const iframeWrapper = document.createElement('div');
        iframeWrapper.style.position = 'relative';
        iframeWrapper.style.width = '300px';
        iframeWrapper.style.height = '200px';
        iframeWrapper.style.overflow = 'hidden';

        // Internal iframe
        const newIframe = document.createElement('iframe');
        newIframe.src = projectUrl;
        newIframe.style.width = '1200px';
        newIframe.style.height = '800px';
        newIframe.style.transform = 'scale(0.25)';
        newIframe.style.transformOrigin = 'top left';
        newIframe.style.border = 'none';
        newIframe.style.pointerEvents = 'none';
        newIframe.style.position = 'absolute';
        newIframe.style.top = '0';
        newIframe.style.left = '0';

        // Project title text
        const title = document.createElement('p');
        title.textContent = curName.replace(/\.[^/.]+$/, '');
        title.style.margin = '0';
        title.style.padding = '10px';
        title.style.textAlign = 'center';
        title.style.fontSize = '14px';
        title.style.fontWeight = 'bold';
        title.style.borderTop = '1px solid #eee';
        title.style.backgroundColor = '#f9f9f9';
        title.style.width = '100%';

        // Assemble
        iframeWrapper.appendChild(newIframe);
        newDiv.appendChild(iframeWrapper);
        newDiv.appendChild(title);
        link.appendChild(newDiv);
        projectDisplays.appendChild(link);
    }
}

getPaths();

