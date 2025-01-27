// ---------header------------\
const headerNavForm = document.querySelector(".header-nav-form");
const headerForm = document.querySelector(".header-form");
const headerFormLogin = headerNavForm.querySelector(".header-form-login");
const headerFormLogout = document.querySelector(".header-form-logout");
const headerNavIcon = document.querySelector('.header-nav-icon');
const searchInput = document.querySelector('.search-input input');
const login = JSON.parse(localStorage.getItem('login'));
const loader = document.getElementById('loading');
const notificationModal = document.getElementById('notification-modal');
const notificationModalMessage = notificationModal.querySelector('.form-confirm .form-confirm-top p span');
const notificationModalYesButton = notificationModal.querySelector('.yes');
const notificationModalNoButton = notificationModal.querySelector('.no');
const specialCharacterRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const logedUsername = document.querySelector('.loged-username')
const logoutButton = document.querySelector('.logout-button')
logedUsername.innerText = login.username
logoutButton.onclick = () => {
    localStorage.removeItem('login')
    window.location.href = 'http://localhost:5500/FrontEnd/Admin/login/index.html'
}

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

function fetchCustomers () {
    fetch('http://localhost:1234/api/v1/admin/all_customers', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerId: login.customerId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                const customersContainer = document.querySelector('table.container-nav');
                const responseCustomers = data.data;

                responseCustomers.forEach((customer, index) => {
                    customersContainer.innerHTML += renderCustomer(customer.customerId, customer.status, customer.username, customer.email, customer.Role.roleName, customer.Image, index);
                });

                const deleteAndActiveButtons = customersContainer.querySelectorAll('.list-content.list-action > i');
                const updateButtons = customersContainer.querySelectorAll('.list-content.list-action div i');
                updateButtons.forEach(button => {
                    button.onclick = (e) => {
                        const updateModal = document.querySelector('.update-user-modal');
                        updateModal.style.display = 'block';
                        const updateCloseButtons = document.querySelectorAll('.update-close');
                        updateCloseButtons.forEach(closeButton => {
                            closeButton.onclick = () => {
                                updateModal.style.display = 'none';
                            };
                        });
                        const updateSubmitButton = document.querySelector('button.update-user');
                        updateSubmitButton.onclick = () => {
                            const updateRequests = document.querySelectorAll('.update-user-request');
                            const updateRequestValue = [...updateRequests].reduce((prev, next) => {
                                if (next.value) {
                                    return {
                                        ...prev,
                                        [next.dataset.request]: next.value
                                    };
                                }
                                return prev;
                            }, {});
                            fetch('http://localhost:1234/api/v1/admin/update_information?target=' + e.target.parentElement.parentElement.dataset.customer, {
                                method: 'put',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ customerId: login.customerId, ...updateRequestValue })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    alert(data.message);
                                    window.location.reload();
                                });
                        };
                    };
                });
                deleteAndActiveButtons.forEach(button => {
                    button.onclick = (e) => {
                        notificationModal.style.display = 'block';
                        if (e.target.classList.contains('active')) {
                            notificationModalMessage.innerText = 'mở khóa';
                        }

                        if (e.target.classList.contains('delete')) {
                            notificationModalMessage.innerText = 'xóa';
                        }

                        notificationModalYesButton.onclick = () => {
                            const targetCustomerId = e.target.parentElement.dataset.customer;

                            if (button.classList.contains('delete')) {
                                fetch('http://localhost:1234/api/v1/admin/change_customer_status', {
                                    method: 'put',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ customerId: login.customerId, targetCustomerId, status: false })
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.code === 200) {
                                            window.location.reload();
                                            return false;
                                        }
                                    });
                            } else if (button.classList.contains('active')) {
                                fetch('http://localhost:1234/api/v1/admin/change_customer_status', {
                                    method: 'put',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ customerId: login.customerId, targetCustomerId, status: true })
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.code === 200) {
                                            window.location.reload();
                                            return false;
                                        }
                                    });
                            }
                        };

                    };
                });
            }
        });
}
fetchCustomers();

function renderCustomer (customerId, status, username, email, roleName, image, index) {
    return `<tr ${index % 2 === 0 && 'style="background-color: #F1F5F9"'} class="list-residence">
                    <td class="list-content list-status">
                        <span style="color: ${status ? 'green' : 'red'}">${status ? 'Khả dụng' : 'Vô hiệu'}</span>
                    </td>
                    <td class="list-content list-status">
                        <h4>${username}</h4>
                    </td>
                    <td class="list-content list-info"> 
                        <span>${email}</span>
                    </td>
                    <td class="list-content list-id">
                        <p>${roleName}</p>
                    </td>
                    <td class="list-content list-view">
                        <img src="${image || 'https://scr.vn/wp-content/uploads/2020/07/%E1%BA%A2nh-avt-n%E1%BB%AF-t%C3%B3c-ng%E1%BA%AFn-%C4%91%E1%BA%B9p.jpg'}" alt="">
                    </td>
                    <td data-customer="${customerId}" class="list-content list-action">
                        <div style="display: inline-block">
                            <i class="fa-solid fa-pencil"></i>
                        </div>
                        ${status ? '<i class="delete fa-solid fa-trash-can"></i>' : '<i style="color: green"class="active fa fa-check"></i>'}
                    </td>
                </tr>`;
}

