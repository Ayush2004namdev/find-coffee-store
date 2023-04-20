import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStore = (query , latLong , limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

const fetchCoffeeImages = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee-stores",
    perPage: 30,
  });
  // console.log(photos)
  const unsplashImages = photos.response.results
  
  return unsplashImages.map(result => {
    return result.urls["small"]
  })
}

export const fetchCoffeeStores = async( latLong = "22.664833,76.033089" , limit = 6 ) => {
  
    const photos = await fetchCoffeeImages()
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_FORESQUARE_API_KEY 
        }
      };
      
      const response = await fetch( getUrlForCoffeeStore("coffee store",latLong, limit), options)
      const data = await response.json()
      return data.results.map((result , i) => {
        return {
          name:result.name,
          fsq_id : result.fsq_id,
          formatted_address : result.location.formatted_address,
          country: result.location.country,
          imgUrl : photos.length > 0 ? photos[i] : null
        }
      })
} 