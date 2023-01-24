import { WikiBirdInfo } from '../Types/WikiApiTypes';

export async function collectInfoFromWiki(
  birdName: String
): Promise<WikiBirdInfo> {
  const wikiInfoURL = encodeURI(
    `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=extracts&generator=prefixsearch&redirects=1&converttitles=1&formatversion=2&exintro=1&explaintext=1&gpssearch=${birdName}`
  );
  const infoResults = await fetch(wikiInfoURL);
  const infoData = await infoResults.json();
  const wikiImgUrl = encodeURI(
    `https://en.wikipedia.org/w/api.php?action=query&pageids=${infoData.query.pages[0].pageid}&prop=pageimages&format=json&pithumbsize=150&origin=*`
  );
  const imgResults = await fetch(wikiImgUrl);
  const imgData = await imgResults.json();
  return {
    info: infoData.query.pages[0].extract,
    imgUrl:
      imgData.query.pages[infoData.query.pages[0].pageid].thumbnail.source,
  };
}
