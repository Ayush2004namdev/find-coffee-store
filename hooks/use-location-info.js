import { useContext, useState } from "react"
import { StoreContext, ACTION_TYPES } from "@/store/storeContext";

const useTrackLocation = () => {
    const [LocationErrorMsg,setLocationErrorMsg] = useState("");
    // const [LatLong , setLatLong] = useState("");
    const [IsLoading , setIsLoading]  = useState(false)
    const {dispatch} = useContext(StoreContext);
    

    const success = (position) => {
        setIsLoading(false)
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // setLatLong(`${latitude},${longitude}`)
        dispatch({
            type: ACTION_TYPES.SET_LAT_LONG,
            payload: { latLong: `${latitude},${longitude}` },
          });
        setLocationErrorMsg("")
    }

    const error = () => {
        setIsLoading(false)
        setLocationErrorMsg("Sorry! cannot get your location!!")
    }

    const handleTrackLocation = () => {
        setIsLoading(true)
        if (!navigator.geolocation) {
            setLocationErrorMsg("Geolocation is not supported by your browser");
          } else {
            // status.textContent = "Locating…";
            navigator.geolocation.getCurrentPosition(success, error);
          }
    }

    return {
        // LatLong, 
        handleTrackLocation,
        LocationErrorMsg,
        IsLoading,
    }
}

export default useTrackLocation