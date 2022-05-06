/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('post').del()
  await knex('users').del()
  await knex('users').insert([
    {first_name: 'John', last_name: 'Doe', username: 'JoDoe', password: "$2b$10$KdcAUQU5NVrqHBgw6KbA1eBCkIACRRLkOrBTyVTicFrvo8NDDTGD."},
    {first_name: 'Jane', last_name: 'Doe', username: 'JaneD', password: "$2b$10$V5aQPUooeLO2kEum.vdO0.zbX.qHkKN3yXKp7u14eQzTy4zbFW5ay"}
  ]);
};
