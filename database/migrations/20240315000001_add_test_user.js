exports.up = function(knex) {
  return knex('users').insert([
    {
      username: 'lauren',
      password: 'lauren123',
      role: 'admin'
    }
  ]);
};

exports.down = function(knex) {
  return knex('users').where('username', 'lauren').del();
}; 