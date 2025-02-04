export function useSubmitCallback<T = unknown>(
  cb: (formState: T) => void
): React.FormEventHandler<HTMLFormElement> {
  return (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    cb(Object.fromEntries(formData.entries()) as T);
  };
}
