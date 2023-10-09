const container = document.getElementById("container");

let users = [];
let ogUsers = [];

async function fetchUsers() {
    let data = await fetch(`http://localhost:3000/masai`);
    data = await data.json();
    console.log(data);
    users = data;
    ogUsers = data;
    showUsers(users);
}

window.onload = ()=>{
    fetchUsers();
}

let currUser = 0;

function showUsers(users) {
    document.getElementById("container").innerHTML = ""
    users.map((user) => {
        let card = document.createElement("div");
        card.className = "student";
        let image = document.createElement("img");
        image.setAttribute("src", user.image);
        let h3 = document.createElement("h3");
        h3.innerText = user.name;
        let p = document.createElement("p");
        p.className = "student_score";
        p.innerText = user.score;
        let p2 = document.createElement("p");
        p2.innerText = `Batch: ${user.batch}`;
        let p3 = document.createElement("p");
        p3.innerText = user.section;
        let btn = document.createElement("button");
        btn.innerText = "Remove";
        btn.className = "remove_student";
        btn.addEventListener("click", async () => {
            await fetch(`http://localhost:3000/masai/${user.id}`, {
                method: "DELETE",
                headers: {
                    contentType: "application/json",
                }
            })
            fetchUsers(users)
            }
        )
        let btn2 = document.createElement("button");
        btn2.innerText = "Update Score";
        btn2.className = "update_score";
        btn2.addEventListener("click", () => {
            document.getElementById("new_score").value = user.score;
            currUser = user.id;
        });
        card.append(image, h3, p, p2, p3, btn, btn2);
        container.append(card);
    });
}

async function postStudent() {
    let name = document.getElementById("name").value;
    let batch = document.getElementById("batch").value;
    let section = document.getElementById("section").value;
    let image = document.getElementById("image").value;
    let score = document.getElementById("eval_score").value;
    await fetch(`http://localhost:3000/masai`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            batch: batch,
            section: section,
            image: image,
            score: score,
        }),
    });
    fetchUsers();
}

const updateInput = document.getElementById("new_score");
updateInput.addEventListener("keyup", async (e) => {
    if (e.keyCode == 13) {
        e.preventDefault();
        await fetch(`http://localhost:3000/masai/${currUser}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                score: document.getElementById("new_score").value,
            }),
        });
    }
    fetchUsers();
});

const submit = document.getElementById("add_student");
submit.addEventListener("click", postStudent);

const lth = document.getElementById("sort-low-to-high");
const htl = document.getElementById("sort-high-to-low");
lth.addEventListener("click", async () => {
    let newdata = await fetch(`http://localhost:3000/masai?_sort=score&_order=asc`)
    newdata = await newdata.json();
    users = newdata;
    showUsers(users);
})
htl.addEventListener("click", async () => {
    let newdata = await fetch(`http://localhost:3000/masai?_sort=score&_order=desc`)
    newdata = await newdata.json();
    users = newdata;
    showUsers(users);
})

const greater = document.getElementById("greater-than")
const lesser = document.getElementById("less-than")
greater.addEventListener("click", async() => {
    let newdata = await fetch(`http://localhost:3000/masai?score_gte=5`)
    newdata = await newdata.json();
    users = newdata;
    console.log(newdata)
    showUsers(users);
})
lesser.addEventListener("click", async() => {
    let newdata = await fetch(`http://localhost:3000/masai?score_lte=5`)
    newdata = await newdata.json();
    console.log(newdata)
    users = newdata;
    showUsers(users);;
})