import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FormStack } from "@/components/Form";
import { PageHead } from "@/components/PageHead";
import { DEFAULT_SHOP_NAME } from "@/constants/barber";
import { useBarberData, useDb } from "@/hooks/useBarberData";
import { notify } from "@/scripts/notifications";
import type { Shop } from "@/types/barber";

/** Informações exibidas no site: nome, destaque, contatos, redes sociais e endereço. */
export function SettingsSection() {
  const db = useDb();
  const { update } = useBarberData();
  const [form, setForm] = useState({
    name: db.shop.name,
    tagline: db.shop.tagline,
    whatsapp: db.shop.whatsapp,
    phone: db.shop.phone || "",
    instagram: db.shop.instagram || "",
    facebook: db.shop.facebook || "",
    address: db.shop.address,
  });
  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const save = () => {
    const shop: Shop = {
      ...db.shop,
      name: form.name.trim() || DEFAULT_SHOP_NAME,
      tagline: form.tagline.trim(),
      whatsapp: form.whatsapp.trim(),
      phone: form.phone.trim(),
      instagram: form.instagram.trim(),
      facebook: form.facebook.trim(),
      address: form.address.trim(),
    };
    update((state) => {
      state.shop = shop;
    });
    notify("Informações atualizadas no site!");
  };

  return (
    <>
      <PageHead
        title="Configurações"
        subtitle="Personalize informações exibidas no site da barbearia."
      />
      <Card className="bf-settings-card">
        <FormStack className="bf-settings-form">
          <label>
            Nome comercial
            <input id="setName" {...field("name")} />
          </label>
          <label>
            Frase do destaque
            <input id="setTag" {...field("tagline")} />
          </label>
          <label>
            WhatsApp da barbearia
            <input id="setPhone" {...field("whatsapp")} placeholder="5579999999999" />
          </label>
          <label>
            Telefone (opcional)
            <input
              id="setPhoneAlt"
              {...field("phone")}
              placeholder="(79) 3000-0000"
              inputMode="tel"
            />
          </label>
          <fieldset className="set-social bf-settings-social">
            <legend>Redes sociais (opcional)</legend>
            <label>
              Instagram
              <input
                id="setInstagram"
                {...field("instagram")}
                placeholder="@suabarbearia ou link do perfil"
              />
            </label>
            <label>
              Facebook
              <input
                id="setFacebook"
                {...field("facebook")}
                placeholder="link da página ou nome da página"
              />
            </label>
            <small className="muted">
              Só aparecem no site as redes preenchidas. O WhatsApp usa o número acima.
            </small>
          </fieldset>
          <label className="bf-settings-address">
            Descrição / endereço
            <textarea id="setAddress" rows={3} {...field("address")} />
          </label>
          <Button variant="primary" className="bf-settings-save" onClick={save}>
            Salvar alterações
          </Button>
        </FormStack>
      </Card>
    </>
  );
}
