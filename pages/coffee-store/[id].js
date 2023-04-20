import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import cls from "classnames"
import Head from "next/head"
import styles from "../../styles/coffee-store.module.css"
import { fetchCoffeeStores } from "@/lib/coffee-stores"
import { useContext, useState , useEffect } from "react"
import { StoreContext } from "@/store/storeContext"
import {isEmpty} from "../../utils/index"
import useSwr from 'swr'


export async function getStaticProps(staticProps){
  const CoffeeStores = await fetchCoffeeStores()
  const params = staticProps.params
  const findCoffeeStoreById = CoffeeStores.find(coffeeStore => {
    return coffeeStore.fsq_id.toString() === params.id;
  })
  return {
    props : {
      coffeeStore : findCoffeeStoreById ? findCoffeeStoreById : {}
      }
  }
}

export async function getStaticPaths(){
  const CoffeeStores = await fetchCoffeeStores()
  const paths = CoffeeStores.map(coffeeStore => {
    return {
      params : {
        id : coffeeStore.fsq_id.toString(),
      }
    }
  })

  return {
    paths,
    fallback: true,
  }
}


const CoffeeStore = (initialProps) => { 



  const router = useRouter()
  if(router.isFallback){
    return <div>Loading...</div>
  }
  const id = router.query.id
  const [coffeeStore, SetCoffeeStores] = useState(initialProps.coffeeStore)
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateStore = async (coffee) => {
    try{
      const  {fsq_id , name , imgUrl , formatted_address} = coffee
      const response = await fetch("/api/createCoffeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify({
          id : fsq_id,
          name,
          rating : 0,
          imageUrl : imgUrl,
          location : formatted_address
        })
      })
      const dbStore = await response.json()
    }
     
    catch(err){
      console.log(err)
  }
  }
  

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.fsq_id.toString() === id; //dynamic id
        });
        SetCoffeeStores(findCoffeeStoreById);
        handleCreateStore(findCoffeeStoreById)
      }
    }else{
      handleCreateStore(initialProps.coffeeStore)
    }
  }, [id , initialProps, initialProps.coffeeStore]);

  
  const {formatted_address,location, imgUrl, name , imageUrl} = coffeeStore
  
  
  const [votingCount , setVotingCount] = useState(0)
  const fetcher =(url) => fetch(url).then((res)=> res.json())
  const {data } = useSwr(`/api/getCoffeeStoreById?id=${id}`, fetcher)
  
  useEffect(() => {
    if(data && data.length > 0){
      SetCoffeeStores(data[0])
      setVotingCount(data[0].rating)
    }
  }, [data])

  const handleUpvoteButton =async () => {
    try{
    const response = await fetch("/api/upvoteStore", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        id ,
      })
    })
    const data = await response.json()
    if(data && data.length > 0){
    const count = votingCount + 1;
    setVotingCount(count)
    }
  }
  catch(err){
    console.error("error retriving data" , err)
  }
  }

  return (
    <div className={styles.layout}>
    <Head>
      <title>{name}</title>
    </Head>
    <div className={styles.container}>
      <div className={styles.col1}>
        <div className={styles.backToHomeLink}>
          <Link href="/">
          ← Back to home
          </Link>
        </div>
        <div className={styles.nameWrapper}>
          <h1 className={styles.name}>{name}</h1>
        </div>
        <Image
          src={ imgUrl || imageUrl }
          width={600}
          height={360}
          className={styles.storeImg}
          alt={name}
        />
      </div>

      <div className={cls("glass", styles.col2)}>
        <div className={styles.iconWrapper}>
          <Image src="/static/icons/places.svg" alt="icons" width="24" height="24" />
          <p className={styles.text}>{formatted_address || location}</p>
        </div>
        {/* <div className={styles.iconWrapper}>
          <Image src="/static/icons/nearMe.svg" alt="icons" width="24" height="24" />
          <p className={styles.text}>{country}</p>
        </div> */}
        <div className={styles.iconWrapper}>
          <Image src="/static/icons/star.svg" alt="icons" width="24" height="24" />
          <p className={styles.text}>{votingCount}</p>
        </div>

        <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
          Up vote!
        </button>
      </div>
    </div>
  </div>
  );
}

export default CoffeeStore;