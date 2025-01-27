// ---------header------------\
var headerNavForm = document.querySelector(".header-nav-form");
var headerForm = document.querySelector(".header-form");
var headerFormLogin = headerNavForm.querySelector(".header-form-login");
var headerFormLogout = document.querySelector(".header-form-logout");
var headerNavIcon = document.querySelector('.header-nav-icon');
var login = JSON.parse(localStorage.getItem('login'));
const loader = document.getElementById('loading');
const notificationModal = document.getElementById('notification-modal');
const notificationModalMessage = notificationModal.querySelector('.form-confirm .form-confirm-top p span');
const notificationModalYesButton = notificationModal.querySelector('.yes');
const notificationModalNoButton = notificationModal.querySelector('.no');

notificationModalNoButton.onclick = () => {
    notificationModal.style.display = 'none';
};

headerNavForm.onclick = function () {
    if (headerForm.style.display === "none") headerForm.style.display = "block";
    else {
        headerForm.style.display = "none";
    }

    handleIconLight();
};

function handleIconLight () {
    var iconList = headerNavIcon.querySelectorAll("i");
    iconList.forEach((item) => {
        if (
            (headerFormLogout && headerFormLogout.style.display !== "none") ||
            (headerFormLogin && headerFormLogin.style.display !== "none")
        ) {
            item.style.color = "#f44336";
            headerNavIcon.style.borderColor = "#f44336";
        } else {
            item.style.color = "unset";
            headerNavIcon.style.borderColor = "unset";
        }
    });
}

// ----------------searchResidence-----------
const searchResidence = () => {
    const searchInput = document.getElementById('search').value.toUpperCase();
    const table = document.querySelector('.container-nav');
    const listResidence = document.querySelectorAll('.list-residence');
    const nameResidence = table.querySelectorAll('.list-info h4');

    for (var i = 0; i < nameResidence.length; i++) {
        let match = listResidence[i].querySelectorAll('.list-info h4')[0];

        if (match) {
            let textValue = match.textContent || match.innerHTML;
            if (textValue.toUpperCase().indexOf(searchInput) > -1) {
                listResidence[i].style.display = "";
            }
            else {
                listResidence[i].style.display = "none";
            }
        }
    }
};

function fetchHotels () {
    loader.style.display = 'grid';
    fetch('http://localhost:1234/api/v1/owners/' + login.customerId + '/hotels')
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            if (data.code === 200) {
                const hotelsResponse = data.data;
                const hotelsContainer = document.querySelector('.container-nav');
                const numberOfRoomsTitle = document.querySelector('.container-header h1');
                numberOfRoomsTitle.innerText = `${hotelsResponse.length} khách sạn`;
                hotelsResponse.forEach((hotel, index) => {
                    hotelsContainer.innerHTML += renderHotel(hotel, index);
                });
                // --------------------
                const countModify = document.querySelectorAll(".modify");
                countModify.forEach(e => {
                    e.onclick = (event => {
                        const idModify = event.target.dataset.value;
                        const hotel = hotelsResponse.filter(value => value.hotelId === idModify);
                        console.log(hotelsResponse);
                        sessionStorage.setItem("hotelUpdate", JSON.stringify(hotel[0]));
                        window.location.href = "http://localhost:5500/FrontEnd/Sup_postHotel/index.html";
                    });
                });
                const residences = document.querySelectorAll('tr.list-residence');
                residences.forEach(residence => {
                    const hotelInfoTarget = residence.querySelector('.list-content.list-info div h4');
                    const deleteHotelButton = residence.querySelector('.list-content.list-action div .remove');
                    hotelInfoTarget.onclick = (e) => {
                        localStorage.setItem('targetHotelId', e.target.dataset.value);
                        window.location.href = 'http://localhost:5500/FrontEnd/Sup_myRoom/index.html';
                    };
                    deleteHotelButton.onclick = (e) => {
                        notificationModal.style.display = 'block'
                        notificationModalMessage.innerText = 'xóa'
                        notificationModalYesButton.onclick = () => {
                            loader.style.display = 'grid';
                            fetch('http://localhost:1234/api/v1/hotels/change_status/' + e.target.dataset.value, {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ status: false })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    loader.style.display = 'none';
                                    if (data.code === 200) {
                                        window.location.reload();
                                        return false;
                                    }
                                });
                        }
                    };
                });
            }
        });
}
fetchHotels();

function renderHotel (data, index) {
    console.log(data);
    return `<tr ${index % 2 === 0 && 'style="background-color: #F1F5F9"'} data-value="${data.hotelId}" class="list-residence">
                    <td class="list-content list-info"> 
                        <div href="../Sup_myRoom/index.html">
                            <h4 data-value="${data.hotelId}">${data.hotelName}</h4>
                            <span title="${data.address}">${data.address}</span>
                        </div>
                    </td>
                    <td class="list-content list-id">
                        <p>${data.hotelId}</p>
                    </td>
                    <td class="list-content list-room-count">
                        <span>${data.roomCount}</span>
                    </td>
                    <td class="list-content list-view">
                        <i class="fa-solid fa-eye"></i> <span>${data.viewNumber}</span> 
                    </td>
                    <td style="display: flex; justify-content: center" class="list-content list-action">
                        <div>
                            <i data-value="${data.hotelId}" class="fa-solid fa-pencil modify"></i>
                        </div>
                        <div>
                            <i data-value="${data.hotelId}" class="fa-solid fa-trash-can remove"></i>
                        </div>
                    </td>
                </tr>`;
}

// ---------
var headerLogoIMG = document.querySelector('.header-logo img');
headerLogoIMG.onclick = function () {
    location.href = 'http://localhost:5500/FrontEnd/home/index.html#';
}


