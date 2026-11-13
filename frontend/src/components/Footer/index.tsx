import { Icon } from "@/components/Icon";
import { LOGO_SRC } from "@/constants/barber";
import type { Shop } from "@/types/barber";
import { phoneIntl, phonePretty } from "@/utils/format";
import { socialLinksOf } from "@/utils/social";

interface FooterProps {
  shop: Shop;
}

/** Rodapé do site: marca, endereço, contatos/redes (quando preenchidos) e formas de pagamento. */
export function Footer({ shop }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <img src={LOGO_SRC} alt="Barbearia Rafael Úzeda" />
          <p>{shop.tagline}</p>
        </div>
        <div>
          <h4>Endereço</h4>
          <p className="foot-line">
            <Icon name="mapPin" />
            <span>{shop.address}</span>
          </p>
        </div>
        <ContactColumn shop={shop} />
        <div>
          <h4>Formas de pagamento</h4>
          <p className="foot-line">
            <Icon name="banknote" />
            <span>Dinheiro</span>
          </p>
          <p className="foot-line">
            <Icon name="card" />
            <span>Cartão de crédito</span>
          </p>
          <p className="foot-line">
            <Icon name="card" />
            <span>Cartão de débito</span>
          </p>
        </div>
      </div>
      <div className="foot-bottom">
        {`© ${new Date().getFullYear()} ${shop.name}. Todos os direitos reservados.`}
      </div>
    </footer>
  );
}

function ContactColumn({ shop }: FooterProps) {
  const wa = phoneIntl(shop.whatsapp);
  const tel = phoneIntl(shop.phone || shop.whatsapp);
  const social = socialLinksOf(shop);
  if (!wa && !tel && !social.length) return null;
  return (
    <div>
      <h4>Contato</h4>
      {wa && (
        <a className="foot-line" href={`https://wa.me/${wa}`} target="_blank" rel="noopener">
          <Icon name="whatsapp" />
          <span>{` ${phonePretty(wa)}`}</span>
        </a>
      )}
      {tel && (
        <a className="foot-line" href={`tel:+${tel}`}>
          <Icon name="phone" />
          <span>{phonePretty(tel)}</span>
        </a>
      )}
      {social.length > 0 && (
        <div className="foot-social">
          {social.map((s) => (
            <a
              key={s.label}
              className="foot-social-link"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              <Icon name={s.icon} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
