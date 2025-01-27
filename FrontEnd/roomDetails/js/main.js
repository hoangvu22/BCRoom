const hotelId = JSON.parse(localStorage.getItem("targetHotelId"));
const reviewButton = document.querySelector("button.btn-cmt");
// ---------header------------
var header = document.querySelector("header");
// var header_logo = document.querySelector(".header-logo h1");
var headerNavIcon = document.querySelector(".header-nav-icon");
const loader = document.getElementById('loading');

const reviewImageModal = document.getElementById('review-img-modal');


window.onscroll = function () {
    myFunction();
};

// upload images for review
const uploadImageForReview = document.querySelector('.input-img-review');
const uploadImageReviewContainer = document.querySelector('.upload-img-review');
let reviewImages = [];
uploadImageForReview.onchange = (e) => {
    if (e.target.files[0].type.includes('image')) {
        const formData = new FormData();
        formData.append('thumbnail', e.target.files[0]);
        formData.append('directory', 'thumbnails');

        fetch('http://localhost:1234/api/v1/upload/upload_thumbnail', {
            method: 'post',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const html = `<div class="img-review-item">
                        <img src="${data.data.fileUrl}" alt="">
                            <div class="img-review-close">
                                <i data-name="${data.data.filename}" data-fileurl="${data.data.fileUrl}" class="fa-solid fa-xmark"></i>
                            </div>
                        </div>`;
                    uploadImageReviewContainer.innerHTML += html;
                    reviewImages.push({ url: data.data.fileUrl, name: data.data.filename });

                    const deleteReviewImageButtons = document.querySelectorAll('.img-review-item div i');
                    deleteReviewImageButtons.forEach(deleteButton => {
                        deleteButton.onclick = (e) => {
                            fetch('http://localhost:1234/api/v1/upload/remove_thumbnail', {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ filename: e.target.dataset.name })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.code === 200) {
                                        uploadImageReviewContainer.removeChild(e.target.parentNode.parentNode);
                                        reviewImages = reviewImages.filter(image => image.name !== e.target.dataset.name);
                                    }
                                });
                        };
                    });
                }
            });
    }
};

// ---------- hotel's images -------------
const imageHotelContainer = document.querySelector(".detail-room.wraper2");
function fetchImagesOfHotel () {
    fetch("http://localhost:1234/api/v1/images/images_of_hotel/" + hotelId)
        .then((response) => response.json())
        .then((data) => {
            if (data.code === 200) {
                if (data.data.length === 0) {
                    imageHotelContainer.remove();
                }
                data.data.forEach((image, index) => {
                    const html = `<img data-id="${image.imageId}" src="${image.url}" class="detail-room-img" alt="">`;
                    if (index === 0) {
                        imageHotelContainer.querySelector(".detail-room-left").innerHTML =
                            html;
                    }
                    if (index === 1 || index === 2 || index === 3) {
                        imageHotelContainer.querySelector(
                            ".detail-room-right .detail-room-right-top"
                        ).innerHTML += html;
                    }
                    if (index === 4 || index === 5 || index === 6) {
                        imageHotelContainer.querySelector(
                            ".detail-room-right .detail-room-right-bottom"
                        ).innerHTML += html;
                    }
                });
                Detailroom();
            }
        });
}
fetchImagesOfHotel();

