import { useEffect, useState } from "react";

export default function useAsync(callback, dependencies = []) {
  const [loading, setLoading] = useState(true);
  const [errors, setError] = useState();
  const [value, setValue] = useState();

  const callbackMemoized = useCallback(() => {
    setLoading(false);
    setError(undefined);
    setValue(undefined);
    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, errors, value };
}
