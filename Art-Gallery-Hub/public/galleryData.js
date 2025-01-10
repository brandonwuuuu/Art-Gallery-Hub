async function comment() {
    let comment = document.getElementById("comments").value;

    document.getElementById("comments").value = '';
    let url = new URL(window.location.href);

    let location = url.toString().split('/').pop();

    let info = {"artLocation": location, "comments": comment}

    const res = await fetch("/comments", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text);
        window.location.href = window.location.href;
    } else {
        alert(text);
    }

}

async function likes() {
    let url = new URL(window.location.href);

    let location = url.toString().split('/').pop();

    let info = {"artLocation": location}

    const res = await fetch("/likes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text);
        window.location.href = window.location.href;
    } else {
        alert(text);
    }

}

