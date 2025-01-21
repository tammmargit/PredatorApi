exports.seed = function(knex) {
    return knex('users').del()
        .then(function () {
            return knex('users').insert([
                {
                    Username: 'admin',
                    Firstname: 'Admin',
                    Lastname: 'User',
                    Email: 'admin@example.com',
                    SecureLevel: 3,
                    Password: 'admin123'
                },
                {
                    Username: 'user',
                    Firstname: 'Normal',
                    Lastname: 'User',
                    Email: 'user@example.com',
                    SecureLevel: 1,
                    Password: 'user123'
                }
            ]);
        });
}; 