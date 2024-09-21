const apiUrl = 'http://localhost:3000/api';
const tokenKey = 'token';

// Handle user registration
$('#registerForm').on('submit', function (e) {
    e.preventDefault();
    const name = $('#registerName').val();
    const email = $('#registerEmail').val();
    const password = $('#registerPassword').val();

    $.post(`${apiUrl}/register`, { name, email, password })
        .done(function (data) {
            $('#registerMessage').text(data.message).removeClass('text-danger').addClass('text-success');
        })
        .fail(function (jqXHR) {
            $('#registerMessage').text(jqXHR.responseJSON.errors.map(error => error.msg).join(', ')).addClass('text-danger');
        });
});

// Handle user login
$('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();

    $.post(`${apiUrl}/login`, { email, password })
        .done(function (data) {
            localStorage.setItem(tokenKey, data.token);
            $('#authSection').addClass('d-none');
            $('#userSection').removeClass('d-none');
            
        })
        .fail(function (jqXHR) {
            $('#loginMessage').text(jqXHR.responseJSON.error).addClass('text-danger');
        });
});

// Handle user logout
$('#logoutButton').on('click', function () {
    localStorage.removeItem(tokenKey);
    $('#authSection').removeClass('d-none');
    $('#userSection').addClass('d-none');
});

// Handle view users button click
$('#viewUsersButton').on('click', function () {
    const token = localStorage.getItem(tokenKey);

    $.ajax({
        url: `${apiUrl}/users`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    }).done(function (data) {
        const userList = $('#userList').empty();
        data.forEach(user => {
            userList.append(`<li class="list-group-item">${user.name} (${user.email})</li>`);
        });
    }).fail(function (jqXHR) {
        $('#userList').html(`<div class="alert alert-danger">${jqXHR.responseJSON.error}</div>`);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const contactButton = document.getElementById('contactButton');
    const contactFooter = document.getElementById('contactFooter');

    if (contactButton) {
        contactButton.addEventListener('click', function() {
            contactFooter.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

$(document).ready(function() {
    // Fetch and display users
    function fetchUsers() {
        $.get('/api/users', function(data) {
            $('#usersList').empty();
            data.forEach(user => {
                $('#usersList').append(`
                    <li class="list-group-item">
                        ${user.name} (${user.email}) - ${user.phone}
                        <button class="btn btn-info btn-sm float-right mr-2 edit-btn" data-id="${user.id}">Edit</button>
                        <button class="btn btn-danger btn-sm float-right delete-btn" data-id="${user.id}">Delete</button>
                    </li>
                `);
            });
        });
    }
    fetchUsers(); // Initial fetch

    // Add user
    $('#addUserForm').submit(function(event) {
        event.preventDefault();
        const name = $('#name').val();
        const email = $('#email').val();
        const phone = $('#phone').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        
        // Validate passwords
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        $.post('/api/users', { name, email, phone, password }, function(data) {
            $('#name').val('');
            $('#email').val('');
            $('#phone').val('');
            $('#password').val('');
            $('#confirmPassword').val('');
            fetchUsers();
        });
    });

    // Edit user
    $('#usersList').on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        $.get(`/api/users/${id}`, function(user) {
            $('#editUserId').val(user.id);
            $('#editName').val(user.name);
            $('#editEmail').val(user.email);
            $('#editPhone').val(user.phone);
            $('#editPassword').val(user.password);
            $('#editConfirmPassword').val(user.password);
            $('#editUserForm').show();
        });
    });

    // Update user
    $('#editUserForm').submit(function(event) {
        event.preventDefault();
        const id = $('#editUserId').val();
        const name = $('#editName').val();
        const email = $('#editEmail').val();
        const phone = $('#editPhone').val();
        const password = $('#editPassword').val();
        const confirmPassword = $('#editConfirmPassword').val();

        // Validate passwords
        if (password && password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        $.ajax({
            url: `/api/users/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name, email, phone, password }),
            success: function() {
                $('#editUserForm').hide();
                $('#editUserId').val('');
                $('#editName').val('');
                $('#editEmail').val('');
                $('#editPhone').val('');
                $('#editPassword').val('');
                $('#editConfirmPassword').val('');
                fetchUsers();
            }
        });
    });

    // Delete user
    $('#usersList').on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        $.ajax({
            url: `/api/users/${id}`,
            type: 'DELETE',
            success: function() {
                fetchUsers();
            }
        });
    });
});