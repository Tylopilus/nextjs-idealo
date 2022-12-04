// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { parse } from 'node-html-parser';
import { NextRequest, NextResponse } from 'next/server';
function filterProducts(data) {
  return data.filter((item) => item.trackingKey === 'product');
}

async function getProductId({ url }) {
  const productID = url.match(/.*OffersOfProduct\/(\d+)/)[1];
  // console.log(productID);
  return productID;
  // return data.find((item) => item.trackingKey === 'product');
}

async function getProductData(productIds) {
  const IdsToString = productIds.join(',');
  console.log(IdsToString);
  const { items } = await fetch(
    `https://www.idealo.de/disco/api/products?locale=de_DE&productIds=${IdsToString}`
  ).then((res) => res.json());
  console.log(items);
  return items.map((product) => {
    const {
      id,
      title,
      imageUrl,
      href,
      offerInfo: { formattedPrice },
    } = product;
    return { id, title, imageUrl, href, offerInfo: { formattedPrice } };
  });
}

const getProducts = async (search) => {
  var myHeaders = new Headers();
  myHeaders.append('authority', 'www.idealo.de');
  myHeaders.append(
    'accept',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
  );
  myHeaders.append('accept-language', 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7');
  myHeaders.append('cache-control', 'max-age=0');
  myHeaders.append(
    'user-agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
  );
  myHeaders.append(
    'Cookie',
    'SSLB=1; ak_bmsc=23871BACE4302B8641822DBBD67BD693~000000000000000000000000000000~YAAQBKAkF36S09aEAQAAG3B73hLuY6h6y/lijF2M718PGU5UpRstvMD67i1HykNrbAAQzsky2eKvLQvxQ+ZiI2UQxdKdnurdYOisQ+ClfsQnMSlbjKrRWTOnomu2TzfpvIb+xtv0N9ZtaC0zqXEEmiCQ9r7nd3qtfS6oVHZmS+E+a1+PlpKsiIRX5HmMEd85CvnWw/Dg2ljTdp1ST2evF1t3WH5Nyt0xGiqcsXHDkcZybtYZ6cJ/jSYmCael1nUi6t9mXvfz/UwT3fNK3xgBi8nxHG6P5GkxAM01qUO+fhh826wiglq7viRMqCKB7DtFQ6Q4aah654EU1eX3ocnQl/RXGa+xaiYU+KH9ohPi0FON9hdAXFUSdWdSTE1os0vZTCv5DfrHGlDs+ECFEwtgtvCgpfiq6PmD9N7bULZKOr/OtapSejkv+2F9oXCXOZbQAeix/skuHTlWEzMSQXmJhmY0KFjDnyBMcOlf6jEB1Y0Od/E=; bm_mi=8CA23009234019B9F84CBA134507B188~YAAQBKAkFwGA09aEAQAAgfd63hIRNWED8AY0tuiyXAq973Z4QloYlrjOTA7APgjN93Lyl65rX+bicVeP88mi/mk3Y6GtO9228ZX5YqB2xZ66eLCco6AOj6FgHvqvYvFY+NQRKtJXz9DtoYaS8+F23wma9QuhpSJ5rJ7myDqbw1F2ES/drJc1FTcfPFHRJqlVeZobXzmzXCj+DZcHsdLQPqGOi6V9S9WQn9KN9KEt8+CXXlv76lSCSKC8zT5gZ7riSWgow2hU604FuG/9T1QkXN0+vP3Lji8ODXGmyVZxLxOOBLwtIjJ2ZtwGqKMfnuBm6DGLEe1N2aC9gLmqKciRiL6MupCPXXS1/1+96zS8JQNo+8sdLn6Ebs+4LkeZpB4=~1; bm_sv=FACABEECFEDFC35AB604164AFD1357D8~YAAQBKAkFxyY09aEAQAAc5F73hKXisaWKZCuNV6/l2vOHHYmgEfc/hRpJ7h6qcsxXzTx/VzVV05X3mHF0yUK6mVpG3X0beecwmrhNlP+j/TjIu7SeaRQg3J3cGuYqCN/WCJw9bTTwzQT1QKktwk4Bi3XlLerUCdJg/Q7c7kUsfTlVUUmUtUYGr/7zNQZGa6xaXR0UpjbrwgJo91KlDzT/F7gZVHDITSV2VAanEGDxc+hhX1Ubdwk/1ZD6XJG87tB~1; ipcuid=01d80h0000lalic99m; sessionid=1670179385-e571b0ae-4b3d-4c09-8631-771478a1189c; JSESSIONID=A757544A4DFB3DF7436AE5E67A55D1ED'
  );

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  return fetch(
    `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${search}&qd=${search}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      // console.log(result);
      // console.log({ result });
      const root = parse(result);
      console.log({ root });
      const products = [];
      root.querySelectorAll(':not(form)[data-sp-itemid]').forEach((item) => {
        const productItem = item.attrs['data-sp-itemid'];
        console.log({ productItem });
        products.push(productItem);
      });
      return products;
    })
    .catch((error) => {
      console.log('error', error);
      throw error;
    });
};

export default async (req, res) => {
  // Open Chrome DevTools to step through the debugger!
  // debugger;
  try {
    console.log('query', req.query.query);
    // const fetchedProducts = await getProducts( req.nextUrl.searchParams.get('query')
    // );
    const fetchedProducts = await getProducts(req.query.query);
    console.log({ fetchedProducts });
    //   const parsedProducts = filterProducts(data.groups[0].items);
    const products = await getProductData(fetchedProducts);
    console.log({ products });
    // NextResponse.json({body:products});
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    // NextResponse.error();
    res.status(500).json({ error: err });
  }
};
// export const config = {
//   runtime: 'experimental-edge',
// };
