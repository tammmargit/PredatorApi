exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(function () {
      return knex('users').insert([
        {
          username: 'admin',
          password: 'password123', 
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: 'user',
          password: 'user123',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    });
};
