import { useState } from "react";
import type { AvatarProps } from "./types";
import { initialOf } from "@/utils/format";

/** Foto do profissional; sem foto (ou se a imagem falhar), mostra a inicial do nome. */
export function Avatar({ name, photo }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (photo && failedSrc !== photo)
    return (
      <img
        className="avatar avatar-img"
        src={photo}
        alt={name}
        onError={() => setFailedSrc(photo)}
      />
    );
  return <div className="avatar">{initialOf(name)}</div>;
}
