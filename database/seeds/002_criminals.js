exports.seed = function(knex) {
    return knex('criminals').del()
        .then(function () {
            return knex('criminals').insert([
                {
                    Name: 'John Doe',
                    Gender: 'Male',
                    Offence: 'Robbery',
                    City: 'New York',
                    InPrison: true
                },
                {
                    Name: 'Jane Smith',
                    Gender: 'Female',
                    Offence: 'Fraud',
                    City: 'Chicago',
                    InPrison: false
                }
            ]);
        });
}; 