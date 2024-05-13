const blackList = ["Heritage", "Enriched", "Skills", "for", "Honors"];
const nameBlackList = ["no science hw", "no homework", "em6: no hw", "em6: no hw "];

let person = new URLSearchParams(window.location.search).get("person");

async function updateAssignments() {
    let date = new Date();
    let day = date.getDay();

    if (day === 0) {
    	day += 6;
    } else {
    	day -= 1;
    }
    
    let nextWeek = getCurrentDay() >= 4;
    
    let start = new Date();
    start.setDate(start.getDate() + (nextWeek ? (7 - day) : 0));
    
    let end = new Date();
    end.setDate(end.getDate() + 12 + (6 - day) + (nextWeek ? 7 : 0));
    
    return new Promise((resolve, reject) => {
        fetch("https://candyman.pink/schedule/update-database?count=1000&start=" + start.toISOString().split("T")[0] + "&end=" + end.toISOString().split("T")[0]).then(a=>a.text()).then(resolve);
    });
}

const table = document.querySelector("#table");

function addItem(day, item, subject) {
    if (day == "next") {
        const name = document.getElementById("next-name-" + item);
        const sub = document.getElementById("next-sub-" + item);
        const time = document.getElementById("next-time-" + item);
        return {
            setName(a) {
                name.innerHTML += a;
                sub.style.height = name.offsetHeight + "px";
                time.style.height = name.offsetHeight + "px";
                return this;
            }
        }
    }
    
    const bigSub = document.getElementById(day + "-" + "sub");
    const bigName = document.getElementById(day + "-" + "name");
    const bigTime = document.getElementById(day + "-" + "time");
    
    for (let i = 0; i < bigSub.children.length; i += 1) {
        if (bigSub.children[i].innerHTML.trim() == subject.trim()) {
            return {
                subSub: () => this,
                setName(a) {
                    bigName.children[i].innerHTML += a;
                    bigSub.children[i].style.height = bigName.children[i].offsetHeight + "px";
                    bigTime.children[i].style.height = bigName.children[i].offsetHeight + "px";
                    return this;
                }
            }
        }
    }
    
    const sub = bigSub.appendChild(document.createElement("div"));
    sub.classList.add("black");
    sub.classList.add("border");
    sub.classList.add("align-items-center");
    sub.classList.add("d-flex");
    sub.setAttribute("id", day + "-sub-" + (bigSub.childElementCount - 1));
    
    const name = bigName.appendChild(document.createElement("div"));
    name.classList.add("black");
    name.classList.add("border");
    name.setAttribute("id", day + "-name-" + (bigName.childElementCount - 1));
    
    const time = bigTime.appendChild(document.createElement("div"));
    time.classList.add("black");
    time.classList.add("border");
    time.setAttribute("id", day + "-time-" + (bigTime.childElementCount - 1));
    
    return {
        setSub(a) {
            sub.innerHTML = a;
            return this;
        },
        setName(a) {
            name.innerHTML += a;
            sub.style.height = name.offsetHeight + "px";
            time.style.height = name.offsetHeight + "px";
            return this;
        }
    };
}

function getCurrentDay() {
    let day = new Date(Date.now()).getDay();
    
    if (day === 0) {
        day += 6;
    } else {
        day -= 1;
    }
    
    return day;
}

function setItem(date, sub, name) {
    if (nameBlackList.includes(name.toLowerCase().trim())) return;
    
    let day = date.getDay();
    let indexOfNext;
    if (day === 0) {
        day += 6;
    } else {
        day -= 1;
    }
    
    let nextWeek = getCurrentDay() >= 4;
    
    let sunday = new Date();
    let currentDay = getCurrentDay();

    sunday.setDate(sunday.getDate() + 6 - (currentDay) + (nextWeek ? 7 : 0));
    
    if (date > sunday) {
        indexOfNext = day;
        day = "next";
    }
    
    if (date.toDateString() == sunday.toDateString() || date.getDay() == 6) {
        day = 4;
    }
    
    let brandNew = addItem(day, indexOfNext, sub);
    
    name = name.substring(name, 50);
    
    if (day !== "next" && brandNew.setSub) brandNew.setSub(sub);
    brandNew.setName((day == "next" ? "<bold style='font-weight:900'>" + sub + ": </bold>": "") + name + "<br/>");
}

