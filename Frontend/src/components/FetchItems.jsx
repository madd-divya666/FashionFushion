import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemActions } from "../stores/itemSlice";
import fetchStatusSlice from "../stores/fetchStatusSlice";
import { fetchStatusActions } from "../stores/fetchStatusSlice";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(fetchStatusActions.markFetchingStarted());

    // Determine the base URL based on the hostname
    const baseURL =
      window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://fashionfushion-backend.onrender.com";

    fetch(`${baseURL}/items`, { signal })
      .then((res) => res.json())
      .then(({ items }) => {
        dispatch(fetchStatusActions.markFetchDone());

        dispatch(fetchStatusActions.markFetchingFinished());
        dispatch(itemActions.addInitialItems(items));
      });

    return () => {
      controller.abort();
    };
  }, [fetchStatus]);
  return <></>;
};
export default FetchItems;
