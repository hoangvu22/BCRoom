// ---------header------------
var header = document.querySelector('header')
var header_logo = document.querySelector('.header-logo h1')
    window.onscroll = function () { 
        myFunction() 
        console.log(window.pageYOffset);
    };

    var navs = document.querySelectorAll('.list_city > li > a')
    function myFunction() {
        console.log(navs);
        // var header = document.querySelector('header')
        if (window.pageYOffset > 0) {
            header_logo.style.color = '#f44336'
            header.style.backgroundColor='#fff'
            navs.forEach((item, index) => {
                if(index < navs.length){
                    item.style.color = 'black'
                    hoverEvent(item.style.color)
                }
            })
        }
        else {
            header_logo.style.color = '#fff'
            header.style.backgroundColor='transparent'
            navs.forEach((item, index) => {
                if(index < navs.length){
                    item.style.color = 'white'
                    hoverEvent(item.style.color)
                }
            })
        }
    }
    function hoverEvent(color) {
        navs.forEach((item, index) => {
            if(index<navs.length-1)
            {
                item.onmouseover = function() 
                {
                    this.style.color = "#f44336";
                }
                item.onmouseleave = function() 
                {
                    this.style.color = color;
                }
            }
        })
    }

// -------------Search-------------------
const inputSearch = document.querySelector('.input-search');
const autoBox = document.querySelector('.autobox');
inputSearch.onkeyup = (e) => {
    // console.log(e.target.value);
    autoBox.style.paddingTop = "4px"
    let checkData = e.target.value;
    let dataArray = [];
    if(checkData) {
        dataArray = recomentList.filter((data) => {
            return data.toLocaleLowerCase().startsWith(checkData.toLocaleLowerCase());
        })
        dataArray = dataArray.map((data) => {
            return data = '<li>'+data+'</li>'
        })
        autoBox.classList.add('active');
        showAdress(dataArray);
        // console.log(dataArray);
        let liItem = autoBox.querySelectorAll('li');
        for(let i=0; i<liItem.length; i++) {
            liItem[i].addEventListener('click', function() {
                inputSearch.value = liItem[i].innerHTML;
                autoBox.classList.remove('active');
            })
        }
    }
    else {
        autoBox.classList.remove('active');
        autoBox.style.paddingTop = "0px"
    }
}
function showAdress(list) {
    let listData;
    if(!list.length) {
        listData = '<li>'+inputSearch.value+'</li>'
    }
    else {
        listData = list.join('');
    }
    autoBox.innerHTML = listData;
}
let recomentList = [
   'Sơn Trà',
   'Ngũ Hành Sơn',
   'Hải Châu',
   'Thanh Khê',
   'Liên Chiểu',
   'Cẩm Lệ',
   'Hòa Vang',
   'Hoàng Sa',
];

// -------------Number of peolpe-------------
const inputNumber = document.querySelector('.number-people')
const numberBox = document.querySelector('.number-box')
const numberClose = document.querySelector('.number-close')

inputNumber.addEventListener('click', function() {
    numberBox.classList.add('active')
})
numberClose.addEventListener('click', function() {
    numberBox.classList.remove('active')
})

document.addEventListener('keydown', function(e) {
    if(e.keyCode == 27) {
        numberBox.classList.remove('active');
    }
})

const adultPlus = document.querySelector('.adultPlus')
const adultMinus = document.querySelector('.adultMinus')
let adultValue = document.querySelector('.adult span')
let i = 0;
adultPlus.addEventListener('click', function() {
    i = i+1;
    adultValue.innerHTML = i;
    totalNumber()
})
adultMinus.addEventListener('click', function() {
    if (i <= 0) {
        i = 0;
    }
    else {
        i = i-1;
        adultValue.innerHTML = i;
        totalNumber()
    }
})

const childPlus = document.querySelector('.childPlus')
const childMinus = document.querySelector('.childMinus')
let childValue = document.querySelector('.child span')
let j = 0;
childPlus.addEventListener('click', function() {
    j = j+1;
    childValue.innerHTML = j;
    totalNumber()
})
childMinus.addEventListener('click', function() {
    if (j <= 0) {
        j = 0;
    }
    else {
        j = j-1;
        childValue.innerHTML = j;
        totalNumber()
    }
})

const roomPlus = document.querySelector('.roomPlus')
const roomMinus = document.querySelector('.roomMinus')
let roomValue = document.querySelector('.room span')
let k = 0;
roomPlus.addEventListener('click', function() {
    k = k+1;
    roomValue.innerHTML = k;
    totalNumber()
})
roomMinus.addEventListener('click', function() {
    if (k <= 0) {
        k = 0;
    }
    else {
        k = k-1;
        roomValue.innerHTML = k;
        totalNumber()
    }
})

function totalNumber() {
    total = i + j + k;
    inputNumber.value = i + j + " Người, " + k + " phòng";
}  

// ---------------detail room------------
var images = document.querySelectorAll('.detail-room-img');
var prev = document.querySelector('.prev');
var next = document.querySelector('.next');
var close = document.querySelector('.close');
var galleryImg = document.querySelector('.gallery-inner img');
var gallery = document.querySelector('.gallery');

var currentIndex = 0;

function showGallery() {
    if(currentIndex == 0) {
        prev.classList.add('hide');
    }
    else {
        prev.classList.remove('hide');
    }

    if(currentIndex == images.length - 1) {
        next.classList.add('hide');
    }
    else {
        next.classList.remove('hide');
    }

    // display
    galleryImg.src = images[currentIndex].src;
    gallery.classList.add('show');
    header.style.display = 'none';
}

images.forEach((item, index) => {
    item.addEventListener('click', function() {
        currentIndex = index;
        showGallery();
    })
})

close.onclick = function() {
    gallery.classList.remove('show');
    header.style.display = 'block';
}
// close.addEventListener('click', function() {
//     gallery.classList.remove('show');
//     // console.log(close, gallery);
// })

document.addEventListener('keydown', function(e) {
    if(e.keyCode == 27) {
        gallery.classList.remove('show');
    }
})

prev.addEventListener('click', function() {
    if(currentIndex > 0) {
        currentIndex--;
        showGallery();
    }
})

next.addEventListener('click', function() {
    if(currentIndex < images.length - 1) {
        currentIndex++;
        showGallery();
    }
})