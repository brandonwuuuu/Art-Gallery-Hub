async function removeLike(artTitle) {
    let data = {}
    data.title = artTitle
    const res = await fetch("/likes", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text);

    } else {
        alert(text);
    }

    window.location.href = window.location.href

}

async function unfollow(id) {
    let data = {}
    data._id = id
    const res = await fetch("/follow", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text);

    } else {
        alert(text);
    }

    window.location.href = window.location.href

}

async function removeComment(comment) {
    let data = {}
    data.comments = comment
    const res = await fetch("/comments", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text);

    } else {
        alert(text);
    }

    window.location.href = window.location.href

}

async function switchAccount() {
    let data = {}
    const res = await fetch("/switchAccount", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text);
        window.location.href = window.location.href

    } else {
        alert(text);
        window.location.href = "/addArt"
    }

}

async function logout() {
    let data = {}
    const res = await fetch("/logout", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text);
        window.location.href = "/"

    } else {
        alert(text);
    }

}