function clearTable() {
    const top = document.querySelector("#top");
    const bottom = document.querySelector("#bottom");
    
    top.innerHTML = "";
    bottom.innerHTML = "";
    
    const bigTop = top.appendChild(document.createElement("tr"));
    
    for (let i = 0; i < 3; i += 1) {
        const sub = bigTop.appendChild(document.createElement("td"));
        sub.classList.add("v-stack");
        sub.classList.add("p-0");
        sub.setAttribute("id", i + "-sub");
        
        const name = bigTop.appendChild(document.createElement("td"));
        name.classList.add("v-stack");
        name.classList.add("p-0");
        name.setAttribute("id", i + "-name");
        
        const time = bigTop.appendChild(document.createElement("td"));
        time.classList.add("v-stack");
        time.classList.add("p-0");
        time.setAttribute("id", i + "-time");
    }
    
    const bigBottom = bottom.appendChild(document.createElement("tr")); // Hee hee
    
    for (let i = 3; i < 5; i += 1) {
        const sub = bigBottom.appendChild(document.createElement("td"));
        sub.classList.add("v-stack");
        sub.classList.add("p-0");
        sub.setAttribute("id", i + "-sub");
        
        const name = bigBottom.appendChild(document.createElement("td"));
        name.classList.add("v-stack");
        name.classList.add("p-0");
        name.setAttribute("id", i + "-name");
        
        const time = bigBottom.appendChild(document.createElement("td"));
        time.classList.add("v-stack");
        time.classList.add("p-0");
        time.setAttribute("id", i + "-time");
    }
    
    const bigNext = bottom.appendChild(document.createElement("tr"));
    
    const weeks = ["M", "T", "W", "Th", "F"];
    
    const bigSub = bigBottom.appendChild(document.createElement("td"));
    bigSub.classList.add("v-stack");
    bigSub.classList.add("p-0");
    bigSub.setAttribute("id", "next-sub");
    
    const bigName = bigBottom.appendChild(document.createElement("td"));
    bigName.classList.add("v-stack");
    bigName.classList.add("p-0");
    bigName.setAttribute("id", "next-name");

    const bigTime = bigBottom.appendChild(document.createElement("td"));
    bigTime.classList.add("v-stack");
    bigTime.classList.add("p-0");
    bigTime.setAttribute("id", "next-time");
    
    for (let i = 0; i < 5; i += 1) {
        const day = bigSub.appendChild(document.createElement("div"));
        day.classList.add("black");
        day.classList.add("border");
        day.classList.add("align-items-center");
        day.classList.add("d-flex");
        day.setAttribute("id", "next-sub-" + i);
        day.innerHTML = weeks[i];
        
        const name = bigName.appendChild(document.createElement("div"));
        name.classList.add("black");
        name.classList.add("border");
        name.setAttribute("id", "next-name-" + i);
        
        const time = bigTime.appendChild(document.createElement("div"));
        time.classList.add("black");
        time.classList.add("border");
        time.setAttribute("id", "next-time-" + i);
    }
}

async function updateTable() {
    clearTable();
    await lastUpdated();
    await updateWeather();
    updateDates();
    const all = await fetch("https://candyman.pink/schedule/get-assignments?person=" + person).then(a=>a.json());
    all.forEach(function(item) {
        for (let i = 0; i < blackList.length; i += 1) {
            item.course = item.course.toLowerCase().replace(blackList[i].toLowerCase().trim(), "").trim().replace("mandarin", "chinese");
        }
        let date = new Date(item.due_date.split("T")[0]);
        setItem(date, item.course.toUpperCase(), item.name);
    });
}

async function updateWeather() {
    try {
        const data = await fetch("https://candyman.pink/schedule/get-weather").then(a=>a.json());
        const date = new Date(Date.now());
        date.setHours(0, 0, 0, -1);
        let week = date.getDay();
        if (week == 0) {
            week += 6;
        } else {
            week -= 1;
        }
        
        const nextWeek = week >= 4;
        
        for (let i = (nextWeek ? 7 : week); i < data.length;i += 1) {
            let day = data[i - week];
            const elm = document.getElementById((nextWeek ? (i - 7) : (i + week)) + "-forecast");
            if (!elm) continue;
            elm.innerHTML = `${day.max_temp}/${day.min_temp} <img style="transform:translateY(-5px)" width="32" height="32" src="${day.img}" />`
        }
    } catch (err) {
        alert("Error while loading weather");
    }
    
}

async function lastUpdated() {
    const data = await fetch("https://candyman.pink/schedule/last-updated").then(a=>a.json());
    
    let date = new Date(data[0].content);
    if (Date.now() - date.getTime() > 1000 * 60 * 60 * 6) {
        await updateAssignments.then(updateTable);
    }

    document.querySelector("#last-updated").innerHTML = date.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
}

function updateSizes() {
    for (let i = 0; i < 5; i += 1) {
        const bigName = document.getElementById(i + "-name");
        
        for (let ii = 0; ii < bigName.children.length; ii += 1) {
            const time = document.getElementById(i + "-time-" + ii);
            time.style.height = bigName.children[ii].offsetHeight + "px";
            
            const sub = document.getElementById(i + "-sub-" + ii);
            sub.style.height = bigName.children[ii].offsetHeight + "px";
        }
    }
}

function updateDates() {
    for (let i = 0; i < 5; i += 1) {
        const dateElm = document.getElementById(i + "-date");
        const current = new Date(Date.now());
        let day = current.getDay();
        if (day == 0) {
            day += 6;
        } else {
            day -= 1;
        }
        const nextWeek = day >= 4;
        const date = new Date(Date.now() + 1000 * 60 * 60 * 24 * (i - day));
        if (nextWeek) {
            date.setDate(date.getDate() + 7);
        }
        dateElm.innerHTML = date.toDateString();
    }
}

function printPage() {
    const prev = document.body.innerHTML;
    
    html2canvas(document.body, { useCORS: true }).then((canvas) => {
        document.body.innerHTML = "";
        document.body.appendChild(canvas);
        window.print();
        document.body.innerHTML = prev;
    });
}

window.addEventListener("load", updateTable);

window.addEventListener("resize", updateSizes)

document.addEventListener("keydown", async function(e) {
    if (e.key.toLowerCase() == "p") {
        return printPage();
    }
    if (e.key.toLowerCase() == "a") {
        updateAssignments().then(updateTable);
        return;
    }
    if (e.key.toLowerCase() !== "s") return;
    person = person == "jayden" ? "joshua" : "jayden";
    updateTable();
});
