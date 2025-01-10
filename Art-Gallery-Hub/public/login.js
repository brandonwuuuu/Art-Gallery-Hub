async function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    document.getElementById("username").value = '';
    document.getElementById("password").value = '';

    let loginInfo = {"username":user, "password":pass}

    const res = await fetch("/login", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo)
    })

    let text = await res.text();

    if (res.ok) {
        alert(text);
        window.location.href = "/profile"
    } else {
        alert(text);
    }

}