function modalRoom (roomNumber, arrimg, services, servicesInRoom) {
    console.log(services);
    return `<div class="show-detail-room" style="display: flex;">
    <div class="detail-image-room">
        <div class="image-room-main">
            <img class="showing-image img-feature" src=${arrimg[0]?.url}>
            <div class="img-control prev-control">
                <i class="fa-solid fa-chevron-left"></i>
            </div>
            <div class="img-control next-control">
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        <div class="list-image">
            ${arrimg
            .map((e) => {
                return `<div><img src=${e.url} alt=""></div>`;
            })
            .join("")}
        </div>
    </div>
    <div class="detail-content-room">
        <h1>${roomNumber}</h1>
        <div class="convenient">
            ${[...servicesInRoom]
            .map((service) => {
                return `<div class="room-type">
                            <i class="${service.children[0].className}"></i>
                            <span>${service.children[1].textContent}</span>
                        </div>`;
            })
            .join("")}
        </div>
        <div class="convenient-room">
            <h1>Tiện nghi phòng</h1>
            <ul>
                ${services.map(service => `<li>${service.serviceName}</li>`).join('')}
            </ul>
        </div>
        
    </div>
    <div class="room-close">
        <i class="fa-solid fa-xmark"></i>
    </div>

    <div class="detail-content">
        <div class="choose-payment">
            <p>Lựa chọn thanh toán của quý khách</p>
            <p class="question-payment">Quý vị có thể thu tiền qua thẻ tín dụng tại chỗ nghỉ không?</p> 
            <div class="radio-block-1">
                <div class="radio-yes">
                    <input id="yes" name="radio" class="radio-input" type="radio">
                    <label for="yes">Có</label>
                </div>
                <div class="radio-no">
                    <input id="no" name="radio" class="radio-input" type="radio">
                    <label for="no">Không</label>
                </div>
            </div>
            <div class="creditcard-section">
                <div class="creditcard-left">
                    <div class="creditcard-item">
                        <input id="momo" type="radio" name="radio">
                        <img src="../image/creditcard/momo.png" alt="">
                        <label for="momo">MoMo</label>
                    </div>
                    <div class="creditcard-item">
                        <input id="paypal" type="radio" name="radio">
                        <img src="../image/creditcard/payPal.png" alt="">
                        <label for="paypal">PayPal</label>
                    </div>
                    <div class="creditcard-item">
                        <input id="zaloPay" type="radio" name="radio">
                        <img src="../image/creditcard/ZaloPay.png" alt="">
                        <label for="zaloPay">ZaloPay</label>
                    </div>
                </div>
                <div class="creditcard-right">
                    <div class="creditcard-item">
                        <input id="agribank" type="radio" name="radio">
                        <img src="../image/creditcard/agribank.png" alt="">
                        <label for="agribank">Agribank</label>
                    </div>
                    <div class="creditcard-item">
                        <input id="vietcombank" type="radio" name="radio">
                        <img src="../image/creditcard/Vietcombank.jpg" alt="">
                        <label for="vietcombank">Vietcombank</label>
                    </div>
                    <div class="creditcard-item">
                        <input id="techcombank" type="radio" name="radio">
                        <img src="../image/creditcard/Techcombank.png" alt="">
                        <label for="techcombank">Techcombank</label>
                    </div>
                </div>
            </div>
            <div class="cash-section">
                <p>Chúng tôi sẽ thông báo với khách rằng Quý vị chỉ chấp nhận thanh toán bằng tiền mặt.</p>
            </div>

            <div class="reserve reserve1">
                <button>Đặt ngay</button>
            </div>
            <div class="payclose">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    </div>
</div>`;
}
const rooms = JSON.parse(localStorage.getItem("rooms"));
const room = rooms.map((value) => {
    console.log(value);
    return ` <tr class="list-residence">
                        <td class="list-content list-status">
                            <b class="name-room" data-idroom=${value.roomId
        }>Phòng ${value.roomNumber}</b>
                            <div class="convenient">
                            <div class="room-type">
                            <i class="fa-solid fa-bed"></i>
                            <span>${value.roomType.typeName}</span>
                            </div>
                            <div class="room-type">
                                <i class="fa-solid fa-wifi"></i>
                                <span>Wifi miễn phí</span>
                            </div>
                            <div class="room-type">
                                <i class="fa-solid fa-snowflake"></i>
                                <span>Điều hòa không khí</span>
                            </div>
                            </div>
                        </td>
                        <td class="list-content list-people">
                            <span>${value.adultNumber + value.kidNumber
        } người</span>
                        </td>
                        <td class="list-content list-info">
                            <span>${value.price} VNĐ</span>
                        </td>
                        <td class="list-content">
                            <span style="color: ${value.isBooking ? 'red' : 'green'}">${value.isBooking ? 'Đã được đặt' : 'Chưa được đặt'}</span> 
                        </td>
                        <td class="list-content list-id">
                            <button data-idroom = ${value.roomId
        } class="booking_room">Đặt phòng</button>
                        </td>
                    </tr>`;
});
const containernav = document.querySelector(".conatiner_rooms");
containernav.innerHTML = `
<tr> <th>SỐ PHÒNG</th><th>PHÙ HỢP CHO</th><th>GIÁ MỖI ĐÊM</th><th>TRẠNG THÁI</th><th>ĐẶT PHÒNG</th> </tr>
${room.join("")}`;
var nameRooms = document.querySelectorAll(".name-room");

