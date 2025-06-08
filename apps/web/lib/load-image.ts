export async function loadImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = (event) => {
      if (event instanceof Event) {
        reject(new Error(event.type));
      } else {
        reject(new Error(event));
      }
    };
  });
}
