async function getAPI() {
    const data = await fetch("/schedules");
    return data.json();
}

async function replaceData() {
    const data = await getAPI();
    const jobs = document.getElementById('Jobs');
    const jobsNum = document.getElementById('JobsNum');
    let num = 0;
    jobs.innerText = data;
    for (let i in data.json()) {
        console.log(data[i]);
        num=num+1
    }
    // jobsNum.innerText = num;
}

replaceData()
setInterval(replaceData, 5000);