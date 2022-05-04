/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('post').del()
  await knex('users').del()
  await knex('users').insert([
    {first_name: 'John', last_name: 'Doe', username: 'JoDoe', password: "tempPassword"},
    {first_name: 'Jane', last_name: 'Doe', username: 'JaneD', password: "tempPassword"}
  ]);
};
