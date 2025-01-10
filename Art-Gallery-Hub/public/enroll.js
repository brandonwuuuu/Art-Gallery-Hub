async function enroll() {
    let url = new URL(window.location.href);

    let location = url.toString().split('/').pop();

    let data = {"_id": location}

    const res = await fetch("/enroll", {
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

