async function addWorkShop() {
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;

    document.getElementById("name").value = '';
    document.getElementById("description").value = '';

    let data = {"name":name, "description":description}

    const res = await fetch("/workshop", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text)
    } else {
        alert(text);
    }

}

