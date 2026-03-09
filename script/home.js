let allIssuesData = [];
const loadAllIssues = () => {
    manageSpinner(true);
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then((res) => res.json())
    .then((json) => {
        allIssuesData = json.data;
        loadAllCard(allIssuesData);
    })
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('card-container').classList.add('hidden');
    } else {
        document.getElementById('spinner').classList.add('hidden');
        document.getElementById('card-container').classList.remove('hidden');
    }
}

const loadIssueDetail = async (id) =>{
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayIssueDetail(details.data);
    
}

const displayIssueDetail = (details) =>{
    console.log(details);
    
    const detailsContainer = document.getElementById('details_container');
    detailsContainer.innerHTML =`
    <div class="space-y-3.5">
                        <div class="space-y-3.5">
                        <h2 class="font-bold text-xl text-[#1F2937]">${details.title}</h2>
                        <div class="flex gap-3 items-center">
                            <p class="text-white bg-green-500 px-2 py-1 rounded-[15px]">${details.status}</p>
                            <p class="text-sm text-[#64748B]">. ${details.status} by ${details.author}</p>
                            <p class="text-sm text-[#64748B]">. ${details.updatedAt.split('T')[0]}</p>
                        </div>
                        </div>
                        <div class="flex gap-3">
                            <p class="font-medium text-3 leading-none px-2 py-1 rounded-[10px] text-[#EF4444] bg-[#FECACA] flex items-center gap-2">
                            <span>${details.labels[0]}</span></p>

                            <p class="font-medium text-3 leading-none bg-[#FDE68A] text-[#D97706] px-2 py-1 rounded-[10px] flex items-center gap-2">
                            <span>${details.labels[1]}</span></p>
                        </div>
                        <div>
                            <p class="text-[#64748B]">${details.description}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p class="text-[#64748B]">Assignee:</p>
                            <p class="text-[#1F2937] font-semibold">${details.assignee || 'Unassigned'}</p>
                        </div>
                        <div>
                            <p class="text-[#64748B]">Priority:</p>
                            <p class="font-medium text-[16px]">${details.priority}</p>
                        </div>
                        </div>
                    </div>
    `
    document.getElementById('my_modal').showModal();
}

const loadAllCard = (issues) =>{ 
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    for(let issue of issues){
        // console.log(issue);
        const card = document.createElement('div');
        const issueDate = issue.updatedAt.split('T')[0];
        card.innerHTML = `
        <div onclick="loadIssueDetail(${issue.id})" class="bg-base-100 shadow-sm p-3 rounded-xl space-y-2 h-full">
            <div id="status" class="flex justify-between">
                <img src="assets/Open-Status.png" alt="" srcset="">
                <p class="font-medium text-3 leading-none bg-gray-100 px-2 py-1 rounded-[10px]">${issue.priority}</p>
            </div>
            <h3 class="font-semibold text-[14px] text-[#1F2937]">${issue.title}</h3>
            <p class="text-[#64748B] text-3">${issue.description}</p>
            <div class="flex gap-3">
                <p class="font-medium text-3 leading-none px-2 py-1 rounded-[10px] text-[#EF4444] bg-[#FECACA] flex items-center gap-2">
                <span>${issue.labels[0]}</span></p>

                <p class="font-medium text-3 leading-none bg-[#FDE68A] text-[#D97706] px-2 py-1 rounded-[10px] flex items-center gap-2">
                <span>${issue.labels[1]}</span></p>
            </div>
            <hr class="border-dotted">
            <div class = " flex flex-col gap-2">
                <p class="text-3 text-[#64748B] leading-none">${issue.id} by ${issue.author}</p>
                <p class="text-3 text-[#64748B] leading-none">${issueDate}</p>
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
        cardContainer.append(card);
    }
    manageSpinner(false);
    let cardsAmount = document.getElementById('card-container').childElementCount;
    // console.log(cardsAmount);
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


const searchInput = document.getElementById('input-search');
searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value;

    if (searchText.length === 0) {
        loadAllCard(allIssuesData);
        return;
    }

    manageSpinner(true);

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
        .then(res => res.json())
        .then(json => {
            loadAllCard(json.data);
            manageSpinner(false);
        });
});