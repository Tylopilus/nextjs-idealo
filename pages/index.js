import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  const clickHandler = async (e) => {
    e.preventDefault();
    const data = await fetch(`/api/hello?query=${query}`).then((res) =>
      res.json()
    );
    // const text = await data.json();
    setResult(data);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://idealo.de">Idealo Search!</a>
        </h1>
        <section>
          <form>
            <input
              type="text"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />{' '}
            <button onClick={clickHandler}>search</button>
          </form>
        </section>
        <section>
          {result &&
            result.map((item) => (
              <div key={item.id}>
                <img src={item.imageUrl} alt={item.title} />
                <h3>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p>{item.offerInfo.formattedPrice}</p>
              </div>
            ))}
        </section>
      </main>
      <footer className={styles.footer}>
        <a href="https://next.new" target="_blank" rel="noopener noreferrer">
          Created with&nbsp;<b>next.new</b>&nbsp;⚡️
        </a>
      </footer>
    </div>
  );
}
