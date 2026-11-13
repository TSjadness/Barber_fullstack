import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import type { Staff } from "@/types/barber";

interface TeamCardProps {
  member: Staff;
  onZoomPhoto: (src: string, name: string) => void;
  onBook: (staffId: string) => void;
}

/** Profissional no site público, com foto ampliável e atalho para agendar com ele. */
export function TeamCard({ member, onZoomPhoto, onBook }: TeamCardProps) {
  const { photo, name } = member;
  return (
    <div className="card team-card">
      {photo ? (
        <button
          className="team-photo-btn"
          onClick={() => onZoomPhoto(photo, name)}
          aria-label={`Ampliar foto de ${name}`}
        >
          <img className="team-photo" src={photo} alt={name} />
          <span className="team-photo-zoom">
            <Icon name="plus" />
          </span>
        </button>
      ) : (
        <Avatar name={name} />
      )}
      <div>
        <h3 style={{ margin: 0 }}>{name}</h3>
        <p>{member.role}</p>
      </div>
      <Button small style={{ marginLeft: "auto" }} onClick={() => onBook(member.id)}>
        Agendar
      </Button>
    </div>
  );
}
