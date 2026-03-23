// utils/imagePicker.web.ts
export const pickImageFromLibrary = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) resolve(URL.createObjectURL(file));
      else resolve(null);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
};
