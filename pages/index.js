//imports
import { Inter, Mooli, Roboto, Titillium_Web } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

// component imports
import Image from "next/image";
import Head from "next/head";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] });
const titillium = Titillium_Web({ subsets: ["latin"], weight: "600" });

export default function Home() {
  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API fetch logic
  useEffect(() => {
    const queryOptions = {
      select: "id name date_utc success upcoming details failures links",
      sort: "date_utc",
      limit: 150,
    };
    // fetch data from API
    const getlaunchData = async () => {
      try {
        const url = "https://api.spacexdata.com/v5/launches/query";
        const response = await axios.post(url, {
          options: queryOptions,
        });


        // Store response locally, use the docs node
        setApiData(response.data.docs);
      } catch (error) {
        console.error(error);
      }
    };
    // Call the API
    getlaunchData();
  }, []);


  const totalPages = Math.ceil(apiData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = apiData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <main className={`${styles.main} ${roboto.className}`}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='space x monitor' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <h1 className={`${styles.title} ${titillium.className}`}>
        🚀 SpaceX Launch Tracker
      </h1>

      {apiData.length === 0 ? (
        <p className={styles.loading}>Loading launches...</p>
      ) : (
        <section className={styles.main__section}>
          {currentItems.map((launch) => (
            <div key={launch.id} className={styles.launch_card}>
              <Image
                src={launch.links.patch.small}
                alt="Rocket Patch"
                width={200}
                height={200}
                className={styles.patch}
              />
              <h2>{launch.name}</h2>
              <div className={styles.card__content}>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(launch.date_utc).toLocaleDateString()}
                </p>
                <p>
                  {launch.details}
                </p>
                {!launch.success && <p>
                  <strong>Failure Reason :</strong> {launch.failures[0].reason}
                </p>}
                <p>
                  <strong>Success:</strong>
                  <span
                    className={`${styles.badge} ${launch.success ? styles.success : styles.failure
                      }`}
                  >
                    {launch.success ? 'Success' : 'Failure'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={i + 1 === currentPage ? styles.activePage : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
