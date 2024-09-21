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