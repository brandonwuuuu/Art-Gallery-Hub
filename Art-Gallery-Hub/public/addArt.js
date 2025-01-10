async function addArt() {
    let title = document.getElementById("title").value;
    let year = document.getElementById("year").value;
    let category = document.getElementById("category").value;
    let medium = document.getElementById("medium").value;
    let description = document.getElementById("description").value;
    let poster = document.getElementById("poster").value;

    document.getElementById("title").value = '';
    document.getElementById("year").value = '';
    document.getElementById("category").value = '';
    document.getElementById("medium").value = '';
    document.getElementById("description").value = '';
    document.getElementById("poster").value = '';

    let data = {"Title":title}

    const res = await fetch("/checkTitle", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let text = await res.text();

    if (res.ok) {
        data = {"Title":title, "Year":year, "Category":category, "Medium":medium, "Description":description, "Poster":poster};
        const response = await fetch("/gallery", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    
        let text2 = await response.text();
        if (response.ok) {
            alert("Art added successfully")
        } else {
            alert(text2)
        }
    } else {
        alert(text);
    }

}

