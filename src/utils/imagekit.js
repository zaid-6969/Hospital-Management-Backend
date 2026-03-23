import ImageKit from "@imagekit/nodejs";

let instance = null;

const getImageKit = () => {
  if (!instance) {
    instance = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL, // keep this as you used
    });

  }

  return instance;
};

export default getImageKit;