[...nameRooms].forEach(nameRoom => {
    nameRoom.onclick = function (e) {
        const idroom = e.target.dataset.idroom;
        const roomNumber =
            e.target.parentNode.querySelector("b.name-room").textContent;
        const servicesInRoom =
            e.target.parentNode.querySelector(".convenient").children;
        fetch(`http://localhost:1234/api/v1/images/images_of_room/${idroom}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200) {
                    console.log(data.data);
                    const modalContainer = document.querySelector(".modal-container");
                    modalContainer.style.display = "block";
                    const services = JSON.parse(localStorage.getItem('rooms')).find(room => room.roomId === idroom).services;
                    console.log(services);
                    modalContainer.innerHTML = modalRoom(
                        roomNumber,
                        data.data,
                        services,
                        servicesInRoom
                    );
                    const closeModalButton = document.querySelector(".room-close");
                    const imagesInModal =
                        modalContainer.querySelector(".list-image").children;
                    const imagesInModalArray = [...imagesInModal];
                    imagesInModalArray.forEach((image) => {
                        image.onclick = (e) => {
                            document.querySelector(".showing-image").src = e.target.src;
                        };
                    });

                    closeModalButton.onclick = (e) => {
                        const modalShowRoomDetail =
                            document.querySelector(".show-detail-room");
                        modalShowRoomDetail.remove();
                        modalContainer.style.display = "none";
                    };
                    var listImage = document.querySelectorAll(".list-image img");
                    var prevControl = document.querySelector(".prev-control");
                    var imgFeature = document.querySelector(".img-feature");
                    var nextControl = document.querySelector(".next-control");
                    var roomClose = document.querySelector(".room-close i");
                    var showDetailRoom = document.querySelector(".show-detail-room");

                    var indexCurrent = 0;
                    function updateImageByindex (index = 0) {
                        // remove active class
                        document.querySelectorAll(".list-image div").forEach((item) => {
                            item.classList.remove("active1");
                        });
                        indexCurrent = index;
                        imgFeature.src = listImage[index].getAttribute("src");
                        listImage[index].parentElement.classList.add("active1");
                    }

                    listImage.forEach((imgElement, index) => {
                        imgElement.addEventListener("click", (e) => {
                            updateImageByindex(index);
                        });
                    });

                    prevControl.addEventListener("click", (e) => {
                        if (indexCurrent == 0) {
                            indexCurrent = listImage.length - 1;
                        } else {
                            indexCurrent--;
                        }
                        updateImageByindex(indexCurrent);
                    });

                    nextControl.addEventListener("click", (e) => {
                        if (indexCurrent == listImage.length - 1) {
                            indexCurrent = 0;
                        } else {
                            indexCurrent++;
                        }
                        updateImageByindex(indexCurrent);
                    });

                    roomClose.onclick = function () {
                        showDetailRoom.style.display = "none";
                    };
                    Payment();
                    updateImageByindex(0);
                } else {
                    alert("ko co anh");
                }
            });
    };
});

const bookingRooms = document.querySelectorAll(".booking_room");
bookingRooms.forEach(bookingRoom => {
    bookingRoom.onclick = (e) => {
        const roomId = e.target.dataset.idroom;
        const bookingRequestValues = document.querySelectorAll(".booking-request");
        const request = [...bookingRequestValues].reduce((prev, next) => {
            let value = next.value;
            if (next.dataset.request.includes("Number")) {
                value = parseInt(value);
            }
            if (next.dataset.request.includes("date")) {
                value = value.split("-").reverse().join("-");
            }
            return {
                ...prev,
                [next.dataset.request]: value,
            };
        }, {});

        request.customerId = JSON.parse(localStorage.getItem("login")).customerId;
        request.roomId = roomId;
        fetchBooking(request);
    };
});

function fetchBooking (data) {
    loader.style.display = 'grid';
    fetch("http://localhost:1234/api/v1/core/booking", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            loader.style.display = 'none';
            if (data.code === 200) {
                alert(data.message);
                localStorage.setItem('targetBookingIdForPayment', data.data);
                window.location.href = 'http://localhost:5500/FrontEnd/payment/index.html';
            } else {
                alert(data.message);
            }
        });
}

var navs = document.querySelectorAll(".list_city > li > a");
function myFunction () {
    var header = document.querySelector("header");
    if (window.pageYOffset > 0) {
        // header_logo.style.color = "#f44336";
        header.style.backgroundColor = "#fff";
        navs.forEach((item, index) => {
            if (index < navs.length) {
                item.style.color = "black";
                headerNavIcon.style.color = "black";
                if (headerNavIcon.style.borderColor !== "rgb(244, 67, 54)") {
                    headerNavIcon.style.borderColor = "black";
                }
                hoverEvent(item.style.color);
            }
        });
    } else {
        // header_logo.style.color = "#fff";
        header.style.backgroundColor = "transparent";
        navs.forEach((item, index) => {
            if (index < navs.length) {
                item.style.color = "white";
                headerNavIcon.style.color = "white";
                if (headerNavIcon.style.borderColor !== "rgb(244, 67, 54)") {
                    headerNavIcon.style.borderColor = "white";
                }
                hoverEvent(item.style.color);
            }
        });
    }
}
function hoverEvent (color) {
    navs.forEach((item, index) => {
        if (index < navs.length - 1) {
            item.onmouseover = function () {
                this.style.color = "#f44336";
            };
            item.onmouseleave = function () {
                this.style.color = color;
            };
        }
    });
}

var headerNavForm = document.querySelector(".header-nav-form");
var headerForm = document.querySelector(".header-form");
var headerFormLogin = headerNavForm.querySelector(".header-form-login");
var headerFormLogout = document.querySelector(".header-form-logout");
var login = JSON.parse(localStorage.getItem("login"));

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

// -------------Search-------------------
const inputSearch = document.querySelector(".input-search");
const autoBox = document.querySelector(".autobox");
inputSearch.onkeyup = (e) => {
    autoBox.style.paddingTop = "4px";
    let checkData = e.target.value;
    let dataArray = [];
    if (checkData) {
        dataArray = recomentList.filter((data) => {
            return data.toLocaleLowerCase().startsWith(checkData.toLocaleLowerCase());
        });
        dataArray = dataArray.map((data) => {
            return (data = "<li>" + data + "</li>");
        });
        autoBox.classList.add("active");
        showAdress(dataArray);
        let liItem = autoBox.querySelectorAll("li");
        for (let i = 0; i < liItem.length; i++) {
            liItem[i].addEventListener("click", function () {
                inputSearch.value = liItem[i].innerHTML;
                autoBox.classList.remove("active");
            });
        }
    } else {
        autoBox.classList.remove("active");
        autoBox.style.paddingTop = "0px";
    }
};
function showAdress (list) {
    let listData;
    if (!list.length) {
        listData = "<li>" + inputSearch.value + "</li>";
    } else {
        listData = list.join("");
    }
    autoBox.innerHTML = listData;
}
let recomentList = [
    "Sơn Trà",
    "Ngũ Hành Sơn",
    "Hải Châu",
    "Thanh Khê",
    "Liên Chiểu",
    "Cẩm Lệ",
    "Hòa Vang",
    "Hoàng Sa",
];

// -------------Number of peolpe-------------
const inputNumber = document.querySelector(".number-people");
const numberBox = document.querySelector(".number-box");
const numberClose = document.querySelector(".number-close");

inputNumber.addEventListener("click", function () {
    numberBox.classList.add("active");
});
numberClose.addEventListener("click", function () {
    numberBox.classList.remove("active");
});

document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
        numberBox.classList.remove("active");
    }
});

const adultPlus = document.querySelector(".adultPlus");
const adultMinus = document.querySelector(".adultMinus");
let adultValue = document.querySelector(".adult span");
let i = 0;
adultPlus.addEventListener("click", function () {
    i = i + 1;
    adultValue.innerHTML = i;
    totalNumber();
});
adultMinus.addEventListener("click", function () {
    if (i <= 0) {
        i = 0;
    } else {
        i = i - 1;
        adultValue.innerHTML = i;
        totalNumber();
    }
});

const childPlus = document.querySelector(".childPlus");
const childMinus = document.querySelector(".childMinus");
let childValue = document.querySelector(".child span");
let j = 0;
childPlus.addEventListener("click", function () {
    j = j + 1;
    childValue.innerHTML = j;
    totalNumber();
});
childMinus.addEventListener("click", function () {
    if (j <= 0) {
        j = 0;
    } else {
        j = j - 1;
        childValue.innerHTML = j;
        totalNumber();
    }
});

const roomPlus = document.querySelector(".roomPlus");
const roomMinus = document.querySelector(".roomMinus");
let roomValue = document.querySelector(".room span");
let k = 0;
roomPlus.addEventListener("click", function () {
    k = k + 1;
    roomValue.innerHTML = k;
    totalNumber();
});
roomMinus.addEventListener("click", function () {
    if (k <= 0) {
        k = 0;
    } else {
        k = k - 1;
        roomValue.innerHTML = k;
        totalNumber();
    }
});

function totalNumber () {
    total = i + j + k;
    inputNumber.value = i + j + " Người, " + k + " phòng";
}

// ---------------detail room------------
function Detailroom () {
    var images = document.querySelectorAll(".detail-room-img");
    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    var close = document.querySelector(".close");

    var galleryImg = document.querySelector(".gallery-inner img");
    var gallery = document.querySelector(".gallery");

    var currentIndex = 0;

    function showGallery () {
        if (currentIndex == 0) {
            prev.classList.add("hide");
        } else {
            prev.classList.remove("hide");
        }

        if (currentIndex == images.length - 1) {
            next.classList.add("hide");
        } else {
            next.classList.remove("hide");
        }

        // display
        galleryImg.src = images[currentIndex].src;
        gallery.classList.add("show");
        header.style.display = "none";
    }

    images.forEach((item, index) => {
        item.addEventListener("click", function () {
            currentIndex = index;
            showGallery();
        });
    });

    close.onclick = function () {
        gallery.classList.remove("show");
        header.style.display = "block";
    };

    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 27) {
            gallery.classList.remove("show");
        }
    });

    prev.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            showGallery();
        }
    });

    next.addEventListener("click", function () {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showGallery();
        }
    });
}

// -----------function booked------
var comments = document.querySelector(".comments");
var formSubmitA = document.querySelector(".form-submit a");
if (!localStorage.getItem("login")) {
    formSubmitA.onclick = () => {
        formSubmitA.href = "http://127.0.0.1:5500/FrontEnd/signin/index.html";
    };
    comments.style.display = "none";
} else {
    comments.style.display = "block";
}

// ---------light star comment-----------
let ratingcount = 0;
var cmtIcon = document.querySelectorAll(".cmt-icon i");
cmtIcon.forEach((i, ind) => {
    i.onclick = function (e) {
        if (
            e.target.style.color === "rgb(255, 188, 57)" &&
            ind === ratingcount - 1
        ) {
            cmtIcon.forEach((i) => {
                i.style.color = "rgb(218, 220, 221)";
            });
            ratingcount = 0;
        } else {
            cmtIcon.forEach((i) => {
                i.style.color = "rgb(218, 220, 221)";
            });
            cmtIcon.forEach((i, index) => {
                if (ind >= index) {
                    i.style.color = "rgb(255, 188, 57)";
                }
            });
            ratingcount = ind + 1;
        }
    };
});

// ------------ loại phòng -----------

// ---------------- slide room---------
// var imgFeature = document.querySelector(".img-feature");
// var listImage = document.querySelectorAll(".list-image img");
// var prevControl = document.querySelector(".prev-control");
// var nextControl = document.querySelector(".next-control");

// var indexCurrent = 0;
// function updateImageByindex(index) {
//     // remove active class
//     document.querySelectorAll('.list-image div').forEach(item => {
//         item.classList.remove('active1')
//     })
//     indexCurrent = index
//     imgFeature.src = listImage[index].getAttribute('src')
//     listImage[index].parentElement.classList.add('active1')
// }

// listImage.forEach((imgElement, index) => {
//     imgElement.addEventListener('click', e => {
//         updateImageByindex(index)

//     })
// })

// prevControl.addEventListener('click', e => {
//     if(indexCurrent == 0) {
//         indexCurrent = listImage.length - 1
//     }
//     else {
//         indexCurrent--
//     }
//     updateImageByindex(indexCurrent)
// })

// nextControl.addEventListener('click', e => {
//     if(indexCurrent == listImage.length - 1) {
//         indexCurrent = 0
//     }
//     else {
//         indexCurrent++
//     }
//     updateImageByindex(indexCurrent)
// })

// roomClose.onclick = function () {
//     showDetailRoom.style.display = 'none'
// }

// updateImageByindex(0)

// ---------------- payment -----------------
function Payment () {
    var radioYes = document.querySelector(".radio-yes");
    var radioNo = document.querySelector(".radio-no");
    var creditcardSection = document.querySelector(".creditcard-section");
    var cashSection = document.querySelector(".cash-section");
    var payclose = document.querySelector(".payclose");
    var choosePayment = document.querySelector(".choose-payment");
    var reserve = document.querySelector(".reserve button");

    radioYes.onclick = function () {
        creditcardSection.style.display = "flex";
        cashSection.style.display = "none";
    };

    radioNo.onclick = function () {
        creditcardSection.style.display = "none";
        cashSection.style.display = "block";
    };

    payclose.onclick = function () {
        choosePayment.style.display = "none";
    };

    reserve.onclick = function (e) {
        // e.preventDefault()
        choosePayment.style.display = "block";
    };
}
// ---------render tên quận huyện--------
const place = JSON.parse(localStorage.getItem("place"));

fetch("http://localhost:1234/api/v1/hotels/get_by_id/" + hotelId)
    .then((response) => response.json())
    .then((data) => {
        if (data.code === 200) {
            console.log(data.data)
            let stars = []
            const starNumbers = document.querySelector('.rooms-star')
            for (let i = 0; i < data.data.starNumber;i++) {
                stars.push('<i class="rooms-star-rating fa-solid fa-star"></i>')
            }
            starNumbers.innerHTML = stars.join('')

            const description = document.querySelector('.info-container-content')
            description.innerText = data.data.description

            const headerPath = document.querySelector(".header-path");
            headerPath.innerHTML = `<li><a href="../home/index.html">Trang chủ</a></li>
                            <li><a href="">${place.replaceAll(
                "_",
                " "
            )}</a></li>
                            <p>
                                <div class="header-path-name">Đặt phòng Khách Sạn > ${data.data.hotelName
                }</div>
                            </p>`;
            const hotelNameMainTitle = document.querySelector('.room-name span');
            hotelNameMainTitle.innerText = data.data.hotelName;
            const hotelAddressMainTitle = document.querySelector('.rooms-address p');
            hotelAddressMainTitle.innerText = data.data.address;
            const averageReviewStar = document.querySelector('.review-star1');
            console.log(data.data.averageReviewStar);
            averageReviewStar.innerText = isNaN(data.data.averageReviewStar) ? "0" : data.data.averageReviewStar.toFixed(1);
            const totalReview = document.querySelector('.review-star3 span');
            totalReview.innerText = data.data.totalReview;
        }
    });

// ------------gg map------------
const key = "Xx2LVdpWdk1UyVYRKzN0";
const map = new maplibregl.Map({
    container: "map", // container id
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`, // style URL
    center: [108.203403, 16.039226], // starting position [lng, lat]
    zoom: 10, // starting zoom
});
map.addControl(new maplibregl.NavigationControl(), "top-right");
class searchControl {
    onAdd (map) {
        this._map = map;
        this._container = document.createElement("div");
        this._container.className = "maplibregl-ctrl";
        const _input = document.createElement("input");
        this._container.appendChild(_input);
        const geocoder = new maptiler.Geocoder({
            input: _input,
            key: key,
        });
        geocoder.on("select", function (item) {
            map.fitBounds(item.bbox);
            const marker = new maplibregl.Marker().setLngLat(item.center).addTo(map);
        });
        return this._container;
    }
    onRemove () {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
const marker = new maplibregl.Marker();

map.addControl(new searchControl(), "top-left");

// --------------------review--------------
reviewButton.onclick = (e) => {
    const reviewContent = document.querySelector(
        ".cmt-text.review-request"
    ).value;

    const customerId = JSON.parse(localStorage.getItem("login")).customerId;
    if (!hotelId) {
        alert("Không tìm thấy hotel muốn review");
        return;
    }
    if (!reviewContent) {
        alert("Vui lòng nhập nội dung review");
        return;
    }
    newReview({
        customerId,
        hotelId,
        content: reviewContent,
        starNumber: ratingcount,
        images: reviewImages
    });
    uploadImageReviewContainer.innerHTML = [].join('');
    reviewImages = [];
    cmt = [{
        customerId,
        hotelId,
        content: reviewContent,
        starNumber: ratingcount,
    }];
    document.querySelector(".cmt-text.review-request").value = "";
};
function commentsroom () {
    const formReviews = document.querySelector(".form-reviews");
    fetch(`http://localhost:1234/api/v1/reviews/reviews_of_hotel/${hotelId}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.code === 200) {
                const totalReview = document.querySelector('.review-star3 span');
                totalReview.innerText = data.data.length;
                const averageReviewStar = document.querySelector('.review-star1');
                const avarageStar = data.data.reduce((prev, next) => prev + next.starNumber, 0) / data.data.length;
                averageReviewStar.innerText = isNaN(avarageStar) ? "0" : avarageStar.toFixed(1);
                data.data.sort((a, b) => {
                    const dataPrev = new Date(a.createdAt);
                    const dataNext = new Date(b.createdAt);
                    return dataPrev - dataNext;
                });
                console.log(data.data);
                const comment = data.data.reverse().map((e, index) => {
                    const date = new Date(e.createdAt);
                    return index < 6
                        ? handleRenderCommentList(
                            e.reviewId,
                            e.Customer.Image?.url,
                            e.Customer.username,
                            date.getDate(),
                            date.getMonth() + 1,
                            date.getFullYear(),
                            e.content,
                            e.starNumber,
                            e.Images
                        )
                        : "";
                });
                formReviews.innerHTML = comment.join("");
                const reviewImages = document.querySelectorAll('.review-image');
                reviewImages.forEach(image => {
                    image.onclick = (e) => {
                        reviewImageModal.style.display = 'block';
                        const reviewImageModalContent = document.querySelector('#review-img-modal div img');
                        reviewImageModalContent.src = e.target.src;
                    };
                });
            }
        });
}
commentsroom();

function newReview (data) {
    fetch("http://localhost:1234/api/v1/reviews/review_hotel", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            commentsroom();
            fetch(`http://localhost:1234/api/v1/reviews/reviews_of_hotel/${hotelId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.code === 200) {
                        if (data.data.length < 7) {
                            showMoreSpan.style.display = "none";
                        } else {
                            showMoreSpan.onclick = function () {
                                formShowMore.style.display = "block";
                                data.data.sort((a, b) => {
                                    const dataPrev = new Date(a.createdAt);
                                    const dataNext = new Date(b.createdAt);
                                    return dataPrev - dataNext;
                                });
                                const comment = data.data.reverse().map((e, index) => {
                                    const date = new Date(e.createdAt);
                                    return handleRenderCommentList(
                                        e.reviewId,
                                        e.Customer.Image?.url,
                                        e.Customer.username,
                                        date.getDate(),
                                        date.getMonth() + 1,
                                        date.getFullYear(),
                                        e.content,
                                        e.starNumber,
                                        e.Images
                                    );
                                });
                                formShowMore.innerHTML =
                                    `<div class="cmt-close">
                                <i class="fa-solid fa-xmark"></i>
                            </div>`+ `<h3>Tất cả đánh giá</h3>` +
                                    comment.join("")
                                    ;
                                var cmtClose = document.querySelector(".cmt-close");
                                cmtClose.onclick = function () {
                                    formShowMore.innerHTML = "";
                                    formShowMore.style.display = "none";
                                };

                                const reviewImages = document.querySelectorAll('.review-image');
                                reviewImages.forEach(image => {
                                    image.onclick = (e) => {
                                        reviewImageModal.style.display = 'block';
                                        const reviewImageModalContent = document.querySelector('#review-img-modal div img');
                                        reviewImageModalContent.src = e.target.src;
                                    };
                                });
                            };
                        }
                    }
                });
            commentsroom();
        });
}

