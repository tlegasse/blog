import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

// Listenbrainz
const LB_BASE_URL = 'https://api.listenbrainz.org'
const LB_USERNAME = process.env.LISTENBRAINZ_USERNAME
const LB_PASSWORD = process.env.LISTENBRAINZ_USER_KEY

const DATA_PATH = "./assets/data/"
const MB_ALBUM_BASE_URL = "https://musicbrainz.org/release/"

// Grab listenbrainz listens
async function getLbData() {
  const header = {
    "Authorization": `Token ${LB_PASSWORD}`,
  }

  const raw = await fetch(`${LB_BASE_URL}/1/user/${LB_USERNAME}/listens?count=200`, {
    method: "GET",
    headers: header
  });

  if (!raw.ok) {
    return false;
  }

  const data = await raw.json();

  return data
}

async function getCoverArt(mbid) {
  const header = {
    "Accept": "application/json",
  }

  const url = `https://coverartarchive.org/release/${mbid}`

  const raw = await fetch(
    url,
    {
      headers: header
    }
  )

  if (!raw.ok) return false;

  const data = await raw.json()

  return data
}

async function getAlbumData() {
  const data = await getLbData();
  const albums = {};

  if (!data) return;

  for (const listen of data.payload?.listens) {
    const meta = listen.track_metadata

    if (!meta.mbid_mapping?.release_mbid) {
      continue;
    }

    if (albums[meta.release_name]) {
      albums[meta.release_name].count += 1;
      continue;
    }

    if (!meta.mbid_mapping?.release_mbid) continue;

    albums[meta.release_name] = {
      title: meta.release_name,
      artist: meta.artist_name,
      count: 1,
      mbid: meta.mbid_mapping?.release_mbid,
    }
  }

  for (const albumTitle in albums) {
    const album = albums[albumTitle];
    const artData = await getCoverArt(album.mbid);
    const { images } = artData

    if (!images) {
      delete albums[albumTitle];
      continue;
    }

    for (const image of images) {
      if (!image.front) continue

      album.image = image.image;
    }
  }

  const sortedAlbumNames = Object.keys(albums).sort((a, b) => {
    return albums[b].count - albums[a].count
  })

  const albumsToReturn = {}

  for (const name of sortedAlbumNames) {
    albumsToReturn[name] = albums[name]
  }

  return Object.values(albumsToReturn);
}

function resetAlbumsDir() {
  fs.rmSync(DATA_PATH,
    {
      recursive: true,
      force: true
    }
  );

  fs.mkdirSync(
    DATA_PATH
  )
}

async function writeAlbums(albums) {
  const filename = `${DATA_PATH}/albums.json`;

  fs.writeFileSync(
    filename,
    JSON.stringify(albums)
  )
}

async function populateDynamicData() {
  const albums = await getAlbumData()
  resetAlbumsDir()
  await writeAlbums(albums)
}

populateDynamicData()
