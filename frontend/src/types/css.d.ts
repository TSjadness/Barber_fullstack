import "react";

declare module "react" {
  /** Permite variáveis CSS (`--nome`) no atributo `style`. */
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
