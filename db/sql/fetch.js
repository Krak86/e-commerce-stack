const data = [];
let key = 101;
const term = `musical%20instruments`;
const accessKey = "";
for (let page = 1; page <= 10; page++) {
  // https://api.unsplash.com/search/photos?page=1&query=sport%20item&client_id=
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${term}&client_id=${accessKey}`;
  const { results } = await (await fetch(url)).json();
  if (results) {
    data.push(
      // (1, 'https://images.unsplash.com/photo-*', true, 0)
      ...results?.map(({ urls }) => `(${key++}, '${urls?.small}', true, 0)`)
    );
  }
}
console.log(data);
