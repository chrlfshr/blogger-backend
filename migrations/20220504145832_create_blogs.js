/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("post", table => {
    table.increments('id')
    table.integer('user_id')
    table.foreign('user_id')
         .references("users.id")
    table.string("title", 250)
    table.string("content", 1000)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('post', table =>{
    table.dropForeign("user_id")
  })
  .then(() => {
    return knex.schema.dropTableIfExists("post")
  })
};