// -------------form show more comment-----------
var showMoreSpan = document.querySelector(".show-more span");
var formShowMore = document.querySelector(".form-show-more");

fetch(`http://localhost:1234/api/v1/reviews/reviews_of_hotel/${hotelId}`)
    .then((res) => res.json())
    .then((data) => {
        if (data.code === 200) {
            if (data.data.length < 7) {
                showMoreSpan.style.display = "none";
            } else {
                showMoreSpan.onclick = function () {
                    formShowMore.style.display = "block";
                    data.data.sort((a, b) => {
                        const dataPrev = new Date(a.createdAt);
                        const dataNext = new Date(b.createdAt);
                        return dataPrev - dataNext;
                    });

                    const comment = data.data.reverse().map((e, index) => {
                        const date = new Date(e.createdAt);
                        return handleRenderCommentList(
                            e.reviewId,
                            e.Customer.Image?.url,
                            e.Customer.username,
                            date.getDate(),
                            date.getMonth() + 1,
                            date.getFullYear(),
                            e.content,
                            e.starNumber,
                            e.Images
                        );
                    });
                    formShowMore.innerHTML =
                        `<div class="cmt-close">
                          <i class="fa-solid fa-xmark"></i>
                      </div>`+ `<h3>Tất cả đánh giá</h3>` +
                        comment.join("")
                        ;
                    var cmtClose = document.querySelector(".cmt-close");
                    cmtClose.onclick = function () {
                        formShowMore.innerHTML = "";
                        formShowMore.style.display = "none";
                    };

                    const reviewImages = document.querySelectorAll('.review-image');
                    reviewImages.forEach(image => {
                        image.onclick = (e) => {
                            reviewImageModal.style.display = 'block';
                            const reviewImageModalContent = document.querySelector('#review-img-modal div img');
                            reviewImageModalContent.src = e.target.src;
                        };
                    });
                };
            }
        }
    });
