async function follow() {
    let url = new URL(window.location.href);

    let location = url.toString().split('/').pop();

    let data = {"artistId": location}

    const res = await fetch("/follow", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let text = await res.text();

    if (res.ok) {
        alert("Following successful");

    } else {
        alert(text);
    }

}



