// Public browser configuration only. Never put a Supabase secret/service-role
// key, a password, or a private storage URL in this repository.
// Fill these two values only AFTER running the policies in supabase/schema.sql.
window.INNER_OBSERVATORY_CONFIG = Object.freeze({
  supabaseUrl: "",
  supabasePublishableKey: "",
  bucket: "inner-observatory"
});
