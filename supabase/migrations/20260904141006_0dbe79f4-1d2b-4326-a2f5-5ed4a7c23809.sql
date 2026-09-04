REVOKE EXECUTE ON FUNCTION public.bump_cheer(text) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.bump_cheer(text) TO service_role;