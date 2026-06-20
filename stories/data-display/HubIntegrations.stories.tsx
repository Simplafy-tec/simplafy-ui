import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ProviderLogo } from "../../src/components/provider-logo";
import { AccessBadge } from "../../src/components/access-badge";
import { AccessNote } from "../../src/components/access-note";
import { SyncPill } from "../../src/components/sync-pill";
import { OAuthConsent } from "../../src/components/oauth-consent";

const meta = {
  title: "Data Display/Hub Integrations",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProviderLogos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(["gdrive", "dropbox", "onedrive", "box", "s3", "ftp"] as const).map((id) => (
        <div key={id} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <ProviderLogo id={id} size={28} />
          {id}
        </div>
      ))}
    </div>
  ),
};

export const AccessBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <AccessBadge kind="account" />
      <AccessBadge kind="link" />
    </div>
  ),
};

export const AccessNotes: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <AccessNote kind="account">
        <strong>Sua conta.</strong> Você autoriza o Hub a ler uma pasta da sua conta. Atualiza em{" "}
        <strong>tempo real</strong>.
      </AccessNote>
      <AccessNote kind="link">
        <strong>Link de terceiro.</strong> Cole a URL compartilhada; o Hub re-sincroniza no intervalo escolhido.
      </AccessNote>
    </div>
  ),
};

export const SyncPills: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <SyncPill status="active" />
      <SyncPill status="syncing" />
      <SyncPill status="error" />
      <SyncPill status="disabled" />
    </div>
  ),
};

export const OAuthConsentReady: Story = {
  render: () => (
    <OAuthConsent
      providerName="Google Drive"
      oauthLabel="Google"
      providerId="gdrive"
      account="vendas@vidaplena.com.br"
      onAuthorize={() => undefined}
      onCancel={() => undefined}
    />
  ),
};

export const OAuthConsentAuthorizing: Story = {
  render: () => (
    <OAuthConsent
      providerName="Dropbox"
      providerId="dropbox"
      state="authorizing"
      onAuthorize={() => undefined}
    />
  ),
};

export const OAuthInteractive: Story = {
  render: function Render() {
    const [state, setState] = useState<"ready" | "authorizing">("ready");
    return (
      <OAuthConsent
        providerName="OneDrive"
        oauthLabel="Microsoft"
        providerId="onedrive"
        state={state}
        onAuthorize={() => {
          setState("authorizing");
          setTimeout(() => setState("ready"), 1800);
        }}
        onCancel={() => setState("ready")}
      />
    );
  },
};
