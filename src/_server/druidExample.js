import * as druid from "@saehrimnir/druidjs";

export function LDA(data,useClasses = true) {
  data = data.map(game => ({
    ...game,
    rating: game.rating.rating,
    num_of_reviews: game.rating.num_of_reviews
  }));

  const numberData = data.map(game => {
    return [game.year, game.minplayers, game.maxplayers, game.minplaytime, game.maxplaytime, game.minage, game.rating, game.num_of_reviews]
  });
  const classes = data.map(game => game.in_top_10_cat);
  const classes_2 = data.map(game => game.in_top_10_mech);
  const labels = useClasses ? classes : classes_2;

  const X = druid.Matrix.from(numberData); // X is the data as object of the Matrix class.

  //https://saehm.github.io/DruidJS/LDA.html
  const reductionLDA = new druid.LDA(X, { labels: labels, d: 2 }) //2 dimensions, can use more.
  const result = reductionLDA.transform()

  const resultData = result.map((d, i) => ({
    x: d[0],
    y: d[1],
    label: labels[i]
  }))

  return result;
};

