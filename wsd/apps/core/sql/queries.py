from apps.core.sql.utils import sql

CREATE_HEX_TO_INT_FUNCTION = sql(
    """
    CREATE OR REPLACE FUNCTION hex_to_int(hex varchar)
    RETURNS integer AS
    $$
    DECLARE
      result  int;
    BEGIN
    EXECUTE 'SELECT x''' || hex || '''::bigint' INTO result;
      RETURN result;
    END;
    $$
    LANGUAGE 'plpgsql' IMMUTABLE STRICT;
    """
)
