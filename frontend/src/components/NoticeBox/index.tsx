import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";

interface NoticeBoxProps {
  icon: IconName;
  title: string;
  detail: string;
  children?: ReactNode;
}

/** Aviso destacado (bloqueios e comunicados da barbearia). */
export function NoticeBox({ icon, title, detail, children }: NoticeBoxProps) {
  return (
    <div className="notice">
      <strong>
        <Icon name={icon} />
        {` ${title}`}
      </strong>
      {detail}
      {children}
    </div>
  );
}
