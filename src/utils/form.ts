export function useSubmitCallback<T = unknown>(
  cb: (formState: T, formElement: HTMLFormElement) => void
): React.FormEventHandler<HTMLFormElement> {
  return (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    cb(Object.fromEntries(formData.entries()) as T, event.target as HTMLFormElement);
  };
}
