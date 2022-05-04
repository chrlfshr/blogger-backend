/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('post').del()
  await knex('post').insert([
    {user_id: 1, title: 'Stuff', creation_date: "Wed May 04 2022 10:47:09 GMT-0600 (Mountain Daylight Time)", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet consectetur adipiscing elit duis. Amet venenatis urna cursus eget. Volutpat diam ut venenatis tellus in metus. Vel orci porta non pulvinar neque. A cras semper auctor neque vitae tempus quam pellentesque. Arcu risus quis varius quam quisque id. Gravida in fermentum et sollicitudin ac orci. Elementum curabitur vitae nunc sed velit dignissim sodales ut eu. Non quam lacus suspendisse faucibus interdum. Consectetur adipiscing elit pellentesque habitant. Ac turpis egestas sed tempus urna et. Risus ultricies tristique nulla aliquet enim tortor at auctor."},
    {user_id: 2, title: 'More Stuff', creation_date: "Wed May 04 2022 10:49:15 GMT-0600 (Mountain Daylight Time)", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet consectetur adipiscing elit duis. Amet venenatis urna cursus eget. Volutpat diam ut venenatis tellus in metus. Vel orci porta non pulvinar neque. A cras semper auctor neque vitae tempus quam pellentesque. Arcu risus quis varius quam quisque id. Gravida in fermentum et sollicitudin ac orci. Elementum curabitur vitae nunc sed velit dignissim sodales ut eu. Non quam lacus suspendisse faucibus interdum. Consectetur adipiscing elit pellentesque habitant. Ac turpis egestas sed tempus urna et. Risus ultricies tristique nulla aliquet enim tortor at auctor."}
  ]);
};
