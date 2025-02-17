import { useSnackbar } from "notistack";

const useCustomSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message, variant = "default", options = {}) => {
    const { autoHideDuration = 3500 } = options;
    const key = enqueueSnackbar(message, {
      variant,
      autoHideDuration,
    });

    return key;
  };

  return { showSnackbar };
};

export default useCustomSnackbar;
