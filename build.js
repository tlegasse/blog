import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

// Listenbrainz
const LB_BASE_URL = 'https://api.listenbrainz.org'
const LB_USERNAME = process.env.LISTENBRAINZ_USERNAME
const LB_PASSWORD = process.env.LISTENBRAINZ_USER_KEY

const ALBUMS_PATH = "./content/recent_albums"

// Grab listenbrainz listens
async function getLbData() {
  const header = {
    "Authorization": `Token ${LB_PASSWORD}`,
  }

  const raw = await fetch(`${LB_BASE_URL}/1/user/${LB_USERNAME}/listens`, {
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

    if (albums[meta.release_name]) continue;

    albums[meta.release_name] = {
      artist: meta.artist_name,
      mbid: meta.mbid_mapping.release_mbid,
    }
  }

  for (const albumTitle in albums) {
    const album = albums[albumTitle];
    const artData = await getCoverArt(album.mbid);
    const { images } = artData

    if (!images) continue;

    for (const image of images) {
      if (!image.front) continue

      album.image = image.image;
    }
  }

  return albums
}

function resetAlbumsDir() {
  fs.rmSync(ALBUMS_PATH,
    {
      recursive: true,
      force: true
    }
  );

  fs.mkdirSync(
    ALBUMS_PATH
  )
}

async function writeAlbumMd(albums) {
  for (const albumTitle in albums) {
    const album = albums[albumTitle]

    const filename = `${ALBUMS_PATH}/${albumTitle.toLowerCase().replace(/ /g, '-')}.md`;

    const fileContents = `---
title: ${albumTitle}
image: ${album.image}
artist: ${album.artist}
url: ${album.mbid}
---`


    fs.writeFileSync(
      filename,
      fileContents
    )
  }
}

async function populateDynamicData() {
  const albums = await getAlbumData()
  console.log(albums)
  resetAlbumsDir()
  await writeAlbumMd(albums)
}

populateDynamicData()
