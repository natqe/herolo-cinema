export const general = {
  OMDB_API_KEY:  new URL(location.href).searchParams.get('omdbkey'),
  OMDB_API_ORIGIN:  'http://www.omdbapi.com/',
}