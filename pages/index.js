import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Banner from '@/components/banner'
import Card from '@/components/card'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import useTrackLocation from "../hooks/use-location-info"
import { useContext, useEffect, useState } from 'react'
import { ACTION_TYPES, StoreContext } from '../store/storeContext'

export async function getStaticProps(context){
  const CoffeeStores = await fetchCoffeeStores() 

  return {
    props: {
      CoffeeStores,
    }
  }
}

export default function Home(props) {
  const {dispatch , state} = useContext(StoreContext)
  const {coffeeStores , latLong}= state
  // const [userCoffeeStore , setUserCoffeStore] = useState("")
  const [coffeeStoreError , setCoffeeStoreError] = useState(null)


  const call = async () => {
    const fetchedStores = await fetchCoffeeStores(latLong , 30)
    dispatch({
      type: ACTION_TYPES.SET_COFFEE_STORES,
      payload : {
        coffeeStores : fetchedStores
      }
    })
  }

  const {handleTrackLocation , LocationErrorMsg , IsLoading} = useTrackLocation()

  useEffect(() => {
    if(latLong){
      try{
        call();
        setCoffeeStoreError(null)
      }
      catch(err){
        console.log(err)
        setCoffeeStoreError(err.message)
      }
    }
  } , [latLong])



  const handleOnBannerBtnClick = async () => {
    handleTrackLocation();
  }

  return (
    <>
      <Head>
        <title>Find Your coffee</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner buttonText={IsLoading ? "Locating..." :  "View Stores nearby"} handleOnClick={handleOnBannerBtnClick}/>
        {LocationErrorMsg && <p>Something went wrong: {LocationErrorMsg}</p>}
        {coffeeStoreError && <p>Something went wrong: {coffeeStoreError}</p >}
        <div className={styles.heroImage}>
        <Image alt='heroImage' src='/static/hero-image.png' width={700} height={400} />
        </div>

        {coffeeStores.length > 0 && (
        <>
        <div className={styles.sectionWrapper}>
        <h2 className={styles.heading2}>Stores Near You</h2>
        <div className={styles.cardLayout}>
        {coffeeStores.map((coffeeStore) => {
          return(<Card
            key={coffeeStore.fsq_id}
            name={coffeeStore.name}
            href={`/coffee-store/${coffeeStore.fsq_id}`}
            imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
            className={styles.card} />)
        })}
        </div>
        </div>
        </>
        )}


        {props.CoffeeStores.length > 0 && (
        <>
        <div className={styles.sectionWrapper}>
        <h2 className={styles.heading2}>Bhopal Stores</h2>
        <div className={styles.cardLayout}>
        {props.CoffeeStores.map((coffeeStore) => {
          return(<Card
            key={coffeeStore.fsq_id}
            name={coffeeStore.name}
            href={`/coffee-store/${coffeeStore.fsq_id}`}
            imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
            className={styles.card} />)
        })}
        </div>
        </div>
        </>
        )}
      </main>
    </>
  )
}
