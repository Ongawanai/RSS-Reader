const getFeed = (parsedRSS) => {
  const title = parsedRSS.querySelector('title').textContent;
  const description = parsedRSS.querySelector('description').textContent;
  const link = parsedRSS.querySelector('link').textContent;
  return { title, description, link };
};

const getPosts = (parsedRSS) => {
  const items = parsedRSS.querySelectorAll('item');
  const postsList = [];
  items.forEach((item) => {
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    const title = item.querySelector('title').textContent;
    const post = { link, description, title };
    postsList.push(post);
  });
  return postsList;
};

const parseRSS = (rss, language) => {
  const parser = new DOMParser();
  const parsedRSS = parser.parseFromString(rss, 'application/xml');
  const errorNode = parsedRSS.querySelector('parsererror');
  const textInfo = document.querySelector('.statusInfo');
  if (errorNode) {
    textInfo.classList.replace('successText', 'errorText');
    textInfo.textContent = language.t('parsingError');
    throw new Error('parsingError');
  } else {
    return [getFeed(parsedRSS), getPosts(parsedRSS)];
  }
};
export default parseRSS;
