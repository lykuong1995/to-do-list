/*
  # Enable real-time for todos table

  Adds the todos table to the supabase_realtime publication to enable
  real-time subscriptions and instant updates across clients.
*/

ALTER PUBLICATION supabase_realtime ADD TABLE todos;