function starPoint (stars) {
    let star = [];
    for (let i = 0; i < stars; i++) {
        star.push(`<i class="fa-solid fa-star"></i>`);
    }
    return star.join("");
}
function handleRenderCommentList (
    reviewid,
    avatar,
    username,
    date,
    month,
    year,
    content,
    star,
    images
) {
    return `
    <div id=${reviewid} class="wrap-reviews">
        <div class="wrap-reviews-top">
            <img class="review-avatar" src=${avatar ||
        "https://scr.vn/wp-content/uploads/2020/07/%E1%BA%A2nh-avt-n%E1%BB%AF-t%C3%B3c-ng%E1%BA%AFn-%C4%91%E1%BA%B9p.jpg"
        } alt="">
            <div class="review-info">
                <span class="review-name">${username}</span> <br>
                <div class="review-rate-star">
                ${starPoint(star)}
                </div>
                <span class="review-date">${date}/${month}/${year}</span>
            </div>
        </div>
        <div class="wrap-reviews-bottom">${content}</div>
        <div ${images.length === 0 && 'style="display: none"'} class="show-img-review">
            ${images.map(image => `<img class="review-image" src="${image.url}">`).join('')}
        </div>
    </div>`;
}

// ---------
var headerLogoIMG = document.querySelector('.header-logo img');
headerLogoIMG.onclick = function () {
    location.href = 'http://localhost:5500/FrontEnd/home/index.html#';
};

// -------upload file img------
const iconUploadImg = document.querySelector('.icon-upload-img');
const inputImgReview = document.querySelector('.input-img-review');

iconUploadImg.addEventListener("click", function () {
    inputImgReview.click();
});

// ------ review image modal --------
const closeReviewImageModalButton = document.querySelector('#review-img-modal div .close');
closeReviewImageModalButton.onclick = () => {
    reviewImageModal.style.display = 'none';
};

fetch(`http://localhost:1234/api/v1/customers/has_booking_room_of_hotel?customerId=${login.customerId}&hotelId=${hotelId}`)
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            const commentInputContainer = document.querySelector('.comments')
            commentInputContainer.style.display = data.data ? 'block' : 'none'
        } else {
            alert(data.message)
        }
    })