searchInput.addEventListener('keypress', (e) => {
    const searchValue = e.target.value.replaceAll(' ', '_').trim();
    if (e.key === 'Enter') {
        searchInput.value = '';
        e.preventDefault();
        fetch('http://localhost:1234/api/v1/admin/all_customers/by_name/' + searchValue, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId: login.customerId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const customersContainer = document.querySelector('table.container-nav');
                    const responseCustomers = data.data;

                    const oldDatasOnUI = customersContainer.querySelectorAll('.list-residence');
                    oldDatasOnUI.forEach(item => {
                        item.parentNode.removeChild(item);
                    });
                    responseCustomers.forEach((customer, index) => {
                        customersContainer.innerHTML += renderCustomer(customer.customerId, customer.status, customer.username, customer.email, customer.Role.roleName, customer.Image, index);
                    });

                    const deleteAndActiveButtons = customersContainer.querySelectorAll('.list-content.list-action > i');
                    deleteAndActiveButtons.forEach(button => {
                        button.onclick = (e) => {
                            notificationModal.style.display = 'block';
                            if (e.target.classList.contains('active')) {
                                notificationModalMessage.innerText = 'mở khóa';
                            }

                            if (e.target.classList.contains('delete')) {
                                notificationModalMessage.innerText = 'xóa';
                            }

                            notificationModalYesButton.onclick = () => {
                                const targetCustomerId = e.target.parentElement.dataset.customer;

                                if (button.classList.contains('delete')) {
                                    fetch('http://localhost:1234/api/v1/admin/change_customer_status', {
                                        method: 'put',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ customerId: login.customerId, targetCustomerId, status: false })
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.code === 200) {
                                                window.location.reload();
                                                return false;
                                            }
                                        });
                                } else if (button.classList.contains('active')) {
                                    fetch('http://localhost:1234/api/v1/admin/change_customer_status', {
                                        method: 'put',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ customerId: login.customerId, targetCustomerId, status: true })
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.code === 200) {
                                                window.location.reload();
                                                return false;
                                            }
                                        });
                                }
                            };

                        };
                    });
                }
            });
    }
});

// ---------update account---------
// var updateAccount = document.querySelector('.update-account')
// var updateClose = document.querySelector('.update-close')
// var listAction = document.querySelector('.list-action i a')

// listAction.onclick = function () {
//     updateAccount.style.display = 'block'
// }

// updateClose.onclick = function () {
//     updateAccount.style.display = 'none'
// }

fetch('http://localhost:1234/api/v1/roles/all_roles')
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            const selectRoleElement = document.querySelector('.roles');
            const selectRoleElementInUpdateModal = document.querySelector('.update-user-request.roles');
            const roleOptions = [];
            data.data.forEach(role => {
                roleOptions.push(`<option value="${role.roleId}">${role.roleName}</option>`);
            });
            selectRoleElementInUpdateModal.innerHTML = roleOptions.join('');
            selectRoleElement.innerHTML = roleOptions.join('');
        }
    });

// ------------create new account-------
const postNewResidence = document.querySelector('.postNew-residence');
const createNewUsers = document.querySelector('.create-new-users');
const newClose = document.querySelector('.new-close');
const newRegisterButton = document.querySelector('.new-register');

postNewResidence.onclick = function (e) {
    e.preventDefault();
    createNewUsers.style.display = 'block';
};

newClose.onclick = function () {
    createNewUsers.style.display = 'none';
};

const updateRequestInputs = document.querySelectorAll('.update-user-request');
updateRequestInputs.forEach(input => {
    input.onchange = (e) => {
        let hasInvalid = false;
        if ((e.target.dataset.request === 'username' && (specialCharacterRegex.test(e.target.value) || e.target.value === " "))
            || ((e.target.dataset.request === 'password' || e.target.dataset.request === 'address') && e.target.value === " ")) {
            hasInvalid = true;
            alert('Đầu vào không hợp lệ');
        }
        if (e.target.dataset.request === 'password' && e.target.value !== " " && e.target.value && e.target.value.length < 6) {
            hasInvalid = true;
            alert('Vui lòng nhập mật khẩu tối thiểu 6 ký tự');
        }
        if (hasInvalid) {
            e.target.value = "";
        }
    };
});

const newRequestInputs = document.querySelectorAll('.new-user-request');
newRequestInputs.forEach(input => {
    input.onchange = (e) => {
        let hasInvalid = false;
        if (e.target.dataset.request === 'email' && !emailRegex.test(e.target.value)) {
            hasInvalid = true;
            alert('Trường này không phải là email');
        }

        if (hasInvalid) {
            e.target.value = "";
        }
    };
});
newRegisterButton.onclick = () => {
    const newUserRequestValues = document.querySelectorAll('.new-user-request');
    const requestValues = [...newUserRequestValues].reduce((prev, next) => {
        return {
            ...prev,
            [next.dataset.request]: next.value
        };
    }, {});
    fetch('http://localhost:1234/api/v1/auth/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestValues)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                window.location.reload();
                return false;
            } else {
                alert(data.message);
            }
        });
};

// ----------------searchResidence-----------
// const searchResidence = () => {
//     const searchInput = document.getElementById('search').value.toUpperCase();
//     const table = document.querySelector('.container-nav');
//     const listResidence = document.querySelectorAll('.list-residence');
//     const nameResidence = table.querySelectorAll('.list-status h4');

//     for (var i = 0; i < nameResidence.length; i++) {
//         let match = listResidence[i].querySelectorAll('.list-status h4')[0];

//         if (match) {
//             let textValue = match.textContent || match.innerHTML;
//             if (textValue.toUpperCase().indexOf(searchInput) > -1) {
//                 listResidence[i].style.display = "";
//             }
//             else {
//                 listResidence[i].style.display = "none";
//             }
//         }
//     }
// };
