import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { ServiceCard } from "@/components/ServiceCard";
import { TeamCard } from "@/components/TeamCard";
import { useDb } from "@/hooks/useBarberData";
import { useNavigation } from "@/hooks/useNavigation";
import { useOverlay } from "@/hooks/useOverlay";

const sectionDivider = { borderTop: "1px solid var(--line)" };

/** Site do cliente: destaque, serviços, equipe, essência e rodapé. */
export function PublicPage() {
  const db = useDb();
  const { newBooking, startBooking, chooseProfessional } = useNavigation();
  const { showPhoto } = useOverlay();
  const { shop } = db;
  const whatsapp = shop.whatsapp ? "https://wa.me/" + shop.whatsapp.replace(/\D/g, "") : "";

  return (
    <>
      <div className="public-hero">
        <div className="hero-inner bf-enter">
          <span className="eyebrow">Sua barbearia, seu estilo</span>
          <h1>
            Mais que um corte.
            <br />
            <span style={{ color: "var(--gold)" }}>Uma experiência.</span>
          </h1>
          <p>{`${shop.tagline} Agende seu horário em poucos passos, sem precisar ligar ou esperar.`}</p>
          <div className="hero-actions">
            <Button variant="primary" onClick={newBooking}>
              Agendar meu horário <Icon name="arrowRight" />
            </Button>
            <a className="btn ghost" href={whatsapp || "#services"}>
              {whatsapp ? (
                <>
                  <Icon name="whatsapp" /> WhatsApp
                </>
              ) : (
                <>
                  Ver serviços <Icon name="arrowDown" />
                </>
              )}
            </a>
          </div>
          <div className="hero-ribbon">
            <span>
              <Icon name="award" /> Atendimento personalizado
            </span>
            <span>
              <Icon name="shield" /> Profissionais experientes
            </span>
            <span>
              <Icon name="clock" /> Seu horário, no seu ritmo
            </span>
          </div>
        </div>
      </div>
      <main>
        <section className="wrap section" id="services">
          <div className="section-title">
            <div>
              <div className="eyebrow">O QUE FAZEMOS</div>
              <h2>Nossos serviços</h2>
              <div className="muted">Escolha como quer renovar seu visual.</div>
            </div>
            <Chip>Atendimento com horário marcado</Chip>
          </div>
          <div className="service-grid">
            {db.services
              .filter((s) => s.active)
              .map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} onBook={startBooking} />
              ))}
          </div>
        </section>
        <section className="wrap section" style={sectionDivider}>
          <div className="section-title">
            <div>
              <div className="eyebrow">NOSSO TIME</div>
              <h2>Quem cuida do seu estilo</h2>
            </div>
          </div>
          <div className="team-grid">
            {db.staff
              .filter((p) => p.active)
              .map((p) => (
                <TeamCard
                  key={p.id}
                  member={p}
                  onZoomPhoto={showPhoto}
                  onBook={chooseProfessional}
                />
              ))}
          </div>
        </section>
        <section className="wrap section essence" style={sectionDivider}>
          <div className="eyebrow">NOSSA ESSÊNCIA</div>
          <h2>Uma pausa para você.</h2>
          <p className="muted">{shop.address}</p>
          <Button variant="primary" className="essence-cta" onClick={newBooking}>
            Reservar um horário
          </Button>
        </section>
      </main>
      <Footer shop={shop} />
    </>
  );
}
