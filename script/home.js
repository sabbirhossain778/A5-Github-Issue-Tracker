let allIssuesData = [];
const loadAllIssues = () => {

    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then((res) => res.json())
    .then((json) => {
        allIssuesData = json.data;
        loadAllCard(allIssuesData);
    })
}


const loadAllCard = (issues) =>{
    // console.log(issues);
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    for(let issue of issues){
        // console.log(issue);
        const card = document.createElement('div');
        card.innerHTML = `
        <div class="bg-base-100 shadow-sm p-3 rounded-xl space-y-2 h-full">
            <div id="status" class="flex justify-between">
                <img src="assets/Open-Status.png" alt="" srcset="">
                <p class="font-medium text-3 leading-none">${issue.priority}</p>
            </div>
            <h3 class="font-semibold text-[14px] text-[#1F2937]">${issue.title}</h3>
            <p class="text-[#64748B] text-3">${issue.description}</p>
            <div class="flex gap-3">
                <p class="font-medium text-3 leading-none px-2 py-1 rounded-[10px] text-[#EF4444] bg-[#FECACA] flex items-center gap-2"><i class="fa-solid fa-bug"></i>
                <span>Bug</span></p>

                <p class="font-medium text-3 leading-none bg-[#FDE68A] text-[#D97706] px-2 py-1 rounded-[10px] flex items-center gap-2"><i class="fa-regular fa-life-ring"></i>
                <span>Help wanted</span></p>
            </div>
            <hr class="border-dotted">
            <div>
                <p class="text-3 text-[#64748B] leading-none">#1 by john_doe</p>
                <p class="text-3 text-[#64748B] leading-none">1/15/2024</p>
            </div>
        </div>
        `;

        if(issue.status === 'open'){
            card.classList.add('border-top-green');
        } else {
            card.classList.add('border-top-blue');
            const statusImg = card.querySelector('#status img');
            statusImg.src = './assets/Closed-Status.png';            
        }
        cardContainer.append(card)
    }
    let cardsAmount = document.getElementById('card-container').childElementCount;
    console.log(cardsAmount);
    const counts = document.getElementById('issue-count')
    counts.innerText = cardsAmount;
    
}

function handleActive(clickedButton) {
    // 1- remove 'btn-active' class from all buttons
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.classList.remove('btn-active')
    });

    //2- add 'btn-active' class to the clicked button
    clickedButton.classList.add('btn-active');

    const id = clickedButton.id;
    if (id === 'open-btn') {
     const openIssues = allIssuesData.filter(issue => issue.status === 'open');
        loadAllCard(openIssues);
    } else if (id === 'closed-btn') {
        const closedIssues = allIssuesData.filter(issue => issue.status === 'closed');
        loadAllCard(closedIssues);
    } else {
        loadAllCard(allIssuesData);
    }
}


loadAllIssues();

// const counts = document.getElementById('issue-count')
// counts.innerText = allIssuesData.length;
// console.log(counts);