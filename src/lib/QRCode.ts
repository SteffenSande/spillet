import QRCode from "qrcode";

export const generateQrCode = async (url: string) => {
  return await QRCode.toDataURL(url);
};
