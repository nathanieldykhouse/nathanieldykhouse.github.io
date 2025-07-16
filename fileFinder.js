 fetch("https://api.github.com/repos/Clover9898/Clover9898.github.io/contents/projects")
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));