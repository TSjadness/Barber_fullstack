/**
 * Funcionalidade: Foto do profissional
 *
 * Responsabilidade:
 * Ler a imagem escolhida no cadastro do profissional, reduzi-la para no máximo
 * 480px no maior lado e convertê-la em JPEG (data URL) para ser salva junto ao
 * cadastro, sem depender de armazenamento de arquivos.
 *
 * Origem:
 * Função `pickStaffPhoto` anteriormente implementada no arquivo public/barber/app.js.
 */

const MAX_SIDE = 480;
const JPEG_QUALITY = 0.82;

export class PhotoError extends Error {}

export function resizeStaffPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/"))
    return Promise.reject(new PhotoError("Escolha um arquivo de imagem."));
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new PhotoError("Não foi possível ler a imagem."));
    };
    img.src = url;
  });
}
