async function search() {
    let medium = document.getElementById("medium").value 
    let category = document.getElementById("category").value

    document.getElementById("medium").value = "";
    document.getElementById("category").value = "";

    let data = {};

    if (medium != "") {
        data.Medium = medium
    }

    if (category != "") {
        data.Category = category
    }

    const res = await fetch("/search", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let art = await res.json();

    if (art.length > 0) {
        alert("Search successful");
        let text = "";
        for (let i in art) {
            text += `<h5><a href = "/gallery/${art[i]._id}">${art[i].Title}</a></h5>`; 
        }
        document.getElementById("abc").innerHTML = text;

    } else {
        alert("No result found");
    }

}

