require("dotenv").config();
const genius = require("genius-lyrics");
const slugify = require("slugify");
const fs = require("fs");
const Genius = new genius.Client(process.env.GENIUS);
const initialYear = 2006;
const slugConfig = { remove: /[*+~./?()'"!:@]/g };

const fetch = async data => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const filePath = `./public/lyrics/${slugify(
      item.artist,
      slugConfig
    )}-${slugify(item.title, slugConfig)}.json`;

    if (!fs.existsSync(filePath)) {
      try {
        const searchResult = await Genius.tracks.search(
          `${item.title} ${item.artist}`
        );

        const song = await Genius.tracks.get(searchResult[0].id);
        const {
          titles: { full: full_title },
          url,
        } = song;
        const lyrics = await song.lyrics();

        fs.writeFileSync(
          filePath,
          JSON.stringify({ title: full_title, lyrics, url })
        );
      } catch (e) {
        console.log(e);
        fs.writeFileSync(filePath, JSON.stringify({ reason: "MISSING" }));
        console.log(`${item.title} by ${item.artist} failed`);
      }
    }
  }
};

(async () => {
  for (let year = initialYear; year <= new Date().getFullYear(); year++) {
    await fetch(require(`../src/data/${year}.json`));
  }
})();
