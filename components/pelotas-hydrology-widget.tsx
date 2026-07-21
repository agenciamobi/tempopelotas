import { LAGOON_LEVEL_SOURCE } from "@/lib/lagoon-level";

type WidgetHeading = "h2" | "h3";

export type PelotasHydrologyWidgetProps = {
  headingLevel?: WidgetHeading;
  className?: string;
};

export function PelotasHydrologyWidget({
  headingLevel = "h2",
  className,
}: PelotasHydrologyWidgetProps) {
  const Heading = headingLevel;
  const rootClassName = ["ufpel-hydrology-widget", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={rootClassName} aria-labelledby="ufpel-hydrology-widget-title">
      <header className="ufpel-hydrology-widget__header">
        <div>
          <span className="eyebrow">Painel local da UFPel</span>
          <Heading id="ufpel-hydrology-widget-title">
            Monitoramento da Lagoa dos Patos no Laranjal
          </Heading>
          <p>
            O conteúdo abaixo é exibido diretamente pelo painel público do
            LabHidroSens/UFPel. O TEMPO Pelotas não define cotas, estados de
            risco ou tendências próprias para esta estação.
          </p>
        </div>
        <a href={LAGOON_LEVEL_SOURCE.dashboardUrl} target="_blank" rel="noreferrer">
          Abrir painel original <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="ufpel-hydrology-widget__frame">
        <iframe
          src={LAGOON_LEVEL_SOURCE.dashboardUrl}
          title="Painel público da Estação Laranjal do LabHidroSens e UFPel"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <small className="ufpel-hydrology-widget__attribution">
        Fonte e critérios: {LAGOON_LEVEL_SOURCE.name}. Caso o painel não carregue
        dentro da página, utilize o botão para consultar a fonte original.
      </small>
    </section>
  